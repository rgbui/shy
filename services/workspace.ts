
import { BaseService } from "./common/base";
import { masterSock, Sock } from "../net/sock";
import { surface } from "../src/surface/store";
import { del, get, patch, post, put } from "rich/net/annotation";
import { Workspace } from "../src/surface/workspace";
import { FileMd5 } from "../src/util/file";
import { ShyAlert } from "rich/component/lib/alert";
import { lst } from "rich/i18n/store";

class WorkspaceService extends BaseService {
    private wsPids: Map<string, any[]> = new Map();
    setWsPids(wsId: string, pids: any[]) {
        if (!this.wsPids.has(wsId))
            this.wsPids.set(wsId, pids);
    }
    async getWsSock(wsId: string) {
        var sock: Sock;
        var pids = this.wsPids.get(wsId);
        if (pids) {
            sock = Workspace.getWsSock(pids, 'ws')
        }
        else {
            var r = await masterSock.get('/ws/pids', { wsId });
            if (r?.ok) {
                sock = Workspace.getWsSock(r.data.pids, 'ws')
                this.wsPids.set(wsId, r.data.pids)
            }
        }
        return sock;
    }
    async getArgsSock(args) {
        var sock: Sock;
        if (args.wsId) {
            if (args.wsId == surface.workspace?.id)
                return surface.workspace.sock;
            else return await this.getWsSock(args.wsId);
        }
        if (args.sock) {
            sock = args.sock;
            delete args.sock;
            return sock;
        }
        if (args.ws) {
            var ws = args.ws;
            args.wsId = ws.id;
            delete args.ws;
            if (ws.id == surface.workspace?.id)
                return surface.workspace.sock;
            else return await this.getWsSock(ws.id);
        }
        if (surface.workspace) {
            args.wsId = surface.workspace.id;
            args.sockId = surface.workspace?.tim?.id;
        }
        return surface.workspace?.sock;
    }
    @get('/ws/basic')
    async queryWsBasic(args) {
        var sock = await this.getArgsSock(args);
        return await sock.get('/ws/basic', args);
    }
    @get('/ws/info')
    async queryWsInfo(args) {
        var sock = await this.getArgsSock(args);
        return await sock.get('/ws/info', args);
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
    async createWs(data: {
        text: string,
        dataServiceAddress?: string,
        searchServiceAddress?: string,
        fileServiceAddress?: string,
        templateUrl?: string
    }) {
        var rr = await masterSock.put('/ws/create', {
            text: data.text,
            dataServiceAddress: data.dataServiceAddress,
            searchServiceAddress: data.searchServiceAddress,
            fileServiceAddress: data.fileServiceAddress,
        })
        if (rr.ok) {
            var url = Workspace.getWsSockUrl(rr.data.pids, 'ws');
            var sock = Sock.createSock(url);
            await sock.put('/ws/init', {
                wsId: rr.data.workspace.id,
                text: data.text,
                sn: rr.data.workspace.sn,
                templateUrl: data.templateUrl
                // templateId?: string
            });
            return { ok: true, data: { workspace: rr.data.workspace, pids: rr.data.pids } }
        }
        else return { ok: false, warn: rr.warn }
    }
    @patch('/ws/patch')
    async update(data: { wsId?: string, sockId?: string, data: Record<string, any> }) {
        data.wsId = surface.workspace.id;
        data.sockId = surface.workspace.tim.id;
        await masterSock.patch('/ws/master/patch', data);
        return await surface.workspace.sock.patch('/ws/patch', data)
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
        args.sockId = surface.workspace.tim.id;
        return await surface.workspace.sock.put('/ws/channel/send', args);
    }
    @get('/ws/channel/list')
    async getChatList(args) {
        var sock = await this.getArgsSock(args);
        return await sock.get('/ws/channel/list', args);
    }
    @del('/ws/channel/cancel')
    async getChatCancel(args) {
        args.wsId = surface.workspace.id;
        args.sockId = surface.workspace.tim.id;
        return await surface.workspace.sock.delete('/ws/channel/cancel', args);
    }
    @patch('/ws/channel/patch')
    async channelPatch(args) {
        args.wsId = surface.workspace.id;
        args.sockId = surface.workspace.tim.id;
        return await surface.workspace.sock.patch('/ws/channel/patch', args);
    }
    @put('/ws/channel/emoji')
    async channelEmoji(args) {
        args.wsId = surface.workspace.id;
        args.sockId = surface.workspace.tim.id;
        return await surface.workspace.sock.put('/ws/channel/emoji', args);
    }
    @get('/ws/channel/abled/send')
    async getChannelAbledSend(args) {
        var sock = await this.getArgsSock(args);
        return await sock.get('/ws/channel/abled/send', args);
    }

    /**
    * 用户上传单个文件
    * @returns 
    */
    @post('/ws/upload/file')
    async uploadFile(data: { file: File, uploadProgress }): Promise<{ ok: boolean, data?: { url: string, size: number }, warn?: string }> {
        try {
            if (data.file.size > 1024 * 1024 * 50) {
                ShyAlert(lst('暂时不支持上传超过50M的文件'))
                return { ok: false, warn: lst('文件大小不能超过50M') }
            }
            var masterFile;
            var { file, uploadProgress } = data;
            if (!file.md5) file.md5 = await FileMd5(file);
            var d = await surface.workspace.fileSock.upload(file, { url: '/ws/file/upload', uploadProgress: uploadProgress });
            if (d.ok) {
                masterFile = d.data;
            }
            return { ok: true, data: masterFile }
        }
        catch (ex) {
            console.error(lst('上传文件失败'), ex)
            return { ok: false, warn: lst('上传文件失败') }
        }
    }
    @post('/ws/download/url')
    async uploadUrl(data: { url: string }): Promise<{ ok: boolean, data?: { url: string, size: number }, warn?: string }> {
        try {
            var { url } = data;
            var masterFile;
            var d = await surface.workspace.fileSock.put('/ws/file/download', { url });
            if (d.ok) {
                masterFile = d.data;
            }
            return { ok: true, data: masterFile }
        }
        catch (ex) {
            return { ok: false, warn: lst('下载文件失败') }
        }
    }
    @get('/ws/member/word/query')
    async memberWordQuery(args) {
        var sock = await this.getArgsSock(args);
        return await sock.get('/ws/member/word/query', args);
    }
    @get('/ws/members')
    async getMembers(args) {
        if (!args) args = {};
        var sock = await this.getArgsSock(args);
        return await sock.get('/ws/members', args);
    }
    @del('/ws/member/delete')
    async deleteWsMemeber(args) {
        args.wsId = surface.workspace.id;
        return await surface.workspace.sock.delete('/ws/member/delete', args);
    }
    @get('/ws/roles')
    async getWsRoles(args) {
        if (!args) args = {};
        var sock = await this.getArgsSock(args);
        return await sock.get('/ws/roles', args);
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
        if (!args) args = {};
        var sock = await this.getArgsSock(args);
        return await sock.get('/ws/role/members', args);
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
        return await masterSock.get('/ws/invite/check', args);
    }
    @put('/ws/invite/join')
    async inviteJoin(args) {
        if (args.sock) {
            return await args.sock.put('/ws/invite/join', { wsId: args.wsId });
        }
    }
    @get('/ws/is/member')
    async memberIsOfWorkspace(args) {
        if (args.sock) {
            return await args.sock.get('/ws/is/member', { wsId: args.wsId });
        }
    }
    @get('/ws/access/info')
    async wsAccessInfo(args) {
        var sock = await this.getArgsSock(args);
        return await sock.get('/ws/access/info', args);
    }
    @del('/ws/member/exit')
    async wsMemberExit(args) {
        var sock = await this.getArgsSock(args);
        return await sock.delete('/ws/member/exit', { wsId: args.wsId });
    }
    @put('/bookmark/url')
    async bookMarkUrl(args) {
        return await surface.workspace.fileSock.put('/ws/bookmark/url', { url: args.url });
    }
    @get('/page/word/query')
    async pageWordQuery(args) {
        var sock = await this.getArgsSock(args);
        return await sock.get('/page/word/query', { word: args.word, size: args.size, wsId: surface.workspace.id });
    }
    @get('/ws/search')
    async wsSearch(args) {
        var sock = await this.getArgsSock(args);
        return await sock.get('/ws/search', {
            wsId: surface.workspace.id,
            ...args
        });
    }

    @get('/ws/comment/list')
    async wsCommentList(args) {
        var sock = await this.getArgsSock(args);
        return await sock.get('/ws/comment/list', {
            wsId: surface.workspace.id,
            ...args
        });
    }


    @put('/ws/comment/send')
    async wsCommentSend(args) {
        return await surface.workspace.sock.put('/ws/comment/send', {
            wsId: surface.workspace.id,
            ...args
        });
    }


    @del('/ws/comment/del')
    async wsDel(args) {
        return await surface.workspace.sock.delete('/ws/comment/del', {
            wsId: surface.workspace.id,
            ...args
        });
    }

    @put('/ws/comment/emoji')
    async wsCommentEmoji(args) {
        return await surface.workspace.sock.put('/ws/comment/emoji', {
            wsId: surface.workspace.id,
            ...args
        });
    }
    @get('/ws/random/online/users')
    async wsRandomOnLineUsers(args) {
        var sock = await this.getArgsSock(args);
        return await sock.get('/ws/random/online/users', args)
    }
    @get('/ws/online/users')
    async wsOnlineUsers(args) {
        var sock = await this.getArgsSock(args);
        return await sock.get('/ws/online/users', args);
    }
    @get('/ws/view/online/users')
    async wsGetViewOnLineUsers(args) {
        var sock = await this.getArgsSock(args);
        return await sock.get('/ws/view/online/users', args);
    }
    @get('/view/browse')
    async viewBrowse(args) {
        var sock = await this.getArgsSock(args);
        return await sock.get('/view/browse', args);
    }
    @post('/create/template')
    async createTemplate(args) {
        args.wsId = surface.workspace.id;
        return await surface.workspace.sock.post('/create/template', args);
    }
    @post('/create/workspace/template')
    async createWorkspace(args) {
        return await masterSock.post('/create/workspace/template', args);
    }
    @get('/get/workspace/template')
    async getWorkspaceTemplate(args) {
        return await masterSock.get('/get/workspace/template', args);
    }
    @del('/del/workspace/template')
    async deleteWorkspaceTemplate(args) {
        return await masterSock.delete('/del/workspace/template', args);
    }
    @get('/search/workspace/template')
    async searchWorkspaceTemplate(args) {
        return masterSock.get('/search/workspace/template', args);
    }

    @post('/workspace/template/useCount')
    async workspaceTemplateUseCount(args) {
        return masterSock.post('/workspace/template/useCount', args);
    }

    @put('/ws/flow')
    async wsFlowPut(args) {
        if (typeof args == 'undefined') args = {}
        var sock = await this.getArgsSock(args);
        return await sock.put('/ws/flow', args);
    }

    @get('/ws/flow/get')
    async wsFlowGet(args) {
        if (typeof args == 'undefined') args = {}
        var sock = await this.getArgsSock(args);
        return await sock.get('/ws/flow/get', args);
    }
    @get('/ws/ai/search')
    async wsAiSearch(args) {
        if (typeof args == 'undefined') args = {}
        var sock = await this.getArgsSock(args);
        return await sock.get('/ws/ai/search', args);
    }
}


export var wss = new WorkspaceService();
