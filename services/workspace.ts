
import { BaseService } from "./common/base";
import { fileSock, masterSock, Sock } from "../net/sock";
import { FileType } from "../type";
import { FileMd5 } from "../src/util/file";
import { surface } from "../src/surface";
import { del, get, patch, post, put } from "rich/net/annotation";
import { timService } from "../net/primus";

class WorkspaceService extends BaseService {
    @get('/ws/basic')
    async queryWsBasic(data: { id?: string, name?: string }) {
        return await masterSock.get('/ws/basic', data);
    }
    @get('/ws/info')
    async queryWsInfo(data: { id?: string, name?: string }) {
        return await masterSock.get('/ws/info', data);
    }
    @get('/ws/query')
    async queryWs(data: { wsId: string }) {
        return await masterSock.get('/ws/query', data);
    }
    @get('/ws/latest')
    async latestWs() {
        return await masterSock.get('/ws/latest');
    }
    @get('/ws/discovery')
    async discoveryWs(args) {
        return await masterSock.get('/ws/discovery', args);
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
        data.sockId = timService.sockId;
        return await masterSock.patch('/ws/patch', data)
    }
    @get('/user/wss')
    async userWss() {
        var r = await masterSock.get<{ list: any[] }>('/user/wss');
        if (r.ok) {
            return r;
        }
    }

    @put('/ws/channel/send')
    async putUserChat(args) {
        args.wsId = surface.workspace.id;
        args.sockId = timService.sockId;
        return await surface.workspace.sock.put('/ws/channel/send', args);
    }
    @get('/ws/channel/list')
    async getChatList(args) {
        args.wsId = surface.workspace.id;
        return await surface.workspace.sock.get('/ws/channel/list', args);
    }
    @del('/ws/channel/cancel')
    async getChatCancel(args) {
        args.wsId = surface.workspace.id;
        args.sockId = timService.sockId;
        return await surface.workspace.sock.delete('/ws/channel/cancel', args);
    }

    /**
    * 用户上传单个文件
    * @returns 
    */
    @post('/ws/upload/file')
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
                await surface.workspace.sock.put('/file/store', { wsId: surface.workspace.id, file: masterFile?.file });
            }
            return { ok: true, data: masterFile }
        }
        catch (ex) {
            return { ok: false, warn: '上传文件失败' }
        }
    }
    @post('/ws/download/url')
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


    @get('/ws/member/word/query')
    async memberWordQuery(args) {
        args.wsId = surface.workspace.id;
        return await surface.workspace.sock.get('/ws/member/word/query', args);
    }
    @get('/ws/members')
    async getMembers(args) {
        if (!args) args = {};
        args.wsId = surface.workspace.id;
        return await surface.workspace.sock.get('/ws/members', args);
    }
    @del('/ws/memeber/delete')
    async deleteWsMemeber(args) {
        args.wsId = surface.workspace.id;
        return await surface.workspace.sock.delete('/ws/memeber/delete', args);
    }
    @get('/ws/roles')
    async getWsRoles(args) {
        if (!args) args = {};
        args.wsId = surface.workspace.id;
        return await surface.workspace.sock.get('/ws/roles', args);
    }
    @patch('/ws/role/patch')
    async rolePatch(args) {
        args.wsId = surface.workspace.id;
        return await surface.workspace.sock.patch('/ws/role/patch', args);
    }
    @put('/ws/role/create')
    async rolePut(args) {
        args.wsId = surface.workspace.id;
        return await surface.workspace.sock.put('/ws/role/create', args);
    }
    @del('/ws/role/delete')
    async roleDelete(args) {
        args.wsId = surface.workspace.id;
        return await surface.workspace.sock.delete('/ws/role/delete', args);
    }
    @get('/ws/role/members')
    async roleUsers(args) {
        args.wsId = surface.workspace.id;
        return await surface.workspace.sock.get('/ws/role/members', args);
    }
    @patch('/ws/set/domain')
    async wsSetDomain(args) {
        if (!args.wsId) args.wsId = surface.workspace.id;
        return await masterSock.patch('/ws/set/domain', args);
    }
    @patch('/ws/patch/member/roles')
    async wsPatchMemberRoles(args) {
        if (!args) args = {}
        if (!args.wsId) args.wsId = surface.workspace.id;
        args.wsId = surface.workspace.id;
        return await surface.workspace.sock.patch('/ws/patch/member/roles', args);
    }

    @put('/ws/invite/create')
    async createInvite(args) {
        if (!args) args = {}
        if (!args.wsId) args.wsId = surface.workspace.id;
        return await masterSock.put('/ws/invite/create', args);
    }
    @get('/ws/invite/check')
    async checkInvite(args) {
        return await masterSock.put('/ws/invite/check', args);
    }
    @put('/ws/invite/join')
    async inviteJoin(args) {
        if (args.sock) {
            return args.sock.put('/ws/invite/join', { wsId: args.wsId });
        }
    }
    @get('/ws/is/member')
    async memberIsOfWorkspace(args) {
        if (args.sock) {
            return args.sock.put('/ws/is/member', { wsId: args.wsId });
        }
    }
    @get('/ws/access/info')
    async wsAccessInfo(args) {
        return surface.workspace.sock.get('/ws/access/info', args);
    }
}

