
import { User } from "./user/user";
import { Sln } from "./sln";
import { Events } from "rich/util/events";
import { Supervisor } from "./supervisor";
import { ShyUrl, UrlRoute } from "../history";
import { LinkWorkspaceOnline, Workspace } from "./workspace";
import { computed, makeObservable, observable, runInAction } from "mobx";
import { CacheKey, sCache } from "../../net/cache";
import { config } from "../../common/config";
import { channel } from "rich/net/channel";
import "./message.center";
import { PageItem } from "./sln/item";

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
            showHeadTip: computed,
            showSlideBar: computed,
            showSln: computed,
            showWorkspace: computed
        });
    }
    supervisor: Supervisor = new Supervisor();
    user: User = new User();
    sln: Sln = new Sln();
    workspace: Workspace = null;
    wss: LinkWorkspaceOnline[] = [];
    temporaryWs: LinkWorkspaceOnline = null;
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
            }
        }
    }
    async onLoadWorkspace(name: string) {
        try {
            if (typeof (name as any) == 'number') name = name.toString();
            if (typeof name == 'undefined') {
                if (!this.workspace) {
                    this.workspace.exitWorkspace()
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
                await ws.createTim();
                var willPageId = UrlRoute.match(config.isPro ? ShyUrl.page : ShyUrl.wsPage)?.pageId;
                var g = await ws.sock.get('/ws/access/info', { wsId: ws.id, pageId: willPageId });
                if (g.data.workspace) {
                    ws.load({ ...g.data.workspace });
                }
                var willPageItem = g.data.page as PageItem;
                /**
                 * 不是成员，且空间为非公开，页面也不是非公开，那么不能访问
                */
                if (!g.data.member) {
                    /**
                     *空间不是公开的，页面也不是公开的，那么就不能访问
                     */
                    if (ws.access == 0 || typeof ws.access == 'undefined') {
                        if (!(willPageItem && willPageItem.share == 'net')) {
                            UrlRoute.push(ShyUrl._404);
                            return;
                        }
                    }
                }
                if (Array.isArray(g.data.onlineUsers)) g.data.onlineUsers.forEach(u => ws.onLineUsers.add(u))
                if (g.data.roles) await ws.onLoadRoles(g.data.roles)
                else await ws.onLoadRoles()
                if (g.data.member) await ws.loadMember(g.data.member as any)
                else await ws.loadMember(null);
                await ws.onLoadPages();
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
                    this.workspace.exitWorkspace()
                }
                this.workspace = null;
                if (config.isPc) {
                    UrlRoute.push(ShyUrl.signIn);
                }
                else if (config.isPro) {
                    if (location.host == 'shy.live') UrlRoute.push(ShyUrl.root);
                    else location.href = 'https://shy.live';
                }
                else if (config.isDev)
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
            await this.onLoadWorkspace(workspace.id);
        }
        else if (workspace.id == this.workspace.id) {
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
    get showHeadTip() {
        if (this.user.isSign) return this.temporaryWs && this.temporaryWs?.accessJoinTip == true
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
        }
        return true;
    }
    get showWorkspace() {
        return surface.workspace ? true : false;
    }
}
export var surface = new Surface();