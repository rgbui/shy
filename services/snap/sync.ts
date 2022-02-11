import { IconArguments } from "rich/extensions/icon/declare";
import { SockResponse } from "rich/net/declare";
import { ElementType, getElementUrl } from "rich/net/element.type";
import { view_snap } from "../../net/db";
import { DbService } from "../../net/db/service";
import { timService } from "../../net/primus";
import { surface } from "../../src/surface";
import { XhrReadFileBlob } from "../../src/util/file";
const DELAY_TIME = 1000 * 60 * 1;
var snapSyncMaps: Map<string, SnapSync> = new Map();
export class SnapSync {
    elementUrl: string;
    private constructor(elementUrl: string) { this.elementUrl = elementUrl; }
    get localId() {
        return '/' + surface.workspace.id + '/' + this.elementUrl
    }
    async viewOperator(operate: {}) {
        var r = await surface.workspace.sock.put<{
            seq: number,
            id: string
        }>('/view/operate', {
            elementUrl: this.elementUrl,
            wsId: surface.workspace.id,
            sockId: timService.tim.id,
            operate: operate,
        });
        if (r.ok) {
            Object.assign(operate, r.data);
            return r.data;
        }
    }
    private localViewSnap: { seq: number, content: Blob | string, date: Date };
    private localTime;
    async viewSnap(seq: number, content: Blob | string) {
        /**
         * 本地先存起来
         */
        await new DbService<view_snap>('view_snap').save({ id: this.localId }, {
            file: content instanceof Blob ? content : undefined,
            content: !(content instanceof Blob) ? (typeof content == 'object' ? JSON.stringify(content) : content) : undefined,
            seq
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
            var tryLocker = await surface.workspace.sock.get<{ lock: false, lockSockId: string }>('/view/snap/lock', {
                elementUrl: this.elementUrl,
                wsId: surface.workspace.id,
                sockId: timService.tim.id,
                seq: this.localViewSnap.seq
            });
            if (tryLocker.ok && tryLocker.data.lock == false) {
                var r: SockResponse<any, any>;
                if (this.localViewSnap.content instanceof Blob)
                    r = await surface.workspace.sock.upload(this.localViewSnap.content, {
                        url: '/view/snap',
                        data: {
                            elementUrl: this.elementUrl,
                            wsId: surface.workspace.id,
                            sockId: timService.tim.id,
                            seq: this.localViewSnap.seq
                        }
                    });
                else r = await surface.workspace.sock.put('/view/snap', {
                    elementUrl: this.elementUrl,
                    wsId: surface.workspace.id,
                    sockId: timService.tim.id,
                    seq: this.localViewSnap.seq,
                    content: this.localViewSnap.content
                })
                if (r.ok) {
                    this.lastServiceViewSnap.seq = this.localViewSnap.seq;
                    this.lastServiceViewSnap.date = new Date();
                }
            }
        }
    }
    async forceSave() {
        await this.saveToService();
    }
    async querySnap() {
        var seq: number;
        var local = await new DbService<view_snap>('view_snap').findOne({ id: this.localId });
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
            if (r.data.localExisting == true) return { file: local.file };
            var file;
            if (r.data.file?.url) file = await XhrReadFileBlob(r.data.file.url);
            return { file, operates: r.data.operates, content: r.data.content }
        }
    }
    static create(type: ElementType, parentId: string, id?: string) {
        var elementUrl = getElementUrl(type, parentId, id);
        var ss = snapSyncMaps.get(elementUrl);
        if (ss) {
            return ss;
        }
        else {
            ss = new SnapSync(elementUrl);
            snapSyncMaps.set(elementUrl, ss);
            return ss;
        }
    }
}