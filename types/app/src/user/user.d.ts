export declare enum UserStatus {
    busy = 0,
    online = 1,
    offline = 2
}
export declare class User {
    id: string;
    profile_photo: string;
    account: string;
    status: UserStatus;
    get isLogin(): boolean;
    loadUser(): Promise<void>;
}
