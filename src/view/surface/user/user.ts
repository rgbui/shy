import { makeObservable, observable } from "mobx";
import { IconArguments } from "rich/extensions/icon/declare";
import { Directive } from "rich/util/bus/directive";
import { messageChannel } from "rich/util/bus/event.bus";
import { util } from "rich/util/util";
import { userService } from "../../../../services/user";
import { config } from "../../../common/config";
import { useOpenUserSettings } from "./settings";
export class User {
    public id: string = null;
    public inc: number = null;
    public createDate: Date = null;
    public phone: string = null;
    public paw: string = null;
    public name: string = null;
    public avatar: IconArguments = null;
    public checkPhone: boolean;
    public checkUserRealName: boolean;
    public email: string = null;
    public slogan: string = null;
    constructor() {
        makeObservable(this, {
            id: observable,
            inc: observable,
            createDate: observable,
            phone: observable,
            paw: observable,
            name: observable,
            avatar: observable,
            email: observable,
            slogan: observable
        })
    }
    get isSign() {
        return this.id ? true : false;
    }
    async loadUser() {
        var r = await userService.ping();
        if (r.ok) {
            config.updateServiceGuid(r.data.guid);
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