
import { QueueHandle } from "rich/component/lib/queue";
import { IconArguments, ResourceArguments } from "rich/extensions/icon/declare";
import { ElementType, getElementUrl } from "rich/net/element.type";
import { UserAction, ViewOperate } from "rich/src/history/action";
import { Events } from "rich/util/events";
import { yCache } from "../../net/cache";
import { view_snap } from "../../net/db";
import { DbService } from "../../net/db/service";
import { log } from "../../common/log";
import { surface } from "../../src/surface/store";
const DELAY_TIME = 1000 * 60 * 3;
const MAX_OPERATE_COUNT = 50;
var snapSyncMaps: Map<string, SnapStore> = new Map();

export class SnapStore extends Events {
    elementUrl: string;
    private constructor(elementUrl: string) { super(); this.elementUrl = elementUrl; }
    get localId() {
        return '/' + surface.workspace.id + (this.elementUrl.startsWith('/') ? this.elementUrl : '/' + this.elementUrl)
    }
    async viewOperator(operate: Partial<UserAction>) {
        var ops = JSON.stringify(operate);
        var r = ops.length > 1024 * 1024 ? await surface.workspace.sock.put<{
            seq: number,
            id: string
        }>('/view/operate', {
            elementUrl: this.elementUrl,
            wsId: surface.workspace.id,
            sockId: surface.workspace.tim.id,
            operate: operate,
        }) : await surface.workspace.tim.put('/view/operate', {
            elementUrl: this.elementUrl,
            wsId: surface.workspace.id,
            sockId: surface.workspace.tim.id,
            operate: operate
        })
        if (r.ok) {
            Object.assign(operate, r.data);
            return r.data;
        }
    }
    private localViewSnap: { seq: number, content: string, date: Date, plain: string, text: string, thumb?: ResourceArguments };
    private localTime;
    private viewSnapQueue: QueueHandle;
    async storeLocal(snap: { seq: number, content: string, creater?: string, plain?: string, text?: string, thumb?: ResourceArguments, force?: boolean }) {
        if (typeof this.viewSnapQueue == 'undefined') this.viewSnapQueue = new QueueHandle();
        await this.viewSnapQueue.create(async () => {
            //console.log('snap', snap);
            /**
            * 本地先存起来
            */
            if (window.shyConfig.isPc) {
                await yCache.set(this.localId, {
                    id: this.localId,
                    content: snap.content,
                    seq: snap.seq,
                    creater: snap.creater || surface?.user?.id,
                    createDate: new Date()
                })
            }
            else await new DbService<view_snap>('view_snap').save({ id: this.localId }, {
                id: this.localId,
                content: snap.content,
                seq: snap.seq,
                creater: snap.creater || surface?.user?.id,
                createDate: new Date()
            });
        })
        this.localViewSnap = {
            seq: snap.seq,
            content: snap.content,
            date: new Date(),
            plain: (snap.plain || ''),
            text: snap.text,
            thumb: snap.thumb
        };
    }
    async viewSnap(snap: { seq: number, content: string, creater?: string, plain?: string, text?: string, thumb?: ResourceArguments, force?: boolean }) {
        await this.storeLocal(snap);
        this.operateCount += 1;
        if (this.localTime) clearTimeout(this.localTime);
        if (snap.force) this.saveToService()
        else if (this.lastServiceViewSnap && (this.operateCount > MAX_OPERATE_COUNT || this.lastServiceViewSnap.date.getTime() - Date.now() > DELAY_TIME))
            this.saveToService();
        else this.localTime = setTimeout(() => {
            this.saveToService();
        }, DELAY_TIME);
    }
    private lastServiceViewSnap: { seq: number, date: Date };
    private operateCount = 0;
    private async saveToService() {
        this.emit('willSave');
        try {
            if (this.localTime) { clearTimeout(this.localTime); this.localTime = undefined; }
            if (this.localViewSnap) {
                if (this.lastServiceViewSnap && this.lastServiceViewSnap.seq >= this.localViewSnap.seq) return;
                var tryLocker = await surface.workspace.sock.get<{ lock: boolean, lockSockId: string }>('/view/snap/lock', {
                    elementUrl: this.elementUrl,
                    wsId: surface.workspace.id,
                    sockId: surface.workspace.tim.id,
                    seq: this.localViewSnap.seq
                });
                if (tryLocker.ok && tryLocker.data.lock == true) {
                    console.log('save', this.localViewSnap);
                    var r = await surface.workspace.sock.put('/view/snap', {
                        elementUrl: this.elementUrl,
                        wsId: surface.workspace.id,
                        sockId: surface.workspace.tim.id,
                        seq: this.localViewSnap.seq,
                        content: this.localViewSnap.content,
                        plain: this.localViewSnap.plain,
                        thumb: this.localViewSnap.thumb,
                        pageText: this.localViewSnap.text
                    })
                    if (r.ok) {
                        this.emit('saveSuccessful');
                        if (typeof this.lastServiceViewSnap == 'undefined') {
                            this.lastServiceViewSnap = {} as any;
                        }
                        this.lastServiceViewSnap.seq = this.localViewSnap.seq;
                        this.lastServiceViewSnap.date = new Date();
                        this.operateCount = 0;
                    }
                }
            }
        }
        catch (ex) {
            console.error(ex);
            log.error(ex);
        }
        finally {
            this.emit('saved');
        }
    }
    async forceSave() {
        await this.saveToService();
    }
    async querySnap(readonly?: boolean) {
        var seq: number;
        var local: view_snap;
        if (window.shyConfig.isPc) local = await yCache.get(this.localId);
        else local = await new DbService<view_snap>('view_snap').findOne({ id: this.localId });
        if (local) seq = local.seq;
        //console.log('query seq', seq);

        var r = await surface.workspace.sock.get<{
            localExisting: boolean,
            file: IconArguments,
            operates: any[],
            content: string
        }>('/view/snap/query', {
            elementUrl: this.elementUrl,
            wsId: surface.workspace.id,
            seq,
            readonly: readonly ? true : false
        });
        if (r.ok) {
            if (r.data.localExisting == true) return { content: local?.content ? JSON.parse(local?.content) : {} };
            return { operates: r.data.operates as ViewOperate[] || [], content: r.data.content ? JSON.parse(r.data.content) : {} }
        }
    }
    async rollupSnap(snapId: string) {
        var r = await surface.workspace.sock.get<{ content: string, seq: number }>('/view/snap/content', {
            id: snapId
        });
        if (r.ok) {
            await this.storeLocal(r.data);
            this.operateCount = 0;
            if (this.localTime) clearTimeout(this.localTime);
            if (typeof this.lastServiceViewSnap == 'undefined') {
                this.lastServiceViewSnap = {} as any;
            }
            this.lastServiceViewSnap.seq = r.data.seq;
            this.lastServiceViewSnap.date = new Date();
            return { content: r.data.content ? JSON.parse(r.data.content) : undefined }
        }
    }
    static create(type: ElementType, parentId: string, id?: string) {
        var elementUrl = getElementUrl(type, parentId, id);
        var ss = snapSyncMaps.get(elementUrl);
        if (ss) return ss;
        else {
            ss = new SnapStore(elementUrl);
            snapSyncMaps.set(elementUrl, ss);
            return ss;
        }
    }
    static createSnap(elementUrl: string) {
        var ss = snapSyncMaps.get(elementUrl);
        if (ss) return ss;
        else {
            ss = new SnapStore(elementUrl);
            snapSyncMaps.set(elementUrl, ss);
            return ss;
        }
    }
}

export interface SnapStore {
    only(name: 'saved', fn: () => void);
    only(name: 'willSave', fn: () => void);
    only(name: 'saveSuccessful', fn: () => void);
    emit(name: 'saveSuccessful');
    emit(name: 'saved');
    emit(name: 'willSave');
}