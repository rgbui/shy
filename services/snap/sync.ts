
import { IconArguments } from "rich/extensions/icon/declare";
import { ElementType, getElementUrl } from "rich/net/element.type";
import { UserAction } from "rich/src/history/action";
import { Events } from "rich/util/events";
import { yCache } from "../../net/cache";
import { view_snap } from "../../net/db";
import { DbService } from "../../net/db/service";
import { timService } from "../../net/primus";
import { config } from "../../src/common/config";
import { surface } from "../../src/surface";
const DELAY_TIME = 1000 * 60 * 1;
var snapSyncMaps: Map<string, SnapSync> = new Map();

export type ViewOperate = {
    operate?: UserAction,
    seq: number
}
export class SnapSync extends Events {
    elementUrl: string;
    private constructor(elementUrl: string) { super(); this.elementUrl = elementUrl; }
    get localId() {
        return '/' + surface.workspace.id + '/' + this.elementUrl
    }
    async viewOperator(operate: Partial<UserAction>) {
        var r = await surface.workspace.sock.put<{
            seq: number,
            id: string
        }>('/view/operate', {
            elementUrl: this.elementUrl,
            wsId: surface.workspace.id,
            sockId: timService.sockId,
            operate: operate,
        });
        if (r.ok) {
            Object.assign(operate, r.data);
            return r.data;
        }
    }
    private localViewSnap: { seq: number, content: string, date: Date };
    private localTime;
    async viewSnap(seq: number, content: string) {
        /**
         * 本地先存起来
         */
        if (config.isPc) {
            await yCache.set(this.localId, {
                id: this.localId,
                content,
                seq,
                creater: surface?.user?.id,
                createDate: new Date()
            })
        }
        else await new DbService<view_snap>('view_snap').save({ id: this.localId }, {
            id: this.localId,
            content,
            seq,
            creater: surface?.user?.id,
            createDate: new Date()
        });
        this.localViewSnap = { seq, content, date: new Date() };
        if (this.localTime) clearTimeout(this.localTime);
        if (this.lastServiceViewSnap && (this.lastServiceViewSnap.date.getTime() - Date.now() > DELAY_TIME)) {
            this.saveToService();
        }
        else this.localTime = setTimeout(() => {
            this.saveToService();
        }, DELAY_TIME);
    }
    private lastServiceViewSnap: { seq: number, date: Date };
    private async saveToService() {
        if (this.localTime) { clearTimeout(this.localTime); this.localTime = undefined; }
        if (this.localViewSnap) {
            if (this.lastServiceViewSnap && this.lastServiceViewSnap.seq >= this.localViewSnap.seq) return;
            this.emit('willSave');
            var tryLocker = await surface.workspace.sock.get<{ lock: boolean, lockSockId: string }>('/view/snap/lock', {
                elementUrl: this.elementUrl,
                wsId: surface.workspace.id,
                sockId: timService.sockId,
                seq: this.localViewSnap.seq
            });
            if (tryLocker.ok && tryLocker.data.lock == true) {
                var r = await surface.workspace.sock.put('/view/snap', {
                    elementUrl: this.elementUrl,
                    wsId: surface.workspace.id,
                    sockId: timService.sockId,
                    seq: this.localViewSnap.seq,
                    content: this.localViewSnap.content
                })
                if(r.ok) {
                    if (typeof this.lastServiceViewSnap == 'undefined') {
                        this.lastServiceViewSnap = {} as any;
                    }
                    this.lastServiceViewSnap.seq = this.localViewSnap.seq;
                    this.lastServiceViewSnap.date = new Date();
                }
            }
            this.emit('saved');
        }
    }
    async forceSave() {
        await this.saveToService();
    }
    async querySnap() {
        var seq: number;
        var local: view_snap;
        if (config.isPc) local = await yCache.get(this.localId);
        else local = await new DbService<view_snap>('view_snap').findOne({ id: this.localId });

        if (local) seq = local.seq;
        var r = await surface.workspace.sock.get<{
            localExisting: boolean,
            file: IconArguments,
            operates: any[],
            content: string
        }>('/view/snap/query', {
            elementUrl: this.elementUrl,
            wsId: surface.workspace.id,
            seq
        });
        if (r.ok) {
            if (r.data.localExisting == true) return { content: local?.content ? JSON.parse(local?.content) : {} };
            return { operates: r.data.operates as ViewOperate[], content: r.data.content ? JSON.parse(r.data.content) : {} }
        }
    }
    static create(type: ElementType, parentId: string, id?: string) {
        var elementUrl = getElementUrl(type, parentId, id);
        var ss = snapSyncMaps.get(elementUrl);
        if (ss) return ss;
        else {
            ss = new SnapSync(elementUrl);
            snapSyncMaps.set(elementUrl, ss);
            return ss;
        }
    }
}