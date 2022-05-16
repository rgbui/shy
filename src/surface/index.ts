
import { User } from "./user/user";
import { Sln } from "./sln";
import { Events } from "rich/util/events";
import { Supervisor } from "./supervisor";
import { ShyUrl, UrlRoute } from "../history";
import { Workspace } from "./workspace";
import { makeObservable, observable } from "mobx";
import { CacheKey, sCache } from "../../net/cache";
import { config } from "../common/config";
import { timService } from "../../net/primus";
import { channel } from "rich/net/channel";
import "./message.center";
import { bindCollaboration } from "../../services/tim";

export class Surface extends Events {
    constructor() {
        super();
        makeObservable(this, {
            isShowSln: observable,
            config: observable,
            supervisor: observable,
            user: observable,
            sln: observable,
            workspace: observable,
            temporaryWs: observable,
            wss: observable
        });
    }
    supervisor: Supervisor = new Supervisor();
    user: User = new User();
    sln: Sln = new Sln();
    workspace: Workspace = null;
    wss: Partial<Workspace>[] = [];
    temporaryWs: Partial<Workspace> = null;
    isShowSln: boolean = true;
    config: { showSideBar: boolean } = { showSideBar: true };
    async loadUser() {
        var r = await channel.get('/sign')
        if (r.ok) {
            config.updateServiceGuid(r.data.guid);
            Object.assign(this.user, r.data.user);
            await timService.open();
            bindCollaboration();
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
        var r = await channel.get('/ws/info', { name, wsId });
        if (r.ok) {
            var ws = new Workspace();
            ws.load({ ...r.data.workspace });
            /**
             * 不是成员，且空间为非公开，那么不允许访问
             */
            // if (!r.data.member && (typeof ws.access == 'undefined' || ws.access == 0)) {
            //     UrlRoute.push(ShyUrl._404);
            //     return;
            // }
            if (!this.wss.some(s => s.id == ws.id)) this.temporaryWs = ws;
            else this.temporaryWs = null;
            this.workspace = ws;
            this.workspace.onlineUsers = new Map();
            var g = await channel.get('/ws/access/info', { wsId: this.workspace.id });
            if (g.data.roles) await ws.loadRoles(g.data.roles)
            else ws.loadRoles([]);
            if (g.data.member) await ws.loadMember(g.data.member as any)
            else await ws.loadMember(null);
            await ws.loadPages();
            await sCache.set(CacheKey.wsHost, config.isPro ? ws.host : ws.sn);
            var page = await ws.getDefaultPage();
            if (page) {
                this.sln.onMousedownItem(page);
            }
            else await timService.enterWorkspaceView(surface.workspace.id, surface.workspace.member ? true : false, undefined);
        }
    }
    async exitWorkspace() {
        surface.wss.remove(g => g.id == surface.workspace.id);
        await channel.del('/user/exit/ws', { wsId: surface.workspace.id });
        await channel.del('/ws/member/exit', { wsId: surface.workspace.id, sock: surface.workspace.sock });
        var w = surface.wss.first();
        await this.loadWorkspace(w.id);
    }
    async getWsName() {
        var domain, sn, wsId;
        sn = UrlRoute.match(ShyUrl.pageDev)?.wsId;
        if (!sn) {
            sn = UrlRoute.match(ShyUrl.ws)?.wsId;
        }
        if (sn && location.host && /[\da-z\-]+\.shy\.(red|live)/.test(location.host)) {
            domain = location.host.replace(/\.shy\.(red|live)$/g, '');
        }
        if (!domain && !sn) {
            wsId = await sCache.get(CacheKey.wsHost);
        }
        return sn || domain || wsId;
    }
    async onChangeWorkspace(workspace: Partial<Workspace>) {
        if (workspace.id != this.workspace.id) {
            await this.loadWorkspace(workspace.id);
        }
    }
    onCreateWorkspace() {
        UrlRoute.push(ShyUrl.workCreate);
    }
    onToggleSln(isShowSln: boolean) {
        this.isShowSln = isShowSln;
    }
}
export var surface = new Surface();