import { defaultPageData } from "./data";

/***
 * 视图页面数据存储
 */
const DATASTORE_PAGE_KEY = 'sy.page.';
export class PageViewStore {
    private static cachePageDatas: Map<string, Record<string, any>> = new Map();
    static async getPageData(pageId: string) {
        var cp = this.cachePageDatas.get(pageId);
        if (cp) {
            return cp;
        }
        else {
            var data = localStorage.getItem(DATASTORE_PAGE_KEY + pageId);
            if (typeof data == 'string') return JSON.parse(data);
            /**
             * search page data 
             */
            if (pageId == 'kankankan') cp = data;
            else cp = await this.getDefaultPageData();
            await this.savePageData(pageId, cp);
            return cp;
        }
    }
    static async savePageData(pageId: string, data: Record<string, any>) {
        this.cachePageDatas.set(pageId, data);
        localStorage.setItem(DATASTORE_PAGE_KEY + pageId, JSON.stringify(data));
    }
    static async getDefaultPageData() {
        return defaultPageData;
    }
}