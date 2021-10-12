import { UserAction } from "rich/src/history/action";
import { sockSync } from "../net/primus";
import { PageItem } from "../src/view/sln/item";
import JSZip from 'jszip';
import { db, page_local_sequence, page_snapshoot } from "../net/db";
import { util } from "rich/util/util";
import { ActionDirective } from "rich/src/history/declare";
import { log } from "../src/common/log";
import { DbService } from "../net/db/service";
import { surface } from "../src/view/surface";
import { messageChannel } from "rich/util/bus/event.bus";
import { Directive } from "rich/util/bus/directive";
import { userSock } from "../net/sock";
import { XhrReadFileBlob } from "../src/util/file";
export class PageStore {
    constructor(private item: PageItem) { }
    /**
     *  本地保存，同时推送至service，然后返回timingSequence
     * @param userAction 
     */
    async saveHistory(userAction: UserAction) {
        var directive = typeof userAction.directive == 'number' ? ActionDirective[userAction.directive] : ActionDirective;
        try {
            var r = await sockSync.post<{ sequence: number, id: string }, string>('/page/useraction', {
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
    async savePageContent(userAction: UserAction, fn: () => Promise<any>) {
        var data = await fn();
        var zip = new JSZip();
        zip.file("page.shy", JSON.stringify(data));
        var zipFile = await zip.generateAsync({
            type: 'blob',
            compression: "DEFLATE" // <-- here 
        });
        if (this.localPageSnapshootId) {
            await new DbService<page_snapshoot>('page_snapshoot').update({ id: this.localPageSnapshootId }, {
                content: zipFile,
                endSequence: userAction.sequence
            });
            await new DbService<page_local_sequence>('page_local_sequence').save({
                item_url: this.item_url
            }, { userActionSequence: userAction.sequence }, {
                id: util.guid(),
                item_url: this.item_url,
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
                item_url: this.item_url,
                content: zipFile,
                beginSequence: userAction.sequence,
                endSequence: userAction.sequence
            });
            await new DbService<page_local_sequence>('page_local_sequence').save({
                item_url: this.item_url,
            }, {
                userActionSequence: userAction.sequence,
                page_snapshoot_id: this.localPageSnapshootId
            }, {
                id: util.guid(),
                item_url: this.item_url,
                creater: surface.user?.id || null,
                createDate: Date.now()
            });
        }
        this.userActionTriggerCount += 1;
        if (this.userActionTriggerCount > 2) {
            await this.storePageContent();
        }
    }
    private isStorePageContent: boolean = false;
    private async storePageContent() {
        if (this.isStorePageContent) return;
        this.isStorePageContent = true;
        var ps = await new DbService<page_snapshoot>('page_snapshoot').getOne(this.localPageSnapshootId);
        var r = await messageChannel.fireAsync(Directive.UploadFile, ps.content, (event) => { });
        if (r.ok) {
            var userResult = await userSock.post<{ sequence: number, id: string }, string>('/page/snapshoot', {
                wsId: this.item.workspaceId,
                pageId: this.item.id,
                file: r.data,
                beginSequence: ps.beginSequence,
                endSequence: ps.endSequence
            });
            if (userResult.data.sequence) {
                await new DbService<page_snapshoot>('page_snapshoot').update({ id: this.localPageSnapshootId }, { sequence: userResult.data.sequence })
                await new DbService<page_local_sequence>('page_local_sequence').save(
                    {
                        item_url: this.item_url,
                    },
                    { pageSnapshootSequence: userResult.data.sequence },
                    {
                        id: util.guid(),
                        item_url: this.item_url,
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
    async getPageContent(): Promise<{ content?: Record<string, any>, actions?: UserAction[] }> {
        var local = await new DbService<page_local_sequence>('page_local_sequence').findOne({ item_url: this.item_url, });
        if (local?.page_snapshoot_id) this.localPageSnapshootId = local.page_snapshoot_id;
        var r = await userSock.get<{ snapshoot: { file: { url: string } }, actions: UserAction[] }>('/page/content', {
            wsId: this.item.workspaceId,
            pageId: this.item.id,
            userActionSequence: local?.userActionSequence,
            pageSnapshootSequence: local?.pageSnapshootSequence
        });
        if (r.ok && r.data) {
            if (r.data.snapshoot) {
                console.log(r.data.snapshoot);
                try {
                    var contentBlob = await XhrReadFileBlob(r.data.snapshoot.file.url);
                    var zip = new JSZip();
                    var rj = await zip.loadAsync(contentBlob);
                    var str = await rj.file('page.shy').async("string");
                    return { actions: r.data.actions, content: JSON.parse(str) };
                }
                catch (ex) {
                    console.log(ex);
                }
                //需要读取网络上面的文档url

            }
            else {
                if (Array.isArray(r.data.actions) && r.data.actions.length > 0) {
                    //说明没有snapshoot,只记录了page
                    return { actions: r.data.actions };
                }
                else {
                    if (local) {
                        var d = await (db as any).page_snapshoot.where({ id: local?.page_snapshoot_id }).first();
                        if (d) {
                            var zip = new JSZip();
                            var rj = await zip.loadAsync(d.content);
                            var str = await rj.file('page.shy').async("string");
                            return { content: JSON.parse(str) };
                        }
                        else {
                            delete this.localPageSnapshootId;
                            return {}
                        }
                    }
                    else return {}
                }
            }
        }
        else window.Toast.error('网络错误');

    }
    get item_url() {
        return this.item.workspaceId + "." + this.item.id;
    }
}