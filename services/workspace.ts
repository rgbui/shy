
import { BaseService } from "../net";
import { Workspace } from "../src/view/surface/workspace";
import { masterSock, userSock } from "../net/sock";
import { CacheKey, yCache } from "../net/cache";
import { PageItem } from "../src/view/surface/sln/item";
import { TableSchema } from "rich/blocks/data-present/schema/meta";
import { FieldType } from "rich/blocks/data-present/schema/field.type";
import { FileType } from "../type";
import { surface } from "../src/view/surface";
class WorkspaceService extends BaseService {

    /**
     * 
     * @param domain 域名
     * @param pageId 网页
     * @param sn workspace序号
     * @param wsId workspace编号
     * @returns 
     */
    async loadWorkSpace(domain: string, pageId: string, sn: number, wsId: string) {
        return await masterSock.get<{ workspace: Workspace, notCreateWorkSpace?: boolean, users: any[] }, string>('/workspace/load', {
            wsId,
            sn,
            domain,
            pageId,
        })
    }
    async getWorkspaces() {
        var data = await masterSock.get<{ list: Partial<Workspace>[] }>('/workspace/list');
        return data;
    }
    async createWorkspace(args: { text: string }) {
        var rr = await masterSock.post<{ id: string, sn: number }, string>('/workspace/create', { text: args.text });
        return rr;
    }
    async updateWorkspace(wsId: string, data: Partial<Workspace>) {
        var rr = await masterSock.post('/ws/:wsId/update', { wsId, data });
        return rr;
    }
    async loadWorkspaceItems(workspaceId: string, pageIds: string[]) {
        var rr = await masterSock.post<
            { pages: Partial<PageItem> },
            string>('/workspace/:wsId/items', { wsId: workspaceId, pageIds: pageIds || [] }
            )
        return rr;
    }
    async loadPageChilds(pageId: string) {
        var rr = await masterSock.get<{ list: Partial<PageItem>[] }, string>('/page/subs', { parentId: pageId });
        return rr;
    }
    async savePage(item: PageItem) {
        if (typeof item.sn === 'undefined') {
            var re = await masterSock.post<{ item: PageItem }, string>('/page/create', {
                data: {
                    id: item.id,
                    text: item.text,
                    parentId: item.parentId ? item.parentId : item.parent?.id,
                    workspaceId: item.workspace?.id,
                    mime: item.mime,
                    icon: item.icon
                }
            });
            if (re.ok) {
                item.id = re.data.item.id;
                item.sn = re.data.item.sn;
                item.creater = re.data.item.creater;
                item.createDate = re.data.item.createDate;
            }
        }
        else {
            var rr = await masterSock.post('/page/update/' + item.id, {
                data: {
                    text: item.text,
                    icon: item.icon
                }
            });
            if (rr.ok) {
            }
        }
    }
    async getPage(id: string) {
        var page = await masterSock.get<{ page: Partial<PageItem> }, string>('/page/query/:id', { id });
        return page;
    }
    async updatePage(id: string, data: Record<string, any>) {
        var rr = await masterSock.post('/page/update/:id', {
            id,
            data: data
        });
        return rr
    }
    async togglePage(item: PageItem) {
        await workspaceTogglePages.save(surface.workspace.id, item.workspace.getVisibleIds())
    }
    async toggleFavourcePage(item: PageItem) {

    }
    async deletePage(id: string) {
        await masterSock.delete('/page/delete/:id', { id });
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
    async createInvite(wsId: string) {
        return await masterSock.post<{ url: string }, string>('/ws/:wsId/create/invite', { wsId })
    }
}
export var workspaceService = new WorkspaceService();
export class workspaceTogglePages {
    private static ids: string[];
    static async getIds(wsId: string) {
        if (Array.isArray(this.ids)) return this.ids;
        var ids = await yCache.get(CacheKey.workspace_toggle_pages + "." + wsId);
        if (Array.isArray(ids)) {
            this.ids = ids;
        }
        else this.ids = [];
        return this.ids;
    }
    static async save(wsId: string, ids: string[]) {
        this.ids = ids;
        await yCache.set(CacheKey.workspace_toggle_pages + "." + wsId, this.ids)
    }
}