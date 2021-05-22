
import { Workspace } from "../../solution/workspace";
import { workspaceDefaultData } from "./data";
const WORKSPACE_CACHE_KEY = 'sy.workspace';
export class WorkspaceStore {
    /***
     * 主要是通过不同的网址来计算读取相应的workspace空间
     */
    static async getWorkspace(url: string) {
        var workspaceId = 'workspacetest';
        var data: Record<string, any> = localStorage.getItem(WORKSPACE_CACHE_KEY + workspaceId) as any;
        if (!data) { data = workspaceDefaultData }
        else data = JSON.parse(data as any);
        var ws = new Workspace();
        ws.load(data);
        return ws;
    }
    /***
     * 保存workspace，该功能后面废弃掉
     */
    static async saveWorkspace(workspace: Workspace) {
        localStorage.setItem(WORKSPACE_CACHE_KEY + workspace.id, JSON.stringify(await workspace.get()));
    }
}