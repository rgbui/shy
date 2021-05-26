export declare class PageViewStore {
    private static cachePageDatas;
    static getPageData(pageId: string): Promise<any>;
    static savePageData(pageId: string, da: Record<string, any>): Promise<void>;
    static getDefaultPageData(): Promise<{
        url: string;
        views: {
            url: string;
            blocks: {
                childs: {
                    url: string;
                    blocks: {
                        childs: {
                            url: string;
                            content: string;
                        }[];
                    };
                }[];
            };
        }[];
    }>;
}
