import { IconArguments } from "rich/extensions/icon/declare";
import { Directive } from "rich/util/bus/directive";
import { messageChannel } from "rich/util/bus/event.bus";
import { util } from "rich/util/util";
import { userService } from "../../../services/user";
import { useOpenUserSettings } from "./settings";
export class User {
    public id: string;
    public inc: number;
    public createDate: Date;
    public phone: string;
    public paw: string;
    public name: string;
    public avatar: IconArguments;
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
    async onOpenUserSettings(event: React.MouseEvent) {
        await useOpenUserSettings()
    }
    async onUpdateUserInfo(userInfo: Partial<User>) {
        var updateData: Partial<User> = {};
        for (let n in userInfo) {
            if (util.valueIsEqual(userInfo[n], this[n])) continue;
            else updateData[n] = userInfo[n];
        }
        if (Object.keys(updateData).length > 0) {
            var r = await userService.update(userInfo);
            if (r.ok) {
                Object.assign(this, userInfo);
                await messageChannel.fireAsync(Directive.UpdateUser, this);
            }
        }
    }
}