
import { User } from "./user/user";
import { Sln } from "./sln";
import { Events } from "rich/util/events";
import { Supervisor } from "./supervisor";
import { currentParams, SyHistory } from "../history";
import { Workspace } from "./workspace";
import { workspaceService, workspaceTogglePages } from "../../../services/workspace";
import { util } from "../../util";
import { sockSync } from "../../../net/primus";
import { makeObservable, observable } from "mobx";
import { CacheKey, sCache } from "../../../net/cache";
import { MessageCenter } from "./message.center";
@observable
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
            this.workspace = new Workspace()
            this.workspace.load({ ...rr.data.workspace, users: rr.data.users });
            await this.loadPages();
            var page = await this.workspace.getDefaultPage();
            this.sln.onFocusItem(page);
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
        if (!domain && !pageId) {
            sn = currentParams('/ws/:id')?.id;
        }
        if (!domain && !pageId && !sn) {
            wsId = await sCache.get(CacheKey.workspaceId);
        }
        return await workspaceService.loadWorkSpace(domain, pageId, sn, wsId);
    }
    async loadPages() {
        var ids = await workspaceTogglePages.getIds(this.workspace.id);
        var rr = await workspaceService.loadWorkspaceItems(this.workspace.id, ids);
        if (rr) {
            if (Array.isArray(rr?.data?.pages)) {
                var pages = rr.data.pages;
                pages = util.flatArrayConvertTree(pages);
                this.workspace.load({ childs: pages });
            }
        }
    }
    async onChangeWorkspace(workspace: Partial<Workspace>) {
        // SyHistory.push(generatePath('/ws/:id', { id: workspace.sn }));
        // await this.loadWorkspace();
        // await this.loadPages();
        // this.view.forceUpdate();
    }
    onCreateWorkspace() {
        SyHistory.push('/work/create');
    }
    onToggleSln(isShowSln: boolean) {
        this.isShowSln = isShowSln;
    }
}
export var surface = new Surface();