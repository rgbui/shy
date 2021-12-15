
import { IconArguments } from "rich/extensions/icon/declare";
import { PageItem } from "../sln/item";
import "./style.less";
import { useOpenUserSettings } from "../user/settings";
import { currentParams } from "../../history";
import { CacheKey, yCache } from "../../../../net/cache";
import { Mime } from "../sln/declare";
import { workspaceService } from "../../../../services/workspace";
import { ShyUtil } from "../../../util";
import { util } from "rich/util/util";
import { Sock } from "../../../../net/sock";
import { SockType } from "../../../../net/sock/type";
import { useOpenWorkspaceSettings } from "./settings";
import lodash from "lodash";
import { makeObservable, observable } from "mobx";

export type WorkspaceUser = {
    userid: string;
    role: string;
    nick: string;
}
export class Workspace {
    id: string = null;
    date: number = null;
    sn: number = null;
    text: string = null;
    icon: IconArguments = null;
    childs: PageItem[] = [];
    customizeSecondDomain: string = null;
    customizeDomain: string = null;
    slogan: string = null;
    users: WorkspaceUser[] = [];
    pidUrl: string = null;
    constructor() {
        makeObservable(this, {
            id: observable,
            date: observable,
            sn: observable,
            text: observable,
            icon: observable,
            childs: observable,
            customizeDomain: observable,
            customizeSecondDomain: observable,
            slogan: observable,
            users: observable,
            pidUrl: observable
        })
    }
    private _sock: Sock;
    get sock() {
        if (this._sock) return this._sock;
        return this._sock = new Sock(SockType.workspace, this.pidUrl);
    }
    public invite: string;
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
    findAll(predict: (item: PageItem) => boolean) {
        return this.childs.arrayJsonFindAll('childs', predict)
    }
    getVisibleIds() {
        var ids: string[] = [];
        this.childs.each(c => {
            ids.addRange(c.getVisibleIds())
        })
        return ids;
    }
    async onOpenWorkspaceSettings(event: React.MouseEvent) {
        await useOpenWorkspaceSettings();
    }
    async onOpenUserSettings(event: React.MouseEvent) {
        await useOpenUserSettings();
    }
    async onUpdateInfo(data: Partial<Workspace>) {
        await workspaceService.updateWorkspace(this.id, data);
        lodash.assign(this, data);
    }
    async getDefaultPage() {
        var pageId = currentParams('/page/:id')?.id;
        if (!pageId) {
            var pid = await yCache.get(yCache.resolve(CacheKey[CacheKey.ws_open_page_id], this.id));
            if (!pid) {
                var pt = this.find(g => g.mime == Mime.page);
                if (pt) return pt;
            }
            var ft = this.find(g => g.id == pid);
            if (ft) return ft;
            else return this.find(g => g.mime == Mime.page);
        }
        else {
            var item = this.find(g => g.id == pageId || g.sn == pageId);
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
        var ids = await yCache.get(yCache.resolve(CacheKey[CacheKey.ws_toggle_pages], this.id));
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