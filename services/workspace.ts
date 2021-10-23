
import { BaseService } from "../net";
import { Workspace } from "../src/view/workspace";
import { masterSock, userSock } from "../net/sock";
import { CacheKey, sCache, yCache } from "../net/cache";
import { currentParams } from "../src/view/history";
import { PageItem } from "../src/view/sln/item";
import { TableSchema } from "rich/blocks/data-present/schema/meta";
import { FieldType } from "rich/blocks/data-present/schema/field.type";
import { FileType } from "../type";
class WorkspaceService extends BaseService {
    /***
     * 主要是通过不同的网址来计算读取相应的workspace空间
     */
    async loadWorkSpace() {
        var pageId = currentParams('/page/:id')?.id;
        var local = await sCache.get(CacheKey.workspaceId);
        var domain = location.host == 'shy.live' ? undefined : location.host;
        var wsId = currentParams('/ws/:id')?.id;
        if (wsId) local = undefined;
        if (pageId && !wsId) {
            var page = await masterSock.get<Partial<PageItem>, string>('/page/query/:id', { id: pageId });
            if (page) {
                wsId = page.data.workspaceId;
            }
        }
        return await masterSock.get<{ toId?: string, toSn?: number, workspace: Workspace, users: any[] }, string>('/workspace/load', {
            local: local,
            domain,
            sn: wsId
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
            string>('/workspace/:wsId/items',
                { wsId: workspaceId, pageIds: pageIds || [] }
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
        var page = await masterSock.get<{page:Partial<PageItem>}, string>('/page/query/:id', { id });
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
        await workspaceTogglePages.save(item.workspace.getVisibleIds())
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
    static async getIds() {
        if (Array.isArray(this.ids)) return this.ids;
        var ids = await yCache.get(CacheKey.togglePages);
        if (Array.isArray(ids)) {
            this.ids = ids;
        }
        else this.ids = [];
        return this.ids;
    }
    static async save(ids: string[]) {
        this.ids = ids;
        await yCache.set(CacheKey.togglePages, this.ids)
    }
}