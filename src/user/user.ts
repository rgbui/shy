import { userService } from "./service";

export enum UserStatus {
    busy,
    online,
    offline
}
export class User {
    public id: string;
    public inc: number;
    public status: UserStatus;
    public createDate: Date;
    public phone: string;
    public paw: string;
    public name: string;
    public avatar: { url: string };
    public email: string;
    public slogan: string;
    get isSign() {
        return this.id ? true : false;
    }
    async loadUser() {
        var r = await userService.ping();
        if (r.ok) {
            Object.assign(this, r.data.user);
        }
    }
}