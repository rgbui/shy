
import { IconArguments } from "rich/extensions/icon/declare";
import { PageItem } from "../sln/item";
import "./style.less";
import { useOpenUserSettings } from "../user/settings";
import { ShyUrl, UrlRoute } from "../../history";
import { CacheKey, sCache, yCache } from "../../../net/cache";
import { Mime } from "../sln/declare";
import { ShyUtil } from "../../util";
import { util } from "rich/util/util";
import { Sock } from "../../../net/sock";
import { useOpenWorkspaceSettings } from "./settings";
import { computed, makeObservable, observable } from "mobx";
import { config } from "../../../common/config";
import { channel } from "rich/net/channel";
import { surface } from "../store";
import { AtomPermission, getCommonPerssions } from "rich/src/page/permission";
import { ElementType, parseElementUrl } from "rich/net/element.type";
import { UserAction } from "rich/src/history/action";
import { CopyText } from "rich/component/copy";
import { ShyAlert } from "rich/component/lib/alert";
import { PageViewStores } from "../supervisor/view/store";
import { TableSchema } from "rich/blocks/data-grid/schema/meta";
import { pageItemStore } from "../sln/item/store/sync";
import { PageLayoutType } from "rich/src/page/declare";
import { SockType } from "../../../net/sock/type";
import { Pid, PidType } from "./declare";
import { CreateTim, Tim } from "../../../net/primus/tim";
import { workspaceNotifys } from "../../../services/tim";
import { HttpMethod } from "../../../net/primus/http";

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

export type WorkspaceMember = {
    id: string;
    createDate: number;
    creater: string;
    userid: string;
    /**
     * 当前空间内用户的呢称
     */
    name: string;
    /**
     * 当前用户的角色
     */
    roleIds: string[];
    workspaceId: string;
    avatar: IconArguments;
    cover: IconArguments;
    totalScore: number;
}

export type LinkWorkspaceOnline = {
    overlayDate: Date,
    randomOnlineUsers: Set<string>,
    loadingOnlineUsers: boolean,
    unreadChats: { id: string, roomId: string, seq: number }[]
} & Partial<Workspace>


export class Workspace {
    public id: string = null;
    public sn: number = null;
    public createDate: Date = null;
    public creater: string = null;
    public owner: string = null;

    public pids: Pid[] = [];
    /**
     * 
     * 数据存储服务号
     * 
     */
    public dataServiceNumber: string;
    // public dataServicePids: Pid[];
    // public timServicePids: Pid[];
    /**
     * 数据存储空间访问时进入的区块链编号
     */
    public chainBlockId: string = '';
    /**
     * 大文件存储服务商ID
     */
    // public fileServiceNumber: string
    // public fileServicePids: Pid[];
    /**
     * 服务搜索服务商ID
     */
    // public searchServiceNumber: string
    // public searchServicePids: Pid[];

    public text: string = null;
    public icon: IconArguments = null;
    public cover: IconArguments = null;
    public config: object = null;
    public slogan: string = null;
    public siteDomain: string = null;
    public siteDomainDuration: Date = null;
    public customSiteDomain: string = null;
    public customSiteDomainProtocol: string = null;
    public invite: string = null;
    public memberCount: number = null;
    public memberOnlineCount: number = null;
    public childs: PageItem[] = [];
    /***
     * 页面的一些其它的pageItem,如blog文档，该文档脱离正常的pages，其parentId='blog'
     */
    public otherChilds: PageItem[] = [];
    public allMemeberPermissions: AtomPermission[] = getCommonPerssions();
    public roles: WorkspaceRole[] = [];
    public member: WorkspaceMember = null;
    public slnStyle: 'menu' | 'note' = 'note';
    public allowSlnIcon: boolean = false;

    public access: number = 0;
    public accessProfile: {
        disabledJoin: boolean,
        checkJoinProtocol: boolean,
        joinProtocol: string
    } = {
            disabledJoin: false,
            checkJoinProtocol: false,
            joinProtocol: ''
        }
    /**
     * 创建文档时的初始配置
     */
    public createPageConfig: {
        isFullWidth: boolean,
        smallFont: boolean,
        nav: boolean,
        autoRefPages: boolean,
        autoRefSubPages: boolean
    } = {
            isFullWidth: true,
            smallFont: false,
            nav: false,
            autoRefPages: false,
            autoRefSubPages: true
        };
    /**
     * 空间的初始默认页面
     */
    public defaultPageId: string = null;
    public viewOnlineUsers: Map<string, { users: Set<string>, load: boolean }> = new Map();
    public onLineUsers: Set<string> = new Set();
    constructor() {
        makeObservable(this, {
            id: observable,
            sn: observable,
            text: observable,
            icon: observable,
            cover: observable,
            childs: observable,
            otherChilds: observable,
            siteDomain: observable,
            customSiteDomain: observable,
            slogan: observable,
            memberCount: observable,
            memberOnlineCount: observable,
            config: observable,
            owner: observable,
            roles: observable,
            accessProfile: observable,
            allMemeberPermissions: observable,
            member: observable,
            createPageConfig: observable,
            defaultPageId: observable,
            viewOnlineUsers: observable,
            onLineUsers: observable,
            invite: observable,
            slnStyle: observable,
            isOwner: computed,
            isMember: computed
        })
    }
    private _sock: Sock;
    get sock() {
        if (this._sock) return this._sock;
        return this._sock = new Sock(SockType.none, Workspace.getWsSockUrl(this.pids, 'ws'), {
            'shy-sockId': this.tim.id,
            'shy-wsId': this.id
        });
    }
    private _filesock: Sock;
    get fileSock() {
        if (this._filesock) return this._filesock;
        return this._filesock = new Sock(SockType.none, Workspace.getWsSockUrl(this.pids, 'file'), {
            'shy-sockId': this.tim.id,
            'shy-wsId': this.id
        });
    }
    get url() {
        if (config.isPro || config.isPc) {
            if (this.customSiteDomain) return this.customSiteDomain;
            var host = this.siteDomain || this.sn;
            return `https://${host}.shy.live`
        }
        else return 'http://' + location.host + "/ws/" + this.sn + "";
    }
    get isJoinTip() {
        return !this.member && surface.user.isSign && this.access == 1
    }
    get isOwner() {
        return surface.user.id == this.owner ? true : false;
    }
    isAllow(...permissions: AtomPermission[]) {

        return true;
    }
    get isMember() {
        if (this.member) return true;
        else return false;
    }
    /**
     * 获取当前成员在这个空间的权限
     */
    // get memberPermissions() {
    //     var ps: AtomPermission[] = [];
    //     if (surface.user?.id == this.owner) {
    //         return getEditPerssions()
    //     }
    //     if (this.member) {
    //         if (this.member.roleIds.length > 0) {
    //             ps = [];
    //             this.member.roleIds.forEach(rid => {
    //                 var role = this.roles.find(g => g.id == rid);
    //                 if (role && Array.isArray(role.permissions)) {
    //                     role.permissions.forEach(p => {
    //                         if (!ps.includes(p)) ps.push(p)
    //                     })
    //                 }
    //             });
    //             return ps;
    //         }
    //     }
    //     ps = this.allMemeberPermissions?.length > 0 ? this.allMemeberPermissions : getCommonPerssions();
    //     if (!ps) ps = [];
    //     return ps;
    // }
    // isAllow(permission: AtomPermission) {
    //     return (this.memberPermissions || []).includes(permission);
    // }
    // get isCanEdit() {
    //     return this.isAllow(AtomPermission.createOrDeleteDoc) || false;
    // }
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
        var pageId = UrlRoute.match(ShyUrl.wsPage)?.pageId;
        if (!pageId) pageId = UrlRoute.match(ShyUrl.page)?.pageId;
        if (!pageId) {
            var pid = await yCache.get(CacheKey.ws_open_page_id);
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
    async onLoadRoles(roles?: WorkspaceRole[]) {
        if (roles) this.roles = roles;
        else {
            var rs = await channel.get('/ws/roles');
            if (rs.ok) {
                this.roles = rs.data.list;
            }
            else this.roles = [];
        }
    }
    async onLoadPages() {
        var ids = await yCache.get(yCache.resolve(CacheKey[CacheKey.ws_toggle_pages], this.id));
        var rr = await channel.get('/page/items', { ids, sock: this.sock, wsId: this.id });
        if (rr) {
            if (Array.isArray(rr?.data?.list)) {
                var pages = rr.data.list;
                pages.sort(this.pageSort)
                pages = ShyUtil.flatArrayConvertTree(pages);
                this.load({ childs: pages });
            }
        }
    }
    /**
     * 获取加载页面，没有挂在侧栏的一些页面
     * 例如：文档blog
     * @param id 
     * @param pageItemInfo 
     * @returns 
     */
    async loadOtherPage(id: string, pageItemInfo?: Partial<PageItem>) {
        if (id) {
            var pageItem = surface.workspace.otherChilds.find(c => c.id == id);
            if (!pageItem) {
                var g = await channel.get('/page/item', { id });
                if (g) {
                    pageItem = new PageItem();
                    pageItem.load(g.data.item);
                    surface.workspace.otherChilds.push(pageItem);
                    return pageItem;
                }
            }
            else return pageItem;
        }
        var pageItem = new PageItem();
        if (id) pageItem.id = id;
        else pageItem.id = config.guid();
        if (pageItemInfo) Object.assign(pageItem, pageItemInfo)
        var data = pageItem.getItem();
        if (pageItemInfo) Object.assign(data, pageItemInfo)
        delete data.sn;
        var r = await channel.put('/page/item/create', { wsId: surface.workspace.id, data });
        if (r.ok) {
            pageItem.load(r.data.item);
            surface.workspace.otherChilds.push(pageItem);
            return pageItem;
        }
    }
    pageSort = (x, y) => {
        if (x.at > y.at) return 1;
        else if (x.at == y.at) return 0;
        else return -1;
    }
    async loadMember(member: WorkspaceMember) {
        this.member = member;
    }
    async onNotifyViewOperater(data: UserAction) {
        var ec = parseElementUrl(data.elementUrl);
        if (ec.type == ElementType.PageItem) {
            var item = surface.workspace.find(g => g.id == ec.id);
            if (item) {
                var pv = PageViewStores.getPageViewStore(item.elementUrl);
                if (pv?.page) {
                    pv?.page.syncUserActions([data], surface.supervisor.isShowElementUrl(item.elementUrl) ? 'notifyView' : 'notify')
                }
            }
        }
    }
    get pages() {
        return this.pages.map(pa => pa.get());
    }
    async onCreateInvite(isCopy?: boolean, force?: boolean) {
        if (force == true || !this.invite) {
            var r = await channel.put('/ws/invite/create');
            if (r.ok) {
                surface.workspace.invite = r.data.code;
            }
        }
        if (isCopy) {
            CopyText(this.getInviteUrl());
            ShyAlert('邀请链接已复制');
        }
    }
    getInviteUrl() {
        if (!this.invite) return '';
        var url = `https://${this.siteDomain || this.sn}.shy.live/`
        if (this.customSiteDomain) {
            url = `${this.customSiteDomainProtocol || 'https'}://${this.customSiteDomain}/`
        }
        if (config.isDev || config.isBeta) {
            url = location.protocol + '//' + location.host + "/"
        }
        return url + 'invite/' + this.invite;
    }
    async loadViewOnlineUsers(viewId: string) {
        var rs = this.viewOnlineUsers.get(viewId);
        if (!rs) {
            var r = await channel.get('/ws/view/online/users', { viewId });
            this.viewOnlineUsers.set(viewId, { load: true, users: new Set(r.data.users) });
        }
        else {
            if (rs.load == false) {
                var r = await channel.get('/ws/view/online/users', { viewId });
                if (r.ok) {
                    r.data.users.forEach(u => {
                        rs.users.add(u);
                    })
                    rs.load = true;
                }
            }
        }
    }
    async onLoadElementUrl(elementUrl: string) {
        var pe = parseElementUrl(elementUrl);
        if ([ElementType.PageItem, ElementType.Room, ElementType.Schema].includes(pe.type)) {
            var id = pe.id;
            var item = this.find(g => g.id == id);
            if (!item) {
                var pa = await channel.get('/page/parent/ids', { id });
                if (pa.ok) {
                    if (pa.data.exists == false && pe.type == ElementType.Schema) {
                        var viewItem = this.find(g => g.mime == Mime.pages);
                        if (viewItem) {
                            var sch = await TableSchema.loadTableSchema(id);
                            if (sch) {
                                item = await pageItemStore.appendPageItem(viewItem, {
                                    id: sch.id,
                                    text: sch.text,
                                    mime: Mime.table,
                                    pageType: PageLayoutType.db,
                                    spread: false,
                                });
                                return item;
                            }
                        }
                    }
                    else if (pa.data.exists == true) {
                        pa.data.parentIds.removeAll(c => this.find(g => g.id == c && g.checkedHasChilds == true) ? true : false);
                        if (pa.data.parentIds.length > 0) {
                            var rlist = await channel.get('/page/parent/subs', { parentIds: pa.data.parentIds });
                            if (rlist.ok) {
                                var list = rlist.data.list;
                                list.sort(this.pageSort);
                                list = ShyUtil.flatArrayConvertTree(list);
                                var look = list.lookup(g => g.parentId);
                                look.forEach((v, k) => {
                                    var item = this.find(c => c.id == k);
                                    if (item) {
                                        item.load(v);
                                        item.checkedHasChilds = true;
                                        item.each(c => { c.checkedHasChilds = true })
                                    }
                                })
                            }
                        }
                        item = this.find(g => g.id == id);
                        return item;
                    }
                    else {
                        /**
                         * 404
                         */
                    }
                }
            }
            return item;
        }
    }
    async createTim() {
        this.tim = await CreateTim(this.dataServiceNumber || 'shy', Workspace.getWsSockUrl(this.pids, 'tim'));
        workspaceNotifys(this.tim);
        var self = this;
        this.tim.only('reconnected_workspace', async () => {
            var data = await self.getTimHeads();
            data.sockId = self.tim.id;
            data.workspaceId = self.id;
            data.userid = surface.user.id;
            if (self.currentPageId) data.viewId = self.currentPageId;
            await self.tim.syncSend(HttpMethod.post, '/user/reconnected_workspace', data);
        })
        await this.enterWorkspace();
    }
    tim: Tim
    static getWsSockUrl(pids: Pid[], type: PidType) {
        return pids.filter(g => g.types.includes(type)).randomOf()?.url;
    }
    static getWsSock(pids: Pid[], type: PidType) {
        return Sock.createSock(this.getWsSockUrl(pids, type))
    }
    currentPageId: string;
    async enterPage(pageId: string) {
        var data = await this.getTimHeads();
        data.sockId = this.tim.id;
        data.workspaceId = this.id;
        data.viewId = pageId;
        data.userid = surface.user.id;
        this.currentPageId = pageId;
        await this.tim.syncSend(HttpMethod.post, '/workspace/enter', data);
    }
    async enterWorkspace() {
        var data = await this.getTimHeads();
        data.sockId = this.tim.id;
        data.workspaceId = this.id;
        data.userid = surface.user.id;
        if (this.currentPageId) data.viewId = this.currentPageId;
        await this.tim.syncSend(HttpMethod.post, '/workspace/enter', data);
    }
    async exitWorkspace() {
        var data = await this.getTimHeads();
        data.sockId = this.tim.id;
        data.workspaceId = this.id;
        if (this.currentPageId) data.viewId = this.currentPageId;
        await this.tim.syncSend(HttpMethod.post, '/workspace/leave', data);
    }
    async getTimHeads() {
        var device = await sCache.get(CacheKey.device);
        var token = await sCache.get(CacheKey.token);
        var lang = await sCache.get(CacheKey.lang);
        return {
            device,
            token,
            lang
        } as any
    }
}