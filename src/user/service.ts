
import { User, UserStatus } from "./user";
import { masterSock, SockResponse } from "../service/sock";
import { BaseService } from "../service";
import { CacheKey, sCache } from "../service/cache";

class UserService extends BaseService {
    async phoneSign(phone: string, code: string) {
        var result: SockResponse<{ token: string, user: Partial<User> }, string> = this.createResponse({ $phone: phone, $code: code });
        if (result.ok == false) return result;
        result = await masterSock.post('/phone/login', { phone, code });
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
}
export var userService = new UserService();