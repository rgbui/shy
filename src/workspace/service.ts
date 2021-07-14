
import { BaseService } from "../service";
import { Workspace } from ".";
import { masterSock } from "../service/sock";
import { CacheKey, sCache } from "../service/cache";
import { currentParams } from "../history";
import { PageItem } from "../solution/item";
class WorkspaceService extends BaseService {
    /***
     * 主要是通过不同的网址来计算读取相应的workspace空间
     */
    async loadWorkSpace() {
        var local = sCache.get(CacheKey.workspaceId);
        var domain = location.host == 'shy.live' ? undefined : location.host;
        var wsId = currentParams('/ws/:id')?.id;
        if (wsId) local = undefined;
        return await masterSock.get<{ toId?: string, toSn?: number, workspace: Workspace, areas: any[] }, string>('/workspace/load', {
            local: local,
            domain,
            sn: wsId
        })
    }
    async createWorkspace(args: { text: string }) {
        var rr = await masterSock.post<{ id: string, sn: number }, string>('/workspace/create', { text: args.text });
        return rr;
    }
    async loadWorkspacePages(workspaceId: string) {
        var rr = await masterSock.get<{ pages: PageItem[] }, string>('/pages/load', { workspaceId });
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