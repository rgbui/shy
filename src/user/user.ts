import { UserService } from "../service/user";


export enum UserStatus {
    busy,
    online,
    offline
}

export class User {
    id: string;
    profile_photo: string;
    account: string;
    status: UserStatus;
    get isLogin() {
        return this.id ? true : false;
    }
    async loadUser() {
        var userInfo = await UserService.tryLogin();
        Object.assign(this, userInfo);
    }
}