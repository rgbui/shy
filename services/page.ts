import { UserAction } from "rich/src/history/action";
import { sockSync } from "../net/primus";
import { userSock } from "../net/sock";
import { PageItem } from "../src/view/sln/item";
import JSZip from 'jszip';
import { messageChannel } from "rich/util/bus/event.bus";
import { Directive } from "rich/util/bus/directive";
import { sCache } from "../net/cache";
export class PageStore {
    private item: PageItem;
    constructor(item: PageItem) {
        this.item = item;
    }
    /**
     *  本地保存，同时推送至service，然后返回timingSequence
     * @param userAction 
     */
    async saveHistory(userAction: UserAction) {
        var r = sockSync.post<{ sequence: number, id: string }, string>('/page/useaction', {
            wsId: this.item.workspaceId,
            pageId: this.item.id,
            directive: userAction.directive,
            operators: userAction.operators
        });
        Object.assign(userAction, r);
    }
    lastAction: UserAction;
    saveTime: NodeJS.Timeout;
    async savePageContent(userAction: UserAction, fn: () => Promise<any>) {
        if (this.saveTime) {
            clearTimeout(this.saveTime);
            this.saveTime = null;
        }
        this.saveTime = setTimeout(async () => {
            var data = await fn();
            var zip = new JSZip();
            zip.file("page.shy", JSON.stringify(data));
            var zipFile = await zip.generateAsync({ type: 'blob' });
            var r = await messageChannel.fireAsync(Directive.UploadFile, zipFile, (event) => { });
            if (r.ok) {
                if (r.data.url) {
                    r = userSock.post<{ sequence: number, id: string, }, string>('/page/snapshoot', {
                        wsId: this.item.workspaceId,
                        pageId: this.item.id,
                        useActionBegin: this.lastAction ? this.lastAction.sequence : undefined,
                        useActionend: userAction.sequence,
                        content: r.data
                    });
                    this.lastAction = userAction;
                }
            }
        }, 1000 * 60 * 5);
    }
    /**
     * 获取文档内容
     */
    async getPageContent() {
        var r = userSock.get('/page/content', { wsId: this.item.workspaceId, pageId: this.item.id });
        return null;
    }
}