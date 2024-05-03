import { WorkspaceMember } from "rich/types/user";
import { Events } from "rich/util/events";


export class WsUserStore extends Events {
    private ms: Map<string, WorkspaceMember> = new Map();
    get(wsId: string, userid: string) {
        return this.ms.get(`${wsId}/${userid}`);
    }
    put(wsId: string, userid: string, member: Partial<WorkspaceMember>) {
        if (!member) return;
        var r = this.get(wsId, userid);
        if (r) {
            Object.assign(r, member);
        }
        else this.ms.set(`${wsId}/${userid}`, member as any);
    }
}

export interface WsUserStore {
    on(name: 'change', fn: (user: Partial<WorkspaceMember>) => void);
    off(name: 'change', fn: (user: Partial<WorkspaceMember>) => void);
    emit(name: 'change', user: Partial<WorkspaceMember>)
}

export var wsUserCacheStore = new WsUserStore();