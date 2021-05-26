import { Workspace } from "../../solution/workspace";
export declare class WorkspaceStore {
    /***
     * 主要是通过不同的网址来计算读取相应的workspace空间
     */
    static getWorkspace(url: string): Promise<Workspace>;
    /***
     * 保存workspace，该功能后面废弃掉
     */
    static saveWorkspace(workspace: Workspace): Promise<void>;
}
