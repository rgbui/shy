import lodash from "lodash";
import { makeObservable, observable } from "mobx";
import { IconArguments } from "rich/extensions/icon/declare";
import { channel } from "rich/net/channel";
import { UserStatus } from "rich/types/user";
import { util } from "rich/util/util";
import { useOpenUserSettings } from "./settings";

export class User {
    public id: string = null;
    public sn: number = null;
    public createDate: Date = null;
    public phone: string = null;
    public checkPhone: boolean = null;
    public checkRealName: boolean = null;
    public realName: string = null;
    public paw: string = null;
    public checkPaw: boolean = null;
    public name: string = null;
    public avatar: IconArguments = null;
    public cover: IconArguments = null;
    public email: string = null;
    public checkEmail: boolean = null;
    public slogan: string = null;
    /**
     * 注册来源
     */

    public source: string = null;
    public inviteCode: string = null;
    public usedInviteCode: string = null;
    public config: object = null;
    public status: UserStatus = null;
    public online: boolean = null
    constructor() {
        makeObservable(this, {
            id: observable,
            sn: observable,
            createDate: observable,
            phone: observable,
            paw: observable,
            name: observable,
            avatar: observable,
            email: observable,
            slogan: observable,
            config: observable,
            inviteCode: observable,
            checkEmail: observable,
            cover: observable,
            realName: observable,
            checkRealName: observable
        })
    }
    get isSign() {
        return this.id ? true : false;
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
            var r = await channel.patch('/user/patch', { data: updateData });
            if (r.ok) {
                this.syncUserInfo(updateData);
            }
            channel.fire('/update/user', { user: this })
        }
    }
    syncUserInfo(userInfo: Record<string, any>) {
        lodash.assign(this, userInfo);
    }
}