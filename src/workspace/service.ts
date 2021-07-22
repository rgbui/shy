
import { BaseService } from "../service";
import { Workspace } from ".";
import { masterSock, userSock } from "../service/sock";
import { CacheKey, sCache, yCache } from "../service/cache";
import { currentParams } from "../history";
import { PageItem } from "../solution/item";
import { TableMeta } from "rich/blocks/data-present/schema/meta";
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
    async loadPageChilds(pageId: string) {
        var rr = await masterSock.get<{ list: PageItem[] }, string>('/page/subs', { parentId: pageId });
        return rr;
    }
    async updatePage(item: PageItem) {
        if (typeof item.sn === 'undefined') {
            var re = await masterSock.post<{ item: PageItem }, string>('/page/create', {
                data: {
                    id: item.id,
                    text: item.text,
                    parentId: item.parentId ? item.parentId : item.parent?.id,
                    workareaIds: item.workareaIds?.length > 0 ? item.workareaIds : undefined,
                    workspaceId: item.workspace?.id,
                    mime: item.mime
                }
            });
            if (re.ok) {
                item.sn = re.data.item.sn;
                item.creater = re.data.item.creater;
                item.createDate = re.data.item.createDate;
            }
        }
        else {
            var rr = await masterSock.post('/page/update/' + item.id, { data: { text: item.text } });
            if (rr.ok) {
            }
        }
    }
    async deletePage(id: string) {
        await masterSock.delete('/page/delete/' + id);
    }
    async loadPageContent(id: string) {
        var r = yCache.get(id);
        if (r) return r;
    }
    async savePageContent(id: string, content: Record<string, any>) {
        yCache.set(id, content);
    }
    async createDefaultPresentData(text: string, templateId?: string) {
        var result = await userSock.put<TableMeta, string>('/create/present/schema', { text, templateId });
        return result.data;
    }
    async searchDataPresentMeta(metaId: string) {
        var result = await userSock.get<{ schema: Record<string, any>, fields: Record<string, any>[] }, string>('/search/schema/:id', { id: metaId });
        return result.data;
    }
    async loadDataPresentData(metaId: string, options: { page: number, size: number, filter?: Record<string, any> }) {
        var result = await userSock.get<{ list: any[], total: number }, string>('/present/schema/query', {
            schemaId: metaId,
            page: options.page,
            size: options.size,
            filter: options.filter
        });
        return result.data;
    }
}
export var workspaceService = new WorkspaceService();