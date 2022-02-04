
import { BaseService } from "./common/base";
import { Workspace } from "../src/surface/workspace";
import { fileSock, masterSock, Sock } from "../net/sock";
import { PageItem } from "../src/surface/sln/item";
import { FileType } from "../type";
import { FileMd5 } from "../src/util/file";
import { userTim } from "../net/primus/tim";
class WorkspaceService extends BaseService {

    /**
     * 
     * @param domain 域名
     * @param sn workspace序号
     * @param wsId workspace编号
     * @returns 
     */
    async loadWorkSpace(domain: string, sn: number, wsId: string) {
        return await masterSock.get<{ workspace: Workspace, users: any[] }, string>('/ws/query', {
            wsId,
            sn,
            domain,
        })
    }
    async loadMyWorkspace(wsHost?: string) {
        return await masterSock.get<{ workspaceId?: string, notCreateWorkSpace?: boolean }, string>('/ws/me', { wsHost })
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
        var rr = await masterSock.post('/ws/:wsId/update', { wsId, data, sock: userTim.id });
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
    async createInvite(wsId: string) {
        return await masterSock.post<{ code: string }, string>('/ws/:wsId/create/invite', { wsId })
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
    async uploadUrl(sock: Sock, url: string, workspaceId): Promise<{ ok: boolean, data?: { url: string, size: number }, warn?: string }> {
        try {
            var masterFile;
            var d = await fileSock.post('/storage/url/file', { url });
            if (d.ok) {
                masterFile = d.data;
            }
            if (masterFile) {
                await sock.post('/user/storage/file', { ...masterFile, workspaceId });
            }
            return { ok: true, data: masterFile }
        }
        catch (ex) {
            return { ok: false, warn: '下载文件失败' }
        }
    }
}
export var workspaceService = new WorkspaceService();
