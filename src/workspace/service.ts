
import { BaseService } from "../service";
import { Workspace } from ".";
import { masterSock, userSock } from "../service/sock";
import { CacheKey, sCache, yCache } from "../service/cache";
import { currentParams } from "../history";
import { PageItem } from "../solution/item";
import { TableSchema } from "rich/blocks/data-present/schema/meta";
import { FieldType } from "rich/blocks/data-present/schema/field.type";
import { FileType } from "../../type";
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
        await masterSock.delete('/page/delete/:id', { id });
    }
    async loadPageContent(id: string) {
        var r = yCache.get(id);
        if (r) return r;
    }
    async savePageContent(id: string, content: Record<string, any>) {
        yCache.set(id, content);
    }
    async createDefaultTableSchema(data: { text?: string, templateId?: string }) {
        var result = await userSock.put<{ schema: Partial<TableSchema> }, string>('/create/default/table/schema', data || {});
        return result.data?.schema;
    }
    async loadTableSchema(schemaId: string) {
        var result = await userSock.get<{ schema: Partial<TableSchema> }, string>('/load/table/schema/:id', { id: schemaId });
        return result.data?.schema;
    }
    async loadTableSchemaData(schemaId: string, options: { page?: number, size?: number, filter?: Record<string, any> }) {
        var result = await userSock.get<{ list: any[], total: number }, string>('/table/:schemaId/query', {
            schemaId: schemaId,
            page: options.page,
            size: options.size,
            filter: options.filter
        });
        return result.data;
    }
    async createTableSchemaField(schemaId: string, options: { type: FieldType, text: string }) {
        var result = await userSock.get<{ field: FileType }, string>('/create/schema/:id/field', {
            id: schemaId,
            type: options.type,
            text: options.text
        });
        return result.data;
    }
}
export var workspaceService = new WorkspaceService();