
import { BaseService } from "../net";
import { Workspace } from "../src/view/surface/workspace";
import { fileSock, masterSock, Sock } from "../net/sock";
import { PageItem } from "../src/view/surface/sln/item";
import { TableSchema } from "rich/blocks/data-present/schema/meta";
import { FieldType } from "rich/blocks/data-present/schema/field.type";
import { FileType } from "../type";
import { FileMd5 } from "../src/util/file";
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
        return await masterSock.get<{ workspace: Workspace, notCreateWorkSpace?: boolean, users: any[] }, string>('/ws/query', {
            wsId,
            sn,
            domain,
            pageId,
        })
    }
    async getWorkspaces() {
        var data = await masterSock.get<{ list: Partial<Workspace>[] }>('/ws/list');
        return data;
    }
    async createWorkspace(args: { text: string }) {
        var rr = await masterSock.post<{ id: string, sn: number }, string>('/ws/create', { text: args.text });
        return rr;
    }
    async updateWorkspace(wsId: string, data: Partial<Workspace>) {
        var rr = await masterSock.post('/ws/:wsId/update', { wsId, data });
        return rr;
    }
    async loadWorkspaceItems(workspaceId: string, pageIds: string[]) {
        var rr = await masterSock.post<
            { pages: Partial<PageItem> },
            string>('/ws/:wsId/items', { wsId: workspaceId, pageIds: pageIds || [] }
            )
        return rr;
    }
    async loadPageChilds(pageId: string) {
        var rr = await masterSock.get<{ list: Partial<PageItem>[] }, string>('/page/:parentId/subs', { parentId: pageId });
        return rr;
    }
    async getPage(id: string) {
        var page = await masterSock.get<{ page: Partial<PageItem> }, string>('/page/:id/query', { id });
        return page;
    }
    async toggleFavourcePage(item: PageItem) {

    }
    async createDefaultTableSchema(sock: Sock, data: { text?: string, templateId?: string }) {
        var result = await sock.put<{ schema: Partial<TableSchema> }, string>('/create/default/table/schema', data || {});
        return result.data?.schema;
    }
    async loadTableSchema(sock: Sock, schemaId: string) {
        var result = await sock.get<{ schema: Partial<TableSchema> }, string>('/load/table/schema/:id', { id: schemaId });
        return result.data?.schema;
    }
    async loadTableSchemaData(sock: Sock, schemaId: string, options: { page?: number, size?: number, filter?: Record<string, any> }) {
        var result = await sock.get<{ list: any[], total: number }, string>('/table/:schemaId/query', {
            schemaId: schemaId,
            page: options.page,
            size: options.size,
            filter: options.filter
        });
        return result.data;
    }
    async createTableSchemaField(sock: Sock, schemaId: string, options: { type: FieldType, text: string }) {
        var result = await sock.get<{ field: FileType }, string>('/create/schema/:id/field', {
            id: schemaId,
            type: options.type,
            text: options.text
        });
        return result.data;
    }
    async createInvite(wsId: string) {
        return await masterSock.post<{ url: string }, string>('/ws/:wsId/create/invite', { wsId })
    }
    /**
    * 用户上传单个文件
    * @returns 
    */
    async uploadFile(sock: Sock, file: File, workspaceId, progress): Promise<{ ok: boolean, data?: { url: string, size: number }, warn?: string }> {
        try {
            if (!file.md5) file.md5 = await FileMd5(file);
            var r = await masterSock.get('/file/:md5/exists', { md5: file.md5 });
            var masterFile;
            if (r?.ok) masterFile = r.data;
            else {
                var d = await fileSock.upload<FileType, string>(file, { uploadProgress: progress });
                if (d.ok) {
                    masterFile = d.data;
                }
            }
            if (masterFile) {
                await sock.post('/user/storage/file', { ...masterFile, workspaceId });
            }
            return { ok: true, data: masterFile }
        }
        catch (ex) {
            return { ok: false, warn: '上传文件失败' }
        }
    }
}
export var workspaceService = new WorkspaceService();
