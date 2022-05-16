
import { User } from "../../src/surface/user/user";
import { fileSock, masterSock } from "../../net/sock";
import { BaseService } from "../common/base";
import { CacheKey, sCache } from "../../net/cache";
import { FileMd5 } from "../../src/util/file";
import { FileType } from "../../type";
import { SockResponse } from "../../net/sock/type";
import { act, del, get, patch, post, put } from "rich/net/annotation";
import { userNativeStore } from "../../native/store/user";
import { UserBasic } from "rich/types/user";
import { MergeSock } from "../../net/util/merge.sock";
import lodash from "lodash";

var batchUserBasic = new MergeSock(async (datas) => {
    var rs = await masterSock.get<{ list: UserBasic[] }>(`/users/basic`, { ids: lodash.uniq(datas.map(d => d.args)) });
    if (rs?.ok) {
        return datas.map(d => {
            return {
                ok: true,
                data: { user: rs.data.list.find(g => g.id == d.args) }
            }
        })
    }
    else return datas.map(d => ({ ok: false, wan: rs.warn }))
})
class UserService extends BaseService {
    @put('/phone/sign')
    async phoneSign(data) {
        var result: SockResponse<{ sign: boolean, token: string, user: Partial<User> }, string> = this.createResponse({ $phone: data.phone, $code: data.code });
        if (result.ok == false) return result;
        result = await masterSock.put('/phone/sign', data);
        return result;
    }
    @get('/phone/check/sign')
    async checkPhone(data: { phone: string }) {
        var result = await masterSock.get<{ isUser: boolean }, string>('/phone/check/sign', data);
        return result;
    }
    @post('/phone/sms/code')
    async generatePhoneCode(data: { phone: string }) {
        var phone = data.phone;
        var result: SockResponse<{ code?: string }, string> = this.createResponse({ $phone: phone });
        if (result.ok == false) return result;
        result = await masterSock.post('/phone/sms/code', { phone });
        return result;
    }
    @get('/sign/out')
    async signOut() {
        return await masterSock.get('/sign/out');
    }
    @get('/sign')
    async ping() {
        var result: SockResponse<{ token: string, guid: string, user: Partial<User> }> = this.createResponse();
        if (await sCache.get(CacheKey.token)) {
            result = await masterSock.get('/sign');
            if (result.ok) {
                if (result.data.token != await this.token()) {
                    await sCache.set(CacheKey.token, result.data.token, 180, 'd');
                }
            }
        }
        else {
            result.ok = false;
            result.warn = 'no sign';
        }
        return result;
    }
    @get('/user/query')
    async getUserInfo() {
        return await masterSock.get<{ user: Partial<User> }>('/user/query');
    }
    @patch('/user/patch')
    async update(data: Partial<User>) {
        return await masterSock.patch('/user/patch', data);
    }
    @patch('/user/patch/status')
    async userPatchStatus(args: Record<string, any>) {
        return await masterSock.patch('/user/patch/status', args);
    }
    @get('/user/basic')
    async getBasic(data: { userid: string }) {
        if (!data.userid) return { ok: false };
        var r = await userNativeStore.get(data.userid);
        if (r) return { ok: true, data: { user: r } };
        var g = await batchUserBasic.inject<SockResponse<{
            user: UserBasic
        }, any>>({ args: data.userid });
        if (g.ok) {
            await userNativeStore.put(g.data.user);
        }
        return g;
    }
    @get('/users/basic')
    async getBasics(data: { ids: string[] }) {
        return await masterSock.get<{ list: UserBasic[] }>(`/users/basic`, data)
    }
    /**
     * 用户直接上传文件，不考虑md5是否有重复
     * @param file 
     * @param progress 
     * @returns 
     */
    @post('/user/upload/file')
    async uploadFile(args: { file: File, progress }): Promise<{ ok: boolean, data?: { url: string, size: number }, warn?: string }> {
        var { file, progress } = args;
        try {
            if (!file.md5) file.md5 = await FileMd5(file);
            var d = await fileSock.upload<FileType, string>(file, { uploadProgress: progress });
            if (d.ok) {
                return { ok: true, data: d.data }
            }
            else return { ok: false, warn: d.warn }
        }
        catch (ex) {
            return { ok: false, warn: '上传文件失败' }
        }
    }
    @del('/user/write/off')
    async clearUser(sn: number) {
        return masterSock.delete('/user/write/off', arguments[0]);
    }
    @patch('/phone/check/update')
    async phoneUpdate(phone: string, code: string) {
        return masterSock.patch('/phone/check/update', arguments[0]);
    }
    @patch('/email/check/update')
    async emailCheck(email: string, code: string) {
        return masterSock.patch('/email/check/update', arguments[0]);
    }
    @post('/email/send/code')
    async emailSendCode(email: string) {
        return masterSock.post('/email/send/code', arguments[0]);
    }
    @patch('/user/set/paw')
    async userSetPaw(oldPaw: string, newPaw: string, confirmPaw: string) {
        return masterSock.patch('/user/set/paw', arguments[0]);
    }
    @put('/user/join/ws')
    async userJoinWs(args) {
        return masterSock.put('/user/join/ws', args);
    }
}


