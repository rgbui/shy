
import { User } from "../user/user";
import { ViewSurface } from "./view";
import { Solution } from "../solution";
import { Events } from "rich/src/util/events";
class Surface extends Events {
    view: ViewSurface;
    user: User = new User();
    solution: Solution = new Solution();
    /**
     * 是否成功加载数据
     */
    isSuccessfullyLoaded: boolean = false;
    async load() {
        await this.user.loadUser();
        await this.solution.loadWorkspace();
        this.isSuccessfullyLoaded = true;
        this.emit('loaded');
    }
}
export var surface = new Surface();