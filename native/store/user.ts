import { UserBasic } from "rich/types/user";

class UserStore {
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
}

export var userNativeStore = new UserStore();
