
import { User } from "./user/user";
import { Sln } from "./sln";
import { Events } from "rich/util/events";
import { Supervisor } from "./supervisor";
import { ShyUrl, UrlRoute } from "../history";
import { Workspace } from "./workspace";
import { computed, makeObservable, observable, runInAction } from "mobx";
import { CacheKey, sCache } from "../../net/cache";
import { config } from "../common/config";
import { timService } from "../../net/primus";
import { channel } from "rich/net/channel";
import "./message.center";
import { ClientNotifys } from "../../services/tim";
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
    wss: Partial<Workspace>[] = [];
    temporaryWs: Partial<Workspace> = null;
    async loadUser() {
        var r = await channel.get('/sign')
        if (r.ok) {
            config.updateServiceGuid(r.data.guid);
            Object.assign(this.user, r.data.user);
            await timService.open();
            ClientNotifys();
        }
        else if (config.isPc) {
            UrlRoute.push(ShyUrl.signIn);
        }
    }
    async loadWorkspaceList() {
        if (this.user.isSign) {
            var r = await channel.get('/user/wss');
            if (r?.ok) {
                this.wss = r.data.list;
            }
        }
    }
    async loadWorkspace(wsId: string, name?: string | number) {
        if (typeof wsId == 'undefined' && typeof name == 'undefined') {
            return this.workspace = null;
        }
        var willPageId = UrlRoute.match(config.isPro ? ShyUrl.page : ShyUrl.wsPage)?.pageId;
        var r = await channel.get('/ws/info', { name, wsId });
        if (r.data?.workspace) {
            var ws = new Workspace();
            ws.load({ ...r.data.workspace });
            var g = await channel.get('/ws/access/info', { wsId: ws.id, sock: ws.sock, pageId: willPageId });
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
            if (g.data.roles) await ws.loadRoles(g.data.roles)
            else ws.loadRoles([]);
            if (g.data.member) await ws.loadMember(g.data.member as any)
            else await ws.loadMember(null);
            await ws.loadPages();
            await sCache.set(CacheKey.wsHost, config.isPro ? ws.host : ws.sn);
            runInAction(() => {
                if (!this.wss.some(s => s.id == ws.id)) this.temporaryWs = ws;
                else this.temporaryWs = null;
                this.workspace = ws;
            })
            var page = await ws.getDefaultPage();
            channel.air('/page/open', { item: page });
        }
        else {
            this.workspace = null;
            UrlRoute.push(ShyUrl._404);
        }
    }
    async exitWorkspace() {
        await channel.del('/user/exit/ws', { wsId: surface.workspace.id });
        await channel.del('/ws/member/exit', { wsId: surface.workspace.id, sock: surface.workspace.sock });
        var list = surface.wss.map(w => w);
        list.remove(g => g.id == surface.workspace.id);
        surface.wss = list;
        var w = surface.wss.first();
        if (w) await this.loadWorkspace(w.id);
        else await this.loadWorkspace(undefined);
    }
    async getWsName() {
        var domain, sn, wsId;
        sn = UrlRoute.match(ShyUrl.wsPage)?.wsId;
        if (!sn) {
            sn = UrlRoute.match(ShyUrl.ws)?.wsId;
        }
        if (!sn && location.host && /[\da-z\-]+\.shy\.live/.test(location.host)) {
            domain = location.host.replace(/\.shy\.live$/g, '');
        }
        if (!domain && !sn) {
            wsId = await sCache.get(CacheKey.wsHost);
        }
        return sn || domain || wsId;
    }
    async onChangeWorkspace(workspace: Partial<Workspace>) {
        if (workspace.id != this.workspace?.id) {
            await this.loadWorkspace(workspace.id);
        }
        else if (workspace.id == this.workspace.id) {
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