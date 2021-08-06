
import { User } from "./user";
import { fileSock, masterSock, SockResponse } from "../service/sock";
import { BaseService } from "../service";
import { CacheKey, sCache } from "../service/cache";
import { FileMd5 } from "../util/file";
import { FileType } from "../../type";
import { OpenFileDialoug, OpenMultipleFileDialoug } from "rich/component/file";

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
        var fs: { file: File, data: FileType }[] = [];
        files.eachAsync(async file => {
            var r = await masterSock.get('/user/get/file/' + file.md5);
            if (r && r.ok) {
                fs.push({ file, data: r.data })
            }
            else {
                var d = await fileSock.upload<FileType, string>(file);
                if (d.ok) {
                    var z = await masterSock.post<FileType>(`/user/storage/file`, { ...d.data, ...{ id: undefined } })
                    if (z.ok) {
                        fs.push({ file, data: z.data })
                    }
                }
            }
        });
        return fs;
    }
    /**
     * 用户上传单个文件
     * @returns 
     */
    async uploadFile() {
        var file = await OpenFileDialoug();
        if (file) {
            file.md5 = await FileMd5(file);
            var r = await masterSock.get('/user/get/file/' + file.md5);
            if (r && r.ok) {
                return ({ file, data: r.data })
            }
            else {
                var d = await fileSock.upload<FileType, string>(file);
                if (d.ok) {
                    var z = await masterSock.post<FileType>(`/user/storage/file`, { ...d.data, ...{ id: undefined } })
                    if (z.ok) {
                        return ({ file, data: z.data })
                    }
                }
            }
        }
    }
}
export var userService = new UserService();