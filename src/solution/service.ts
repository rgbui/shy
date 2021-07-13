
import { BaseService } from "../service";
import { Workspace } from "./workspace";
import { masterSock } from "../service/sock";
import { CacheKey, sCache } from "../service/cache";
import { SyHistory } from "../history";
class WorkspaceService extends BaseService {
    /***
     * 主要是通过不同的网址来计算读取相应的workspace空间
     */
    async loadWorkSpace() {
        var local = sCache.get(CacheKey.workspaceId);
        var domain = location.host == 'shy.live' ? undefined : location.host;
        var router = SyHistory.location.state ? (SyHistory.location.state as any).id : "";
        return await masterSock.get<{ workspace: Workspace, areas: any[] }, string>('/workspace/load', { local, domain, workspaceId: router })
    }
    async createWorkspace(args: { text: string }) {
        var rr = await masterSock.post<{ id: string }, string>('/workspace/create', { text: args.text });
        return rr;
    }
    async loadWorkspacePages(workspaceId: string) {
        var rr = await masterSock.get<{ id: string }, string>('/pages/load', { workspaceId });
        return rr;
    }
    /***
     * 保存workspace，该功能后面废弃掉
     */
    async saveWorkspace(workspace: Workspace) {
        // var data = await workspace.get();
        // localStorage.setItem(WORKSPACE_CACHE_KEY + workspace.id, JSON.stringify(data));
    }
}
export var workspaceService = new WorkspaceService();