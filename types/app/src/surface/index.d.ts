import { User } from "../user/user";
import { ViewSurface } from "./view";
import { Solution } from "../solution";
import { Events } from "rich/src/util/events";
import { Supervisor } from "../supervisor";
declare class Surface extends Events {
    constructor();
    view: ViewSurface;
    supervisor: Supervisor;
    user: User;
    solution: Solution;
    /**
     * 是否成功加载数据
     */
    isSuccessfullyLoaded: boolean;
    private init;
    load(): Promise<void>;
}
export declare var surface: Surface;
export {};
