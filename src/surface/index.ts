
import { User } from "../user/user";
import { ViewSurface } from "./view";
import { Solution } from "../solution";
import { Events } from "rich/src/util/events";
import { SolutionOperator } from "../solution/operator";
import { Supervisor } from "../supervisor";
import { SyHistory } from "../history";
class Surface extends Events {
    constructor() {
        super();
        this.init();
    }
    view: ViewSurface;
    supervisor: Supervisor = new Supervisor();
    user: User = new User();
    solution: Solution = new Solution();
    /**
     * 是否成功加载数据
     */
    isSuccessfullyLoaded: boolean = false;
    private init() {
        this.solution.on(SolutionOperator.openItem, (item) => {
            this.supervisor.onOpenItem(item);
        });
        this.solution.on(SolutionOperator.togglePageItem, (item) => {
            // WorkspaceStore.saveWorkspace(this.solution.workspace);
        });
        this.solution.on(SolutionOperator.changePageItemName, (item) => {
            // WorkspaceStore.saveWorkspace(this.solution.workspace);
        });
        this.solution.on(SolutionOperator.removePageItem, (item) => {
            // WorkspaceStore.saveWorkspace(this.solution.workspace);
        });
        this.solution.on(SolutionOperator.addSubPageItem, (item) => {
            // WorkspaceStore.saveWorkspace(this.solution.workspace);
        });
        this.solution.on(SolutionOperator.toggleModule, (item) => {
            // WorkspaceStore.saveWorkspace(this.solution.workspace);
        });
    }
    async load() {
        if (!this.user.isSign)
            await this.user.loadUser();
        if (!this.user.isSign)
            return SyHistory.push('/login');
        await this.solution.loadWorkspace();
        this.isSuccessfullyLoaded = true;
    }
}
export var surface = new Surface();