import { UserAction } from "rich/src/history/action";
import { userTim } from "../net/primus";
import { PageItem } from "../src/surface/sln/item";
import { db, page_current_sequence, page_snapshoot } from "../net/db";
import { util } from "rich/util/util";
import { ActionDirective } from "rich/src/history/declare";
import { log } from "../src/common/log";
import { DbService } from "../net/db/service";
import { surface } from "../src/surface";
import { messageChannel } from "rich/util/bus/event.bus";
import { Directive } from "rich/util/bus/directive";

import { XhrReadFileBlob } from "../src/util/file";

export class PageContentStore {
    constructor(private item: PageItem) { }
    private get sock() {
        return this.item.workspace.sock;
    }
    /**
     *  本地保存，同时推送至service，然后返回timingSequence
     * @param userAction 
     */
    async saveHistory(userAction: UserAction) {
        var directive: string = (typeof userAction.directive == 'number' ? ActionDirective[userAction.directive] : ActionDirective) as any;
        try {
            var r = await userTim.post<{ sequence: number, id: string }, string>('/page/content/operator', {
                wsId: this.item.workspaceId,
                pageId: this.item.id,
                directive: directive,
                operators: userAction.operators
            });
            userAction.id = r.data.id;
            userAction.sequence = r.data.sequence;
        }
        catch (ex) {
            log.error(ex, 'save history to server happend error');
        }
    }
    private localPageSnapshootId: string;
    private userActionTriggerCount = 0;
    async savePageContent(userAction: UserAction, file: Blob) {
        if (this.localPageSnapshootId) {
            await new DbService<page_snapshoot>('page_snapshoot').update({ id: this.localPageSnapshootId }, {
                content: file,
                end_sequence: userAction.sequence
            });
            await new DbService<page_current_sequence>('page_current_sequence').save({
                page_url: this.page_url
            }, { operator_sequence: userAction.sequence }, {
                id: util.guid(),
                page_url: this.page_url,
                creater: surface.user?.id || null,
                createDate: Date.now()
            });
        }
        else {
            this.localPageSnapshootId = util.guid();
            await new DbService<page_snapshoot>('page_snapshoot').insertOne({
                id: this.localPageSnapshootId,
                creater: surface.user?.id,
                createDate: new Date().getTime(),
                page_url: this.page_url,
                content: file,
                begin_sequence: userAction.sequence,
                end_sequence: userAction.sequence
            });
            await new DbService<page_current_sequence>('page_current_sequence').save({
                page_url: this.page_url
            }, {
                operator_sequence: userAction.sequence,
                page_snapshoot_id: this.localPageSnapshootId
            }, {
                id: util.guid(),
                page_url: this.page_url,
                creater: surface.user?.id || null,
                createDate: Date.now()
            });
        }
        this.userActionTriggerCount += 1;
        if (this.userActionTriggerCount > 200) {
            this.storePageContent();
        }
    }
    private isStorePageContent: boolean = false;
    private async storePageContent() {
        if (this.isStorePageContent) return;
        this.isStorePageContent = true;
        var ps = await new DbService<page_snapshoot>('page_snapshoot').getOne(this.localPageSnapshootId);
        var r = await messageChannel.fireAsync(Directive.UploadFile, ps.content, (event) => { });
        if (r.ok) {
            var userResult = await this.sock.post<{ sequence: number, id: string }, string>('/page/snapshoot', {
                wsId: this.item.workspaceId,
                pageId: this.item.id,
                file: r.data,
                begin_sequence: ps.begin_sequence,
                end_sequence: ps.end_sequence
            });
            if (userResult.data.sequence) {
                await new DbService<page_snapshoot>('page_snapshoot').update({ id: this.localPageSnapshootId }, { sequence: userResult.data.sequence })
                await new DbService<page_current_sequence>('page_current_sequence').save(
                    {
                        page_url: this.page_url,
                    },
                    { page_sequence: userResult.data.sequence },
                    {
                        id: util.guid(),
                        page_url: this.page_url,
                        creater: surface.user?.id || null,
                        createDate: Date.now()
                    });
                delete this.localPageSnapshootId;
                this.userActionTriggerCount = 0;
            }
        }
        this.isStorePageContent = false;
    }
    /**
     * 获取文档内容
     */
    async getPageContent(): Promise<{ file?: Blob, actions?: UserAction[] }> {
        var local = await new DbService<page_current_sequence>('page_current_sequence').findOne({ page_url: this.page_url, });
        if (local?.page_snapshoot_id) this.localPageSnapshootId = local.page_snapshoot_id;
        var r = await this.sock.get<{ sync: boolean, snapshoot: { file: { url: string } }, actions: UserAction[] }>('/page/content/sync', {
            wsId: this.item.workspaceId,
            pageId: this.item.id,
            operator_sequence: local?.operator_sequence,
            page_sequence: local?.page_sequence
        });
        if (r.ok && r.data) {
            if (r.data.sync) {
                try {
                    var file;
                    if (r.data.snapshoot) {
                        file = await XhrReadFileBlob(r.data.snapshoot.file.url);
                    }
                    return { actions: r.data.actions || [], file };
                }
                catch (ex) {
                    console.log(ex);
                }
            }
            else {
                if (local) {
                    var d = await (db as any).page_snapshoot.where({ id: local?.page_snapshoot_id }).first();
                    if (d) {
                        return { file: d.content };
                    }
                    else {
                        delete this.localPageSnapshootId;
                        return {}
                    }
                }
                else return {}
            }
        }
        else window.Toast.error('网络错误');
    }
    get page_url() {
        return this.item.workspaceId + "." + this.item.id;
    }
    /**
     * 强制保存
     */
    async forceStorePageContent() {
        if (this.localPageSnapshootId)
            await this.storePageContent();
    }
}

