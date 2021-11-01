
import { User } from "./user/user";
import { Sln } from "./sln";
import { Events } from "rich/util/events";
import { Supervisor } from "./supervisor";
import { currentParams, SyHistory } from "../history";
import { Workspace } from "./workspace";
import { workspaceService } from "../../../services/workspace";
import { sockSync } from "../../../net/primus";
import { makeObservable, observable, toJS } from "mobx";
import { CacheKey, sCache } from "../../../net/cache";
import { MessageCenter } from "./message.center";
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
        if (!this.user.isSign) return SyHistory.push('/sign');
        await sockSync.load();
        var rr = await this.getWillLoadWorkSpace();
        if (rr.ok) {
            if (rr.data.notCreateWorkSpace == true) return SyHistory.push('/work/create')
            var ws = new Workspace();
            ws.load({ ...rr.data.workspace, users: rr.data.users });
            await ws.loadPages();
            this.workspace = ws;
            var page = await ws.getDefaultPage();
            this.sln.onMousedownItem(page);
        }
        else return SyHistory.push('/404');
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
        pageId = currentParams('/page/:id')?.id;
        if (!domain && !pageId)
            sn = currentParams('/ws/:id')?.id;
        if (!domain && !pageId && !sn) {
            wsId = await sCache.get(CacheKey.workspaceId);
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
                var page = await ws.getDefaultPage();
                this.workspace = ws;
                this.sln.onMousedownItem(page);
            }
            else return SyHistory.push('/404');
        }
    }
    onCreateWorkspace() {
        SyHistory.push('/work/create');
    }
    onToggleSln(isShowSln: boolean) {
        this.isShowSln = isShowSln;
    }
}
export var surface = new Surface();