import { UserAction } from "rich/src/history/action";

export class PageStore {
    constructor(public ws: string, public pageId: string) { }
    /**
     *  本地保存，同时推送至service，然后返回timingSequence
     * @param userAction 
     */
    async saveHistory(userAction: UserAction) {

    }
    /**
     * 保存页面内容，需要保存至服务器，然后返顺一个timingSequence,
     * 数据内容存为zip文件
     * @param force 
     */
    async savePage(force?: boolean) {

    }
}