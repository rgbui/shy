
import { User } from "./user/user";
import { Sln } from "./sln";
import { Events } from "rich/util/events";
import { Supervisor } from "./supervisor";
import { ShyUrl, UrlRoute } from "../history";
import { LinkWorkspaceOnline, Workspace } from "./workspace";
import { computed, makeObservable, observable, runInAction } from "mobx";
import { CacheKey, sCache } from "../../net/cache";
import { channel } from "rich/net/channel";
import "./message.center";
import { PageItem } from "./sln/item";
import { PageViewStores } from "./supervisor/view/store";
import { config } from "../../common/config";
import { masterSock } from "../../net/sock";

export class Surface extends Events {
    constructor() {
        super();
        makeObservable(this, {
            supervisor: observable,
            user: observable,
            sln: observable,
            workspace: observable,
            temporaryWs: observable,
            wss: observable,
            showJoinTip: computed,
            showSlideBar: computed,
            showSln: computed,
            mobileSlnSpread: observable,
            slnSpread: observable,
            showWorkspace: computed,
            accessPage: observable
        });
    }
    mobileSlnSpread: boolean = null;
    slnSpread: boolean = null;
    supervisor: Supervisor = new Supervisor();
    user: User = new User();
    sln: Sln = new Sln();
    workspace: Workspace = null;
    wss: LinkWorkspaceOnline[] = [];
    temporaryWs: LinkWorkspaceOnline = null;
    /**
     * 当前页面的访问权限
     * none: 无权限
     * accessWorkspace: 可以访问工作区
     * accessPage: 可以访问页面
     * forbidden: 禁止访问
     */
    accessPage: 'none' | 'forbidden' | 'accessWorkspace' | 'accessPage' = 'none';
    async loadWorkspaceList() {
        if (this.user.isSign) {
            var r = await channel.get('/user/wss');
            if (r?.ok) {
                var list: LinkWorkspaceOnline[] = r.data.list;
                list.forEach(l => {
                    l.overlayDate = null;
                    l.randomOnlineUsers = new Set();
                    l.loadingOnlineUsers = false;
                    l.unreadChats = [];
                })
                this.wss = list;
                if (this.temporaryWs && this.wss.some(s => s.id == this.temporaryWs.id))
                    this.temporaryWs = null;
            }
        }
    }
    async onLoadWorkspace(name: string, autoLoadPage = true) {
        try {
            if (typeof (name as any) == 'number') name = name.toString();
            if (typeof name == 'undefined') {
                if (this.workspace) {
                    await this.workspace.exitWorkspace()
                }
                return this.workspace = null;
            }
            // 
            var r = await channel.get('/ws/query', { name });
            if (r?.data.workspace) {
                var ws = new Workspace();
                ws.load({ ...r.data.workspace });
                if (Array.isArray(r.data.pids)) {
                    ws.pids = r.data.pids;
                }
                var willPageId = UrlRoute.isMatch(ShyUrl.root) ? ws.defaultPageId : undefined;
                if (UrlRoute.isMatch(ShyUrl.page)) willPageId = UrlRoute.match(ShyUrl.page)?.pageId;
                else if (UrlRoute.isMatch(ShyUrl.wsPage)) willPageId = UrlRoute.match(ShyUrl.wsPage)?.pageId;
                var g = await Workspace.getWsSock(ws.pids, 'ws').get('/ws/access/info', { wsId: ws.id, pageId: willPageId });
                if (g.data.accessForbidden) {
                    this.accessPage = 'forbidden';
                    return
                }
                if (g.data.workspace) {
                    ws.load({ ...g.data.workspace });
                }
                if (Array.isArray(g.data.onlineUsers)) g.data.onlineUsers.forEach(u => ws.onLineUsers.add(u))
                ws.roles = g.data.roles || [];
                ws.member = g.data.member || null;
                var willPageItem = g.data.page as PageItem;
                if (ws.access == 0
                    &&
                    !ws.member
                    &&
                    willPageItem
                ) {
                    this.accessPage = 'accessPage';
                    ws.load({ childs: [willPageItem] })
                }
                else {
                    this.accessPage = 'accessWorkspace';
                    await ws.onLoadPages();
                }
                if (surface.user.isSign) await ws.createTim();
                await sCache.set(CacheKey.wsHost, ws.sn);
                if (this.workspace) {
                    await this.workspace.exitWorkspace()
                }
                runInAction(() => {
                    if (!this.wss.some(s => s.id == ws.id)) this.temporaryWs = ws as any;
                    else this.temporaryWs = null;
                    this.workspace = ws;
                })
                if (autoLoadPage) {
                    await this.onLoadPage();
                }
            }
            else {
                if (this.workspace) {
                    await this.workspace.exitWorkspace()
                }
                this.workspace = null;
                if (window.shyConfig.isPc) {
                    UrlRoute.push(ShyUrl.signIn);
                }
                else if (window.shyConfig.isPro) {
                    if (location.host == UrlRoute.getHost()) UrlRoute.push(ShyUrl.root);
                    else location.href = UrlRoute.getUrl();
                }
                else if (window.shyConfig.isDev)
                    UrlRoute.push(ShyUrl.home);
            }
        }
        catch (ex) {
            console.error(ex)
        }
    }
    async onLoadPage() {
        if (UrlRoute.isMatch(ShyUrl.wsResource) || UrlRoute.isMatch(ShyUrl.resource)) {
            var ul = new URL(location.href);
            var url = ul.searchParams.get('url');
            channel.air('/page/open', { elementUrl: url })
        }
        else {
            var page = await surface.workspace.getDefaultPage();
            channel.air('/page/open', { item: page });
        }
    }
    async exitWorkspace() {
        await channel.del('/user/exit/ws', { wsId: surface.workspace.id });
        await channel.del('/ws/member/exit', { wsId: surface.workspace.id, sock: surface.workspace.sock });
        var list = surface.wss.map(w => w);
        list.remove(g => g.id == surface.workspace.id);
        surface.wss = list;
        var w = surface.wss.first();
        if (w) await this.onLoadWorkspace(w.id);
        else await this.onLoadWorkspace(undefined);
    }
    static async getWsName() {
        var domain: string, sn, wsId;
        sn = UrlRoute.match(ShyUrl.wsPage)?.wsId;
        if (!sn) {
            sn = UrlRoute.match(ShyUrl.ws)?.wsId;
        }
        if (!sn) {
            sn = UrlRoute.match(ShyUrl.wsResource)?.wsId;
        }
        if (!sn && location.host && /[\da-z\-]+\.shy\.live/.test(location.host)) {
            domain = location.host.replace(/\.shy\.live$/g, '');
        }
        if (!sn && !domain) {
            domain = location.host as string;
            if (domain == UrlRoute.getHost() || domain.startsWith('localhost:')) {
                domain = undefined;
            }
        }
        if (!domain && !sn) {
            wsId = await sCache.get(CacheKey.wsHost);
        }
        return sn || domain || wsId;
    }
    async onChangeWorkspace(workspace: Partial<Workspace>) {
        if (workspace.id != this.workspace?.id) {
            runInAction(() => {
                var od = surface.wss.find(c => c.id == this.workspace?.id);
                if (!od && surface.temporaryWs?.id == this.workspace?.id) od = surface.temporaryWs;
                if (od && od.randomOnlineUsers && od.randomOnlineUsers.has(surface.user.id))
                    od.randomOnlineUsers.delete(surface.user.id);
                if (od) od.memberOnlineCount = (od.memberOnlineCount || 0) - 1;
            })
            await PageViewStores.clearPageViewStore()
            await this.onLoadWorkspace(workspace.id);
            runInAction(() => {
                var od = surface.wss.find(c => c.id == workspace.id);
                if (!od && surface.temporaryWs?.id == workspace.id) od = surface.temporaryWs;
                if (od && od.randomOnlineUsers && !od.randomOnlineUsers.has(surface.user.id))
                    od.randomOnlineUsers.add(surface.user.id);
                if (od) od.memberOnlineCount = (od.memberOnlineCount || 0) + 1;
            })
        }
        else if (workspace.id == this.workspace?.id) {
            if (UrlRoute.isMatch(ShyUrl.me) || UrlRoute.isMatch(ShyUrl.discovery)) {
                await this.onLoadWorkspace(workspace.id);
            }
            if (UrlRoute.isMatch(ShyUrl.page) || UrlRoute.isMatch(ShyUrl.wsPage)) {

            }
            else {
                //  UrlRoute.pushToPage(workspace.sn, surface.supervisor.item.sn);
            }
        }
    }
    onCreateWorkspace() {
        UrlRoute.push(ShyUrl.workCreate);
    }
    /**
     * 
     */
    get showJoinTip() {
        if (this.user.isSign) {
            if (!this.showSlideBar) return false;
            return this.temporaryWs && this.temporaryWs?.accessProfile.disabledJoin !== true
        }
        else return false;
    }
    get showSlideBar() {
        if (!this.user.isSign) return false;
        if (this.workspace) {
            if (!this.workspace.member) {
                if (this.workspace.access == 0) {
                    return false;
                }
            }
        }
        return true;
    }
    get showSln() {
        if (this.workspace) {
            if (!this.workspace.member) {
                if (this.workspace.access == 0) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    get showWorkspace() {
        return surface.workspace ? true : false;
    }
    /**
     * 是否自定义workspace头部菜单
     */
    get isDefineWorkspaceMenu() {
        if ((config.isDomainWs) && surface.workspace.access == 1 && surface.workspace?.publishConfig?.abled && surface.workspace?.publishConfig?.defineContent && (surface.workspace?.publishConfig?.contentTheme == 'wiki' || surface.workspace?.publishConfig?.contentTheme == 'none')) return true;
        return false;
    }
    get isPubSiteDefineBarMenu() {
        return this.isPubSite && surface.workspace?.publishConfig?.navMenus?.length > 0 && surface.workspace?.publishConfig?.defineNavMenu
    }
    get isPubSiteHideMenu() {
        return this.isPubSite && surface.workspace?.publishConfig?.defineContent && (surface.workspace?.publishConfig?.contentTheme == 'wiki' || surface.workspace?.publishConfig?.contentTheme == 'none')
    }
    get isPubSite() {
        return (config.isDomainWs) && surface.workspace.access == 1 && surface.workspace?.publishConfig?.abled
    }
    async loadWx() {
        var url = window.location.href;
        var r = await masterSock.get('/wx/share', { url: url });
        console.log(JSON.stringify(r.data));
        //**配置微信信息**
        (window as any).wx.config(r.data);
        (window as any).wx.error(function (res) {
            console.log(JSON.stringify(res));
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
        (window as any).wx.ready(function () {
            var url = window.location.href;
            // 微信分享的数据
            var shareData = {
                "imgUrl": "https://static.shy.live/0.9.251-pro/assert/img/shy.svg",
                "link": url,
                "desc": document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
                "title": document.title,
                success: function () {
                    // 分享成功可以做相应的数据处理
                    //ShyAlert(JSON.stringify(arguments))
                    console.log(JSON.stringify(arguments))
                },
                fail(e) {
                    //ShyAlert('fal' + JSON.stringify(arguments))
                    console.log(JSON.stringify(arguments))
                },
                complete() {
                    // ShyAlert(lst('complete') + JSON.stringify(arguments))
                    console.log(JSON.stringify(arguments))
                },
                cancel() {
                    //ShyAlert(lst('cancel') + JSON.stringify(arguments))
                    console.log(JSON.stringify(arguments))
                }
            };
            //分享给朋友
            (window as any).wx.updateAppMessageShareData(shareData);
        });
    }
}
export var surface = new Surface();