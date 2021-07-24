
import { User } from "../user/user";
import { ViewSurface } from "./view";
import { Solution } from "../solution";
import { Events } from "rich/util/events";
import { SolutionDirective } from "../solution/operator";
import { Supervisor } from "../supervisor";
import { SyHistory } from "../history";
import { generatePath } from "react-router";
import { Workspace } from "../workspace";
import { workspaceService } from "../workspace/service";
class Surface extends Events {
    constructor() {
        super();
        this.init();
    }
    view: ViewSurface;
    supervisor: Supervisor = new Supervisor();
    user: User = new User();
    solution: Solution = new Solution();
    workspace: Workspace;
    /**
     * 是否成功加载数据
     */
    isSuccessfullyLoaded: boolean = false;
    private init() {
        this.solution.on(SolutionDirective.openItem, (item) => {
            this.supervisor.onOpenItem(item);
        });
        this.solution.on(SolutionDirective.togglePageItem, (item) => {
            // WorkspaceStore.saveWorkspace(this.solution.workspace);
        });
        this.solution.on(SolutionDirective.updatePageItem, (item) => {
            // WorkspaceStore.saveWorkspace(this.solution.workspace);
        });
        this.solution.on(SolutionDirective.removePageItem, (item) => {
            // WorkspaceStore.saveWorkspace(this.solution.workspace);
        });
        this.solution.on(SolutionDirective.addSubPageItem, (item) => {
            // WorkspaceStore.saveWorkspace(this.solution.workspace);
        });
        this.solution.on(SolutionDirective.toggleModule, (item) => {
            // WorkspaceStore.saveWorkspace(this.solution.workspace);
        });
    }
    async load() {
        if (!this.user.isSign) await this.user.loadUser();
        if (!this.user.isSign) return SyHistory.push('/login');
        var loadResult = await this.loadWorkspace();
        if (loadResult.ok != true) {
            if (loadResult?.data?.toSn) return SyHistory.push(generatePath('/ws/:id', { id: loadResult?.data?.toSn }))
            else return SyHistory.push('/work/create')
        }
        else {
            await this.loadPages();
        }
        this.isSuccessfullyLoaded = true;
    }
    updateUser(user: Partial<User>) {
        Object.assign(this.user, user);
    }
    async loadWorkspace() {
        var rr = await workspaceService.loadWorkSpace();
        if (rr.ok) {
            this.workspace = new Workspace()
            this.workspace.load({ ...rr.data.workspace, areas: rr.data.areas });
        }
        return rr;
    }
    async loadPages() {
        var rr = await workspaceService.loadWorkspacePages(this.workspace.id);
        if (rr) {
            if (Array.isArray(rr?.data?.pages))
            {
                this.workspace.areas.each(area => {
                    var rs = rr.data.pages.findAll(g => Array.isArray(g.workareaIds) && g.workareaIds.exists(z => z == area.id));
                    if (rs.length > 0) {
                        area.load({ items: rs });
                    }
                })
            }
        }
    }
}
export var surface = new Surface();