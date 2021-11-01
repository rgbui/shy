
import { IconArguments } from "rich/extensions/icon/declare";
import { PageItem } from "../sln/item";
import "./style.less";
import { useOpenUserSettings } from "../user/settings";
import { currentParams } from "../../history";
import { CacheKey, yCache } from "../../../../net/cache";
import { Mime } from "../sln/declare";
import { workspaceTogglePages, workspaceService } from "../../../../services/workspace";
import { ShyUtil } from "../../../util";
import { util } from "rich/util/util";



export type WorkspaceUser = {
    userid: string;
    role: string;
    nick: string;
}
export class Workspace {
    id: string;
    date: number;
    sn: number;
    text: string;
    icon: IconArguments;
    childs: PageItem[] = [];
    customizeSecondDomain: string;
    customizeDomain: string;
    slogan: string;
    users: WorkspaceUser[] = [];
    public inviteUrl: string;
    get url() {
        return 'https://' + this.customizeSecondDomain + '.shy.live';
    }
    load(data) {
        for (var n in data) {
            if (n == 'childs') {
                data[n].each(it => {
                    var pt = new PageItem();
                    pt.load(it);
                    this.childs.push(pt);
                })
            }
            else {
                this[n] = data[n];
            }
        }
        if (typeof this.id == 'undefined') this.id = util.guid();
        if (typeof this.date == undefined) this.date = Date.now();
    }
    find(predict: (item: PageItem) => boolean) {
        return this.childs.arrayJsonFind('childs', predict)
    }
    getVisibleIds() {
        var ids: string[] = [];
        this.childs.each(c => {
            ids.addRange(c.getVisibleIds())
        })
        return ids;
    }
    async onOpenWorkspaceSettings(event: React.MouseEvent) {
        await useOpenUserSettings();
    }
    async onUpdateInfo(data: Partial<Workspace>) {

    }
    async getDefaultPage() {
        var pageId = currentParams('/page/:id')?.id;
        if (!pageId) {
            var pid = await yCache.get(yCache.resolve(CacheKey.workspace_open_page_id,this.id));
            if (!pid) {
                var pt = this.find(g => g.mime == Mime.page);
                if (pt) return pt;
            }
            return this.find(g => g.id == pid);
        }
        else {
            var item = this.find(g => g.id == pageId);
            if (item) {
                return item;
            }
            else {
                var pt = this.find(g => g.mime == Mime.page);
                if (pt) return pt;
            }
        }
    }
    async loadPages() {
        var ids = await workspaceTogglePages.getIds(this.id);
        var rr = await workspaceService.loadWorkspaceItems(this.id, ids);
        if (rr) {
            if (Array.isArray(rr?.data?.pages)) {
                var pages = rr.data.pages;
                pages = ShyUtil.flatArrayConvertTree(pages);
                this.load({ childs: pages });
            }
        }
    }
}