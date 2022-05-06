
import { IconArguments } from "rich/extensions/icon/declare";
import { PageItem } from "../sln/item";
import "./style.less";
import { useOpenUserSettings } from "../user/settings";
import { ShyUrl, UrlRoute } from "../../history";
import { CacheKey, yCache } from "../../../net/cache";
import { Mime } from "../sln/declare";
import { ShyUtil } from "../../util";
import { util } from "rich/util/util";
import { Sock } from "../../../net/sock";
import { useOpenWorkspaceSettings } from "./settings";
import { makeObservable, observable } from "mobx";
import { config } from "../../common/config";
import { channel } from "rich/net/channel";
export type WorkspaceUser = {
    userid: string;
    role: string;
    nick: string;
}

export type WorkspaceRole = {
    id: string,
    text: string,
    color: string,
    permissions: number[],
    icon?: IconArguments
}
export class Workspace {
    public id: string = null;
    public sn: number = null;
    public createDate: Date = null;
    public creater: string = null;
    public owner: string = null;
    public text: string = null;
    public icon: IconArguments = null;
    public cover: IconArguments = null;

    public config: object = null;
    public slogan: string = null;
    public siteDomain: string = null;
    public siteDomainDuration: Date = null;
    public customSiteDomain: string = null;
    public invite: string = null;
    public pid: string = null;
    public pidUrl: string = null;
    public dbId: string = null;
    public memberCount: number = null;
    public memberOnlineCount: number = null;
    public childs: PageItem[] = [];
    public permissions: number[];
    public roles: WorkspaceRole[] = [];
    constructor() {
        makeObservable(this, {
            id: observable,
            sn: observable,
            text: observable,
            icon: observable,
            cover: observable,
            childs: observable,
            siteDomain: observable,
            customSiteDomain: observable,
            slogan: observable,
            pidUrl: observable,
            memberCount: observable,
            memberOnlineCount: observable,
            config: observable,
            owner: observable,
            roles: observable
        })
    }
    private _sock: Sock;
    get sock() {
        if (this._sock) return this._sock;
        return this._sock = Sock.createWorkspaceSock(this);
    }

    get host() {
        return this.siteDomain || this.sn
    }
    get url() {
        if (config.isPro) {
            return `https://${this.host}.shy.live`
        }
        else return '';
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
        await channel.patch('/ws/patch', { data });
        for (let n in data) {
            this[n] = util.clone(data[n]);
        }
    }
    async getDefaultPage() {
        var pageId = UrlRoute.match(config.isPro ? ShyUrl.page : ShyUrl.pageDev)?.pageId;
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
    async loadRoles() {
        var rs = await channel.get('/ws/roles');
        if (rs.ok) {
            this.roles = rs.data.list;
        }
        else  this.roles = [];
    }
    async loadPages() {
        var ids = await yCache.get(yCache.resolve(CacheKey[CacheKey.ws_toggle_pages], this.id));
        var rr = await channel.get('/page/items', { ids });
        if (rr) {
            if (Array.isArray(rr?.data?.list)) {
                var pages = rr.data.list;
                pages = ShyUtil.flatArrayConvertTree(pages);
                this.load({ childs: pages });
            }
        }
    }
}