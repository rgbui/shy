
import { IconArguments, ResourceArguments } from "rich/extensions/icon/declare";
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
import { channel } from "rich/net/channel";
import { surface } from "../store";
import { AtomPermission, getCommonPerssions, getEditOwnPerssions } from "rich/src/page/permission";
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

export type WorkspaceNavMenuItem = {
    id: string,
    date?: number,
    userid?: string,
    text: string,
    type: 'logo' | 'text' | 'link',
    pic?: ResourceArguments,
    icon?: IconArguments,
    childs?: WorkspaceNavMenuItem[],
    urlType?: 'page' | 'url',
    url?: string,
    pageId?: string,
    pageText?: string,
    spread?: boolean
}


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
    public allMemeberPermissions: AtomPermission[] = getCommonPerssions();
    public roles: WorkspaceRole[] = [];
    public member: WorkspaceMember = null;
    public slnStyle: 'menu' | 'note' = 'note';
    public allowSlnIcon: boolean = false;

    /**
     * 0:不公开 
     * 1:公开
     */
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

    public publishConfig: {
        abled: boolean,
        defineNavMenu: boolean,
        navMenus: WorkspaceNavMenuItem[],
        defineContent: boolean,
        contentTheme: 'default' | 'none' | 'wiki',
        defineBottom:boolean
    } = {
            abled: false,
            defineNavMenu: false,
            navMenus: [],
            defineContent: false,
            contentTheme: 'default',
            defineBottom:false
        }
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
            isMember: computed,
            publishConfig: observable
        })
    }
    private _sock: Sock;
    get sock() {
        if (this._sock) return this._sock;
        return this._sock = new Sock(SockType.none, Workspace.getWsSockUrl(this.pids, 'ws'), {
            'shy-sockId': this.tim?.id,
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
        if (window.shyConfig.isPro || window.shyConfig.isPc) {
            if (this.customSiteDomain) {
                return (this.customSiteDomainProtocol ? "https://" : "http") + this.customSiteDomain;
            }
            var host = this.siteDomain || this.sn;
            return `https://${host}.shy.live`
        }
        else return 'http://' + location.host + "/ws/" + this.sn + "";
    }
    resolve(url: string | { pageId?: string | number, elementUrl?: string }) {
        if (typeof url == 'string')
            return this.url + (url.startsWith('/') ? url : '/' + url)
        else if (url?.pageId)
            return this.url + '/page/' + url.pageId;
        else if (url.elementUrl)
            return this.url + '/r?url=' + encodeURIComponent(url.elementUrl);
    }
    get isJoinTip() {
        return !this.member && surface.user.isSign && this.access == 1
    }
    get isOwner() {
        var ow = this.owner ? this.owner : this.creater;
        return surface.user?.id == ow ? true : false;
    }
    isAllow(...permissions: AtomPermission[]) {
        if (this.isOwner) return true;
        return this.memberPermissions.some(s => permissions.includes(s))
    }
    get isMember() {
        if (this.member) return true;
        else return false;
    }
    /**
     * 获取当前成员在这个空间的权限
     */
    get memberPermissions() {
        var ps: AtomPermission[] = [];
        if (surface.user?.id == this.owner) {
            return getEditOwnPerssions()
        }
        if (this.member) {
            if (this.member.roleIds.length > 0) {
                ps = [];
                this.member.roleIds.forEach(rid => {
                    var role = this.roles.find(g => g.id == rid);
                    if (role && Array.isArray(role.permissions)) {
                        role.permissions.forEach(p => {
                            if (!ps.includes(p)) ps.push(p)
                        })
                    }
                });
                return ps;
            }
        }
        ps = this.allMemeberPermissions?.length > 0 ? this.allMemeberPermissions : getCommonPerssions();
        if (!ps) ps = [];
        return ps;
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
        var rr = await channel.get('/page/items', { ids, wsId: this.id, sock: this.sock, ws: undefined });
        if (rr) {
            if (Array.isArray(rr?.data?.list)) {
                var pages = rr.data.list;
                pages.sort(this.pageSort)
                pages = ShyUtil.flatArrayConvertTree(pages);
                this.load({ childs: pages });
            }
        }
    }
    pageSort = (x, y) => {
        if (x.at > y.at) return 1;
        else if (x.at == y.at) return 0;
        else return -1;
    }
    async onNotifyViewOperater(data: UserAction) {
        var pv = PageViewStores.getPageViewStore(data.elementUrl);
        if (pv?.page) {
            pv?.page.onSyncUserActions([data], surface.supervisor.isShowElementUrl(data.elementUrl) ? 'notifyView' : 'notify')
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
        if (window.shyConfig.isDev || window.shyConfig.isBeta) {
            url = location.protocol + '//' + location.host + "/"
        }
        return url + 'invite/' + this.invite;
    }
    async loadViewOnlineUsers(viewUrl: string) {
        var rs = this.viewOnlineUsers.get(viewUrl);
        if (!rs) {
            var r = await channel.get('/ws/view/online/users', { viewUrl });
            var ns = new Set<string>();
            r.data.users.forEach(u => {
                ns.add(u);
            })
            this.viewOnlineUsers.set(viewUrl, { load: true, users: ns });
        }
        else {
            if (rs.load == false) {
                var r = await channel.get('/ws/view/online/users', { viewUrl });
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
                var pa = await channel.get('/page/parent/ids', { id, ws: undefined });
                if (pa.ok) {
                    if (pa.data.exists == false && pe.type == ElementType.Schema) {
                        var viewItem = this.find(g => g.mime == Mime.pages);
                        if (viewItem) {
                            var sch = await TableSchema.loadTableSchema(id, undefined);
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
                            var rlist = await channel.get('/page/parent/subs', { parentIds: pa.data.parentIds, ws: surface.workspace });
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
            if (this.tim === surface.user.tim) return;
            var data = await self.getTimHeads();
            data.sockId = self.tim.id;
            data.wsId = self.id;
            data.userid = surface.user.id;
            if (surface.supervisor?.page) {
                data.viewUrl = surface.supervisor.page.elementUrl
            }
            await self.tim.syncSend(HttpMethod.post, '/sync', data);
        })
    }
    tim: Tim
    static getWsSockUrl(pids: Pid[], type: PidType) {
        return pids.filter(g => g.types.includes(type)).randomOf()?.url;
    }
    static getWsSock(pids: Pid[], type: PidType) {
        return Sock.createSock(this.getWsSockUrl(pids, type))
    }
    async enterWorkspace() {
        if (!surface.user.isSign) return;
        var data = await this.getTimHeads();
        data.sockId = this.tim.id;
        data.wsId = this.id;
        data.userid = surface.user.id;
        if (surface.supervisor?.page) {
            data.viewUrl = surface.supervisor.page.elementUrl
        }
        await this.tim.syncSend(HttpMethod.post, '/sync', data);
    }
    async exitWorkspace() {
        if (!surface.user.isSign) return;
        var data = await this.getTimHeads();
        data.sockId = this.tim.id;
        await this.tim.syncSend(HttpMethod.post, '/sync', data);
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