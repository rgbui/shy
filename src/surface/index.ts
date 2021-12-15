
import { User } from "./user/user";
import { Sln } from "./sln";
import { Events } from "rich/util/events";
import { Supervisor } from "./supervisor";
import { ShyUrl, UrlRoute } from "../history";
import { Workspace } from "./workspace";
import { userTim } from "../../net/primus";
import { makeObservable, observable, toJS } from "mobx";
import { CacheKey, sCache } from "../../net/cache";
import { MessageCenter } from "./message.center";
import { workspaceService } from "../../services/workspace";
import { config } from "../common/config";
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
    async load() {
        if (!this.user.isSign) await this.user.loadUser();
        if (!this.user.isSign) return;
        await userTim.load();
        var rr = await this.getWillLoadWorkSpace();
        if (rr.ok) {
            if (rr.data.notCreateWorkSpace == true) return UrlRoute.push(ShyUrl.workCreate)
            var ws = new Workspace();
            ws.load({ ...rr.data.workspace, users: rr.data.users });
            await ws.loadPages();
            this.workspace = ws;
            await sCache.set(CacheKey.wsId, ws.id);
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
        var domain, pageId, sn, wsId;
        if (location.host && /[\da-z]+\.shy\.(red|live)/.test(location.host)) {
            domain = location.host;
        }
        if (config.isPro) {
            pageId = UrlRoute.match(ShyUrl.page)?.pageId;
        }
        else {
            pageId = UrlRoute.match(ShyUrl.pageDev)?.pageId;
            wsId = UrlRoute.match(ShyUrl.pageDev)?.wsId;
        }
        if (!domain && !pageId && !sn) {
            wsId = await sCache.get(CacheKey.wsId);
        }
        return await workspaceService.loadWorkSpace(domain, pageId, sn, wsId);
    }
    async onChangeWorkspace(workspace: Partial<Workspace>) {
        if (workspace.id != this.workspace.id) {
            var rr = await workspaceService.loadWorkSpace(undefined, undefined, undefined, workspace.id);
            if (rr.ok) {
                var ws = new Workspace();
                ws.load({ ...rr.data.workspace, users: rr.data.users });
                await ws.loadPages();
                this.workspace = ws;
                await sCache.set(CacheKey.wsId, ws.id);
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