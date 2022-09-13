import lodash from "lodash";
import { UserBasic } from "rich/types/user";
import { Events } from "rich/util/events";

export class UserStore extends Events {
    private ms: Map<string, UserBasic> = new Map();
    async get(userid: string) {
        return this.ms.get(userid);
    }
    async getUsers(...userids: string[]) {
        var us: UserBasic[] = [];
        await userids.eachAsync(async (id) => {
            var r = await this.get(id);
            if (r) us.push(r)
        });
        return us;
    }
    async put(user: Partial<UserBasic>) {
        if (!user) return;
        var r = await this.get(user.id);
        if (r) {
            Object.assign(r, user);
        }
        else this.ms.set(user.id, user as any);
    }
    async notifyUpdate(userid: string, data: Record<string, any>) {
        var r = this.ms.get(userid);
        if (r) {
            var c = lodash.cloneDeep(r);
            Object.assign(r, data);
            if (!lodash.isEqual(c, r)) {
                this.emit('change', r)
            }
        }
    }
}

export interface UserStore {
    on(name: 'change', fn: (user: UserBasic) => void);
    off(name: 'change', fn: (user: UserBasic) => void);
    emit(name: 'change', user: UserBasic)
}

export var userNativeStore = new UserStore();
