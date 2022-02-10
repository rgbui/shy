
import { User } from "../src/surface/user/user";
import { fileSock, masterSock } from "../net/sock";
import { BaseService } from "./common/base";
import { CacheKey, sCache } from "../net/cache";
import { FileMd5 } from "../src/util/file";
import { FileType } from "../type";
import { SockResponse } from "../net/sock/type";
import { ResourceArguments } from "rich/extensions/icon/declare";
import { act, get, patch, post, put } from "rich/net/annotation";


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
    async update(data: Partial<User>)
    {
        return await masterSock.patch('/user/patch', data);
    }
    @get('/user/basic')
    async getBasic(data: { userid: string }) {
        return await masterSock.get<{ sn: number, avatar: ResourceArguments, name: string }>(`/user/basic`, data)
    }
    /**
     * 用户直接上传文件，不考虑md5是否有重复
     * @param file 
     * @param progress 
     * @returns 
     */
    @act('/user/upload/file')
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
}
