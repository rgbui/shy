
import { User } from "./user/user";
import { Sln } from "./sln";
import { Events } from "rich/util/events";
import { Supervisor } from "./supervisor";
import { ShyUrl, UrlRoute } from "../history";
import { Workspace } from "./workspace";
import { makeObservable, observable } from "mobx";
import { CacheKey, sCache } from "../../net/cache";
import { MessageCenter } from "./message.center";
import { workspaceService } from "../../services/workspace";
import { config } from "../common/config";
import { timService } from "../../net/primus";
import { channel } from "rich/net/channel";

export class Surface extends Events {
    constructor() {
        super();
        makeObservable(this, {
            isShowSln: observable,
            config: observable,
            supervisor: observable,
            user: observable,
            sln: observable,
            workspace: observable
        });
        MessageCenter(this);
    }
    supervisor: Supervisor = new Supervisor();
    user: User = new User();
    sln: Sln = new Sln();
    workspace: Workspace = null;
    isShowSln: boolean = true;
    config: { showSideBar: boolean } = { showSideBar: true };
    async loadUser() {
        var r = await channel.get('/sign')
        if (r.ok) {
            config.updateServiceGuid(r.data.guid);
            Object.assign(this.user, r.data.user);
        }
    }
    async load() {
        var rr = await this.getWillLoadWorkSpace();
        if (rr.ok) {
            var ws = new Workspace();
            ws.load({ ...rr.data.workspace, users: rr.data.users });
            await ws.loadPages();
            this.workspace = ws;
            await timService.enter(this.workspace);
            await sCache.set(CacheKey.wsHost, config.isPro ? ws.host : ws.sn);
            var page = await ws.getDefaultPage();
            this.sln.onMousedownItem(page);
        }
        else return UrlRoute.push(ShyUrl._404);
        return true;
    }
    updateUser(user: Partial<User>) {
        Object.assign(this.user, user);
    }
    async getWillLoadWorkSpace() {
        var domain, sn, wsId;
        if (location.host && /[\da-z\-]+\.shy\.(red|live)/.test(location.host)) {
            domain = location.host.replace(/\.shy\.(red|live)$/g, '');
        }
        if (!config.isPro) {
            sn = UrlRoute.match(ShyUrl.pageDev)?.wsId;
            if (!sn) {
                sn = UrlRoute.match(ShyUrl.ws)?.wsId;
            }
        }
        if (!domain && !sn) {
            wsId = await sCache.get(CacheKey.wsHost);
        }
        return await workspaceService.loadWorkSpace(domain, sn, wsId);
    }
    async onChangeWorkspace(workspace: Partial<Workspace>) {
        if (workspace.id != this.workspace.id) {
            var rr = await workspaceService.loadWorkSpace(undefined, undefined, workspace.id);
            if (rr.ok) {
                var ws = new Workspace();
                ws.load({ ...rr.data.workspace, users: rr.data.users });
                await ws.loadPages();
                this.workspace = ws;
                await timService.enter(this.workspace);
                await sCache.set(CacheKey.wsHost, ws.host);
                var page = await ws.getDefaultPage();
                this.sln.onMousedownItem(page);
            }
            else return UrlRoute.push(ShyUrl._404);
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