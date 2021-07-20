
import { User } from "./user";
import { masterSock, SockResponse } from "../service/sock";
import { BaseService } from "../service";
import { CacheKey, sCache } from "../service/cache";
import { FileMd5, OpenMultipleFileDialoug } from "../util/file";

class UserService extends BaseService {
    async phoneSign(phone: string, code: string) {
        var result: SockResponse<{ justRegistered: boolean, token: string, user: Partial<User> }, string> = this.createResponse({ $phone: phone, $code: code });
        if (result.ok == false) return result;
        result = await masterSock.post('/phone/login', { phone, code });
        return result;
    }
    async updateName(name: string) {
        var result: SockResponse<{ token: string, user: Partial<User> }, string> = this.createResponse({});
        if (!name) { result.ok = false; result.warn = '呢称不能为空'; return result; }
        if (result.ok == false) return result;
        result = await masterSock.post('/user/update/name', { name });
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
        result = await masterSock.post('/user/ping');
        if (result.ok) {
            if (result.data.token != this.token) {
                sCache.set(CacheKey.token, result.data.token, 180, 'd');
            }
        }
        return result;
    }
    /**
     * 用户批量上传文件
     */
    async uploadFiles() {
        var files = await OpenMultipleFileDialoug();
        files.eachAsync(async (file: File) => {
            file.md5 = await FileMd5(file);
        });
    }
}
export var userService = new UserService();