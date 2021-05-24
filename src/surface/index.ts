
import { User } from "../user/user";
import { ViewSurface } from "./view";
import { Solution } from "../solution";
import { Events } from "rich/src/util/events";
import { SolutionOperator } from "../solution/operator";
import { Supervisor } from "../supervisor";
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
    }
    async load() {
        await this.user.loadUser();
        await this.solution.loadWorkspace();
        this.isSuccessfullyLoaded = true;
        this.emit('loaded');
    }
}
export var surface = new Surface();