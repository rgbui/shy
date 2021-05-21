import { Workspace } from "../core/workspace/workspace";
import { data, defaultPageData } from "./data";
const DATASTORE_PAGE_KEY = 'sy.page.';

export class DataStore {
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
    static async getWorkspace(url: string) {
        var pageId = 'kankankan';
        var ws = new Workspace();
        ws.load({
            id: 'workspacetest',
            profile_photo: 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2Fd84aa9f4-1aaf-4547-8273-ba1129f7b675%2F109951163041428408.jpg?table=space&id=37659cc5-3ed0-4375-9a9d-ce77379a49ff&width=40&userId=3c8f21e7-4d95-4ff1-a44b-3a82c3a8098e&cache=v2',
            title: '我的空间',
            modules: [
                {
                    name: 'pages',
                    text: '我的页面',
                    items: [
                        { id: pageId, text: '测试页面', mime: 1 },
                        { id: 'kankanTes', text: '测试页面', mime: 1 },
                        { id: 'kankanTe', text: '测试页面', mime: 1 }
                    ]
                }
            ]
        })
        return ws;
    }
}