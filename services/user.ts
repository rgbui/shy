
import { User } from "../src/view/surface/user/user";
import { fileSock, masterSock, userSock } from "../net/sock";
import { BaseService } from "../net";
import { CacheKey, sCache } from "../net/cache";
import { FileMd5 } from "../src/util/file";
import { FileType } from "../type";
import { SockResponse } from "../net/sock/type";

class UserService extends BaseService {
    async phoneSign(phone: string, code: string, usingInvitationCode?: string) {
        var result: SockResponse<{ justRegistered: boolean, token: string, user: Partial<User> }, string> = this.createResponse({ $phone: phone, $code: code });
        if (result.ok == false) return result;
        result = await masterSock.post('/phone/login', { phone, code, usingInvitationCode });
        return result;
    }
    async checkPhone(phone: string) {
        var result = await masterSock.post<{ isUser: boolean }, string>('/phone/check', { phone });
        return result;
    }
    async generatePhoneCode(phone: string) {
        var result: SockResponse<{ code?: string }, string> = this.createResponse({ $phone: phone });
        if (result.ok == false) return result;
        result = await masterSock.post('/generate/phone/code', { phone });
        return result;
    }
    async signOut() {
        return await masterSock.get('/sign/out');
    }
    async ping() {
        var result: SockResponse<{ token: string, user: Partial<User> }> = this.createResponse();
        result = await masterSock.get('/user/ping');
        if (result.ok) {
            if (result.data.token != await this.token()) {
                await sCache.set(CacheKey.token, result.data.token, 180, 'd');
            }
        }
        return result;
    }
    async update(data: Partial<User>) {
        var r = await masterSock.post('/user/update', { data });
        return r;
    }
    /**
     * 用户上传单个文件
     * @returns 
     */
    async uploadWorkspaceFile(file: File, workspaceId, progress): Promise<{ ok: boolean, data?: { url: string, size: number }, warn?: string }> {
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
                await userSock.post('/user/storage/file', { ...masterFile, workspaceId });
            }
            return { ok: true, data: masterFile }
        }
        catch (ex) {
            return { ok: false, warn: '上传文件失败' }
        }
    }
    /**
     * 用户直接上传文件，不考虑md5是否有重复
     * @param file 
     * @param progress 
     * @returns 
     */
    async uploadFile(file: File, progress): Promise<{ ok: boolean, data?: { url: string, size: number }, warn?: string }> {
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
export var userService = new UserService();