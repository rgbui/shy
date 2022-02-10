
import { BaseService } from "./common/base";
import { fileSock, masterSock, Sock } from "../net/sock";
import { FileType } from "../type";
import { FileMd5 } from "../src/util/file";
import { surface } from "../src/surface";
import { get, patch, post, put } from "rich/net/annotation";
import { timService } from "../net/primus";
class WorkspaceService extends BaseService {
    @get('/ws/basic')
    async queryWsBasic(data: { id?: string, name?: string }) {
        return await masterSock.get('/ws/basic', data);
    }
    @get('/ws/query')
    async queryWs(data: { wsId: string }) {
        return await masterSock.get('/ws/query', data);
    }
    @get('/ws/latest')
    async latestWs() {
        return await masterSock.get('/ws/latest');
    }
    @put('/ws/create')
    async createWs(data: { text: string, templateId }) {
        var r = await masterSock.put<{ workspace: Record<string, any> }>('/ws/create', { text: data.text });
        if (r.ok) {
            var pidUrl = r.data.workspace.pidUrl;
            if (pidUrl) {
                var sock = Sock.createSock(pidUrl);
                await sock.put('/ws/init', { wsId: r.data.workspace.id, templateId: data.templateId });
                return { ok: true, data: { workspace: r.data.workspace } }
            }
        }
        return { ok: false, warn: r.warn }
    }
    @patch('/ws/patch')
    async update(data: { wsId?: string, sockId?: string, data: Record<string, any> }) {
        data.wsId = surface.workspace.id;
        data.sockId = timService.tim.id;
        return await masterSock.patch('/ws/patch', data)
    }
    @get('/user/wss')
    async userWss() {
        var r = await masterSock.get<{ list: any[] }>('/user/wss');
        if (r.ok) {
            return r;
        }
    }
    // @get('/ws/basic')
    // async queryWsBasic(data) {

    // }
    /**
     * 
     * @param domain 域名
     * @param sn workspace序号
     * @param wsId workspace编号
     * @returns 
     */
    // async loadWorkSpace(domain: string, sn: number, wsId: string) {
    //     return await masterSock.get<{ workspace: Workspace, users: any[] }, string>('/ws/query', {
    //         wsId,
    //         sn,
    //         domain,
    //     })
    // }
    // async loadMyWorkspace(wsHost?: string) {
    //     return await masterSock.get<{ workspaceId?: string, notCreateWorkSpace?: boolean }, string>('/ws/me', { wsHost })
    // }
    // async getWorkspaces() {
    //     var data = await masterSock.get<{ list: Partial<Workspace>[] }>('/ws/list');
    //     return data;
    // }
    // async createWorkspace(args: { text: string }) {
    //     var rr = await masterSock.post<{ id: string, sn: number }, string>('/ws/create', { text: args.text });
    //     return rr;
    // }
    // async updateWorkspace(wsId: string, data: Partial<Workspace>) {
    //     var rr = await masterSock.post('/ws/:wsId/update', { wsId, data, sock: userTim.id });
    //     return rr;
    // }
    // async loadWorkspaceItems(workspaceId: string, pageIds: string[]) {
    //     var rr = await masterSock.post<
    //         { pages: Partial<PageItem> },
    //         string>('/ws/:wsId/items', { wsId: workspaceId, pageIds: pageIds || [] }
    //         )
    //     return rr;
    // }
    // async loadPageChilds(pageId: string) {
    //     var rr = await masterSock.get<{ list: Partial<PageItem>[] }, string>('/page/:parentId/subs', { parentId: pageId });
    //     return rr;
    // }
    // async getPage(id: string) {
    //     var page = await masterSock.get<{ page: Partial<PageItem> }, string>('/page/:id/query', { id });
    //     return page;
    // }
    // async toggleFavourcePage(item: PageItem) {

    // }
    // async createInvite(wsId: string) {
    //     return await masterSock.post<{ code: string }, string>('/ws/:wsId/create/invite', { wsId })
    // }
    /**
    * 用户上传单个文件
    * @returns 
    */
    @post('ws/upload/file')
    async uploadFile(data: { file: File, progress }): Promise<{ ok: boolean, data?: { url: string, size: number }, warn?: string }> {
        try {
            var { file, progress } = data;
            if (!file.md5) file.md5 = await FileMd5(file);
            var r = await fileSock.get('/file/exists', { md5: file.md5 });
            var masterFile;
            if (r?.ok) masterFile = r.data;
            else {
                var d = await fileSock.upload<FileType, string>(file, { uploadProgress: progress });
                if (d.ok) {
                    masterFile = d.data;
                }
            }
            if (masterFile) {
                await surface.workspace.sock.put('/file/store', { wsId: surface.workspace.id, file: masterFile });
            }
            return { ok: true, data: masterFile }
        }
        catch (ex) {
            return { ok: false, warn: '上传文件失败' }
        }
    }
    @post('ws/download/url')
    async uploadUrl(data: { url: string }): Promise<{ ok: boolean, data?: { url: string, size: number }, warn?: string }> {
        try {
            var { url } = data;
            var masterFile;
            var d = await fileSock.put('/file/download', { url });
            if (d.ok) {
                masterFile = d.data;
            }
            if (masterFile) {
                await surface.workspace.sock.post('/file/store', { file: masterFile, wsId: surface.workspace.id });
            }
            return { ok: true, data: masterFile }
        }
        catch (ex) {
            return { ok: false, warn: '下载文件失败' }
        }
    }
}

