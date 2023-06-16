
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
            slnSpread: observable,
            showWorkspace: computed,
            accessPage: observable
        });
    }
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
    async onLoadWorkspace(name: string) {
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
                runInAction(() => {
                    if (!this.wss.some(s => s.id == ws.id)) this.temporaryWs = ws as any;
                    else this.temporaryWs = null;
                    this.workspace = ws;
                })
                var page = await ws.getDefaultPage();
                channel.air('/page/open', { item: page });
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
                    if (location.host == 'shy.live') UrlRoute.push(ShyUrl.root);
                    else location.href = 'https://shy.live';
                }
                else if (window.shyConfig.isDev)
                    UrlRoute.push(ShyUrl.signIn);
            }
        }
        catch (ex) {
            console.error(ex)
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
        if (!sn && location.host && /[\da-z\-]+\.shy\.live/.test(location.host)) {
            domain = location.host.replace(/\.shy\.live$/g, '');
        }
        if (!sn && !domain) {
            domain = location.host as string;
            if (domain == 'shy.live' || domain.startsWith('localhost:')) {
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
                if (od && od.randomOnlineUsers.has(surface.user.id))
                    od.randomOnlineUsers.delete(surface.user.id);
                if (od) od.memberOnlineCount = (od.memberOnlineCount || 0) - 1;
            })
            await PageViewStores.clearPageViewStore()
            await this.onLoadWorkspace(workspace.id);
            runInAction(() => {
                var od = surface.wss.find(c => c.id == workspace.id);
                if (!od && surface.temporaryWs?.id == workspace.id) od = surface.temporaryWs;
                if (od && !od.randomOnlineUsers.has(surface.user.id))
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
}
export var surface = new Surface();