
import { IconArguments, ResourceArguments } from "rich/extensions/icon/declare";
import { ElementType, getElementUrl } from "rich/net/element.type";
import { UserAction, ViewOperate } from "rich/src/history/action";
import { Events } from "rich/util/events";
import { yCache } from "../../net/cache";
import { view_snap } from "../../net/db";
import { DbService } from "../../net/db/service";
import { log } from "../../common/log";
import { surface } from "../../src/surface/app/store";
import { MergeSock } from "rich/component/lib/merge.sock";
const DELAY_TIME = 1000 * 60 * 3;
const MAX_OPERATE_COUNT = 100;
var snapSyncMaps: Map<string, SnapStore> = new Map();

export type SnapDataType = {
    seq?: number,
    creater?: string,
    content: string,
    date?: Date,
    plain?: string,
    text?: string,
    thumb?: ResourceArguments[]
}


export class SnapStore extends Events {
    elementUrl: string;
    private constructor(elementUrl: string) {
        super();
        this.elementUrl = elementUrl;
    }
    get localId() {
        return '/' + surface.workspace.id + (this.elementUrl.startsWith('/') ? this.elementUrl : '/' + this.elementUrl)
    }
    /**
     * 50ms内的请求合并为一次请求
     * 尝试将多个操作合并成一个请求，然后快照只保存一次
     */
    batchViewOperators = new MergeSock(async (batchs) => {
        var rs = await this.viewOperator(batchs.map(c => c.args[0]));
       if (!Array.isArray(rs)) {
            if (rs) rs = [rs]
            else rs = [];
        }
        var lb = batchs.last();
        if (lb) {
            var snap = lb.args[1];
            snap.seq = rs[0].seq;
          
            if (!batchs.every(c => c.args[2] && c.args[2]?.notSave == true))
                this.viewSnap(snap)
        }
        return (rs as any[]).map(c => {
            return {
                id: c.id,
                data: c
            }
        })
    }, 50)
    async viewOperatorAndSnap(operate: Partial<UserAction>, snap: SnapDataType, options?: { force?: boolean, notSave?: boolean }) {
        if (options.force) {
            var rc = await this.viewOperator(operate);
          
            if (rc) {
                var rg = Array.isArray(rc) ? rc[0] : rc;
                snap.seq = rg.seq;
                if (options?.notSave !== true)
                    await this.viewSnap(snap, { force: true });
            }
        }
        else {
            await this.batchViewOperators.get(operate.id, [operate, snap, options]);
        }
    }
    async viewOperator(operate: Partial<UserAction> | (Partial<UserAction>[])) {
        if (Array.isArray(operate) && operate.length == 1) operate = operate[0];
        var ops = JSON.stringify(operate);
        var r = ops.length > 1024 * 200 ? await surface.workspace.sock.put<{
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
          
            if (Array.isArray(r.data.operates) && Array.isArray(operate)) {
                r.data.operates.forEach(d => {
                    var op = (operate as UserAction[]).find(o => o.id == d.id);
                    if (op) {
                        for (let n in d) op[n] = d[n];
                    }
                });
                return operate;
            }
            else {
                var op = Array.isArray(operate) ? operate[0] : operate;
                for (let n in r.data) op[n] = r.data[n];
                return op;
            }
        }
    }
    private localViewSnap: SnapDataType;
    private localTimer;
    private async storeLocal() {
        //  console.log('local store...');
        /**
              * 本地先存起来
              */
        if (window.shyConfig.isDesk) {
            await yCache.set(this.localId, {
                id: this.localId,
                content: this.localViewSnap.content,
                seq: this.localViewSnap.seq,
                creater: this.localViewSnap.creater || surface?.user?.id,
                createDate: new Date()
            })
        }
        else await new DbService<view_snap>('view_snap').save({ id: this.localId }, {
            id: this.localId,
            content: this.localViewSnap.content,
            seq: this.localViewSnap.seq,
            creater: this.localViewSnap.creater,
            createDate: new Date()
        });
    }
    /**
     * 本地请求，如果数据量比较大，请求频次比较高，容易卡死
     * 浏览器容易崩溃
     * 本地的快照，将时间频率降低至1秒一次
     * @param snap 
     * @param options 
     */
    private async lazyStoreLocal(snap: SnapDataType, options?: { force?: boolean }) {
        if (this.localTimer) clearTimeout(this.localTimer);
        this.localViewSnap = {
            seq: snap.seq,
            content: snap.content,
            date: new Date(),
            plain: (snap.plain || ''),
            text: snap.text,
            thumb: snap.thumb,
            creater: snap.creater || surface?.user?.id,
        };
        if (options?.force) await this.storeLocal();
        else this.localTimer = setTimeout(() => {
            this.storeLocal();
        }, 1000 * 1);
    }
    async viewSnap(snap: SnapDataType, options?: { force?: boolean }) {
        await this.lazyStoreLocal(snap);
        this.operateCount += 1;
        if (this.serviceStoreTime) clearTimeout(this.serviceStoreTime);
        if (options?.force) this.saveToService()
        else if (this.lastServiceViewSnap && (this.operateCount > MAX_OPERATE_COUNT || this.lastServiceViewSnap.date.getTime() - Date.now() > DELAY_TIME))
            this.saveToService();
        else this.serviceStoreTime = setTimeout(() => {
            this.saveToService();
        }, DELAY_TIME);
    }
    private serviceStoreTime;
    private lastServiceViewSnap: { seq: number, date: Date };
    private operateCount = 0;
    private async saveToService() {
        this.emit('willSave');
        try {
            if (this.serviceStoreTime) { clearTimeout(this.serviceStoreTime); this.serviceStoreTime = undefined; }
            if (this.localViewSnap) {
                if (this.lastServiceViewSnap && this.lastServiceViewSnap.seq >= this.localViewSnap.seq) return;
                var tryLocker = await surface.workspace.sock.get<{ lock: boolean, lockSockId: string }>('/view/snap/lock', {
                    elementUrl: this.elementUrl,
                    wsId: surface.workspace.id,
                    sockId: surface.workspace.tim.id,
                    seq: this.localViewSnap.seq
                });
                if (tryLocker.ok && tryLocker.data.lock == true) {
                    window.shyLog('save', this.localViewSnap);
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
        if (window.shyConfig.isDesk) local = await yCache.get(this.localId);
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
            seq,
            readonly: readonly ? true : false
        });
        if (r.ok) {
            if (r.data.localExisting == true) {
                return { content: local?.content ? JSON.parse(local?.content) : {} };
            }
            return { operates: r.data.operates as ViewOperate[] || [], content: r.data.content ? JSON.parse(r.data.content) : {} }
        }
    }
    async rollupSnap(snapId: string) {
        var r = await surface.workspace.sock.get<{ content: string, seq: number }>('/view/snap/content', {
            id: snapId
        });
        if (r.ok) {
            await this.lazyStoreLocal(r.data as any, { force: true });
            this.operateCount = 0;
            if (this.serviceStoreTime) clearTimeout(this.serviceStoreTime);
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