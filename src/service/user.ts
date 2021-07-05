
import { UserStatus } from "../user/user";
import { fingerFlag } from "../util/finger";
import { masterSock, SockResponseType } from "./sock";

export class UserService {
    static async phoneSign(phone: string, verifyCode: string) {
        let id = await fingerFlag();
        return await masterSock.post<SockResponseType>('/phone/login', { phone, verifyCode, fingerprint: id });
    }
    static async GeneratePhoneCode(phone: string) {
        let id = await fingerFlag();
        return await masterSock.post<SockResponseType>('/generate/phone/code', { phone, fingerprint: id });
    }
    static async tryLogin() {
        var user: Record<string, any> = {};
        user.id = 'kankantest';
        user.account = 'kankan';
        user.profile_photo = 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2Fd84aa9f4-1aaf-4547-8273-ba1129f7b675%2F109951163041428408.jpg?table=space&id=37659cc5-3ed0-4375-9a9d-ce77379a49ff&width=40&userId=3c8f21e7-4d95-4ff1-a44b-3a82c3a8098e&cache=v2';
        user.status = UserStatus.online;
        return user;
    }
}