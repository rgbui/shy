
import { IconArguments } from "rich/extensions/icon/declare";
import { PageItem } from "../sln/item";

import { ShyUrl, UrlRoute } from "../../history";
import { CacheKey, sCache, yCache } from "../../../net/cache";
import { Mime } from "../sln/declare";
import { ShyUtil } from "../../util";
import { util } from "rich/util/util";
import { Sock } from "../../../net/sock";
import { computed, makeObservable, observable } from "mobx";
import { channel } from "rich/net/channel";
import { surface } from "../app/store";
import { AtomPermission, getCommonPerssions, getEditOwnPerssions } from "rich/src/page/permission";
import { ElementType, parseElementUrl } from "rich/net/element.type";
import { CopyText } from "rich/component/copy";
import { ShyAlert } from "rich/component/lib/alert";

import { TableSchema } from "rich/blocks/data-grid/schema/meta";
import { pageItemStore } from "../sln/item/store/sync";
import { PageLayoutType, WorkspaceNavMenuItem } from "rich/src/page/declare";
import { SockType } from "../../../net/sock/type";
import { Pid, PidType } from "./declare";
import { CreateTim, Tim, getWsTim } from "../../../net/primus/tim";
import { workspaceNotifys } from "../../../services/tim";
import { buildPage } from "rich/src/page/common/create";
import { getPageItemElementUrl } from "../sln/item/util";
import { useTemplateView } from "rich/extensions/template";
import { useTrashBox } from "rich/extensions/trash";
import { RobotInfo, WorkspaceMember, WorkspaceRole } from "rich/types/user";
import { lst } from "rich/i18n/store";
import { isMobileOnly } from "react-device-detect";
import { SettingsSvg, FolderPlusSvg, UploadSvg, MemberSvg, AddUserSvg, LogoutSvg } from "rich/component/svgs";
import { useForm } from "rich/component/view/form/dialoug";
import { useSelectMenuItem } from "rich/component/view/menu";
import { MenuItem, MenuItemType } from "rich/component/view/menu/declare";
import { useOpenReport } from "rich/extensions/report";
import { WsConsumeType, getAiDefaultModel } from "rich/net/ai/cost";

import { PopoverPosition } from "rich/component/popover/position";
import { useLazyOpenWorkspaceSettings } from "./settings/lazy";
import { useOpenUserSettings } from "../user/settings/lazy";
import { useImportFile } from "rich/extensions/Import-export/import-file/lazy";
import { usePublishSite } from "./settings/publish/site";
import { config } from "../../../common/config";
import lodash from "lodash";

export class Workspace {
    public id: string = null;
    public sn: number = null;
    public createDate: Date = null;
    public creater: string = null;
    public owner: string = null;

    /**
     * 空间存储的源存在那里
     * private-clound: 私有云
     * public-clound: 公有云
     * private-local: 本地存储
     */
    public datasource: 'private-clound' | 'public-clound' | 'private-local' = 'public-clound';

    public pids: Pid[] = [];
    /**
     * 
     * 数据存储服务号
     * 
     */
    public dataServiceNumber: string;
    /**
     * 数据存储空间访问时进入的区块链编号
     */
    public chainBlockId: string = '';

    public text: string = null;
    public icon: IconArguments = null;
    public cover: IconArguments = null;
    public config: object = null;
    public slogan: string = null;
    public siteDomain: string = null;
    public siteDomainDuration: Date = null;
    public customSiteDomain: string = null;
    public customSiteDomainProtocol: boolean = null;
    public customSiteDomainData: { type?: 'self-build' | 'trust', publicKey?: string, privateKey?: string, sslDate?: Date } = {
        type: 'self-build',
        publicKey: '',
        privateKey: '',
        sslDate: null
    };
    public invite: string = null;
    public memberCount: number = null;
    public memberOnlineCount: number = null;
    public childs: PageItem[] = [];
    public allMemeberPermissions: AtomPermission[] = getCommonPerssions();
    public roles: WorkspaceRole[] = [];
    public member: WorkspaceMember = null;
    public allowSlnIcon: boolean = true;

    public stats: {
        totalFileSize?: number;
        totalDoc?: number;
        totalDocCard?: number;
        totalChannel?: number;
        totalBoard?: number;
        totalTable?: number;
        totalRowCount?: number;
        totalBookmark?: number;
        totalComment?: number;
        totalViewSnap?: number;
        totalViewBrowse?: number;
        totalTag?: number;
    }
    get accessWorkspace() {
        return surface.accessWorkspace;
    }
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

    public aiConfig: {
        text?: WsConsumeType,
        image?: WsConsumeType,
        embedding?: WsConsumeType,
        disabled?: boolean,
        aiSearch?: boolean,
        esSearch?: boolean,
        seoSearch?: boolean,
    } = {
            text: getAiDefaultModel(undefined, 'text'),
            image: getAiDefaultModel(undefined, 'image'),
            embedding: getAiDefaultModel(undefined, 'embedding'),
            disabled: false,
            esSearch: true,
            aiSearch: false,
            seoSearch: false
        }
    /**
     * 空间的初始默认页面
     */
    public defaultPageId: string = null;
    public viewOnlineUsers: Map<string, { users: Set<string>, load: boolean }> = new Map();
    public onLineUsers: Set<string> = new Set();
    public publishConfig: {
        abled: boolean,
        defineNavMenu: boolean,
        allowSearch: boolean,
        navMenus: WorkspaceNavMenuItem[],
        isFullWidth: boolean,
        smallFont: boolean,
        contentTheme: 'wiki' | 'web',
        defineBottom: boolean
    } = {
            abled: false,
            defineNavMenu: false,
            navMenus: [],
            isFullWidth: true,
            smallFont: true,
            contentTheme: 'wiki',
            defineBottom: false,
            allowSearch: false
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
            slnSpread: computed,
            isOwner: computed,
            isMember: computed,
            publishConfig: observable,
            isPubSite: computed,
            isPubSiteDefineBarMenu: computed,
            isPubSiteHideMenu: computed,
            _isApp: observable,
            isApp: computed
        })
    }
    get slnSpread() {
        return surface.slnSpread;
    }
    private _sock: Sock;
    get sock() {
        if (this._sock) return this._sock;
        return this._sock = new Sock(SockType.workspace, Workspace.getWsSockUrl(this.pids, 'ws'), {
            'shy-sockId': this.tim?.id,
            'shy-wsId': this.id
        });
    }
    private _filesock: Sock;
    get fileSock() {
        if (this._filesock) return this._filesock;
        return this._filesock = new Sock(SockType.workspace, Workspace.getWsSockUrl(this.pids, 'ws'), {
            'shy-sockId': this.tim.id,
            'shy-wsId': this.id
        });
    }
    get url() {
        if (window.shyConfig.isPro || window.shyConfig.isDesk) {
            if (this.customSiteDomain) {
                return (this.customSiteDomainProtocol ? "https://" : "http") + this.customSiteDomain;
            }
            var host = this.siteDomain || this.sn;
            return `https://${host}.` + UrlRoute.getHost()
        }
        else return 'http://' + location.host + "/ws/" + this.sn + "";
    }
    isWsUrl(url: string) {
        if (window.shyConfig?.isPro || window.shyConfig.isDesk) {
            if (this.customSiteDomain) {
                return url.startsWith((this.customSiteDomainProtocol ? "https://" : "http") + this.customSiteDomain);
            }
            return url.startsWith(`https://${this.siteDomain}.` + UrlRoute.getHost()) || url.startsWith(`http://${this.sn}.` + UrlRoute.getHost())
        }
        else {
            return url.startsWith(this.url);
        }
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
    get isManager() {
        return this.isOwner || this.isAllow(AtomPermission.wsEdit, AtomPermission.wsMemeberPermissions);
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
        await useLazyOpenWorkspaceSettings();
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
        var rc = await yCache.get(yCache.resolve(CacheKey[CacheKey.workspaceMode], this.id));
        if (typeof rc == 'boolean') {
            if (this.isOwner || this.isManager)
                this._isApp = rc;
        }
    }
    pageSort = (x, y) => {
        if (x.at > y.at) return 1;
        else if (x.at == y.at) return 0;
        else return -1;
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
        var url = `https://${this.siteDomain || this.sn}.${UrlRoute.getHost()}/`
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
        this.sock.setHeaders({
            'shy-sockId': this.tim.id,
        })
        this.fileSock.setHeaders({
            'shy-sockId': this.tim.id
        })
        if (this.tim?.id !== surface.user?.tim?.id) {
            this.tim.only('reconnected_workspace', async () => {
                await self.tim.post('/sync', await self.getTimSyncData());
            })
        }
    }
    tim: Tim
    static getWsSockUrl(pids: Pid[], type: PidType) {
        return pids.filter(g => g.types.includes(type)).randomOf()?.url;
    }
    static getWsSock(pids: Pid[], type: PidType, wsId: string) {
        var tim = getWsTim(wsId);
        var h = {};
        if (tim) h['shy-sockId'] = tim.id;
        else {
            if (config.isPro) {
                if (pids.some(p => p.url.endsWith('.shy.live') || p.url.endsWith('.shy.red'))) {
                    h['shy-sockId'] = surface.user.tim?.id;
                }
                else {

                }
            }
            else h['shy-sockId'] = surface.user.tim?.id;
        }
        return Sock.createSock(this.getWsSockUrl(pids, type), SockType.workspace, {
            'shy-wsId': wsId,
            ...h
        });

    }
    enterWorkspace = lodash.debounce(async () => {
        if (!surface.user.isSign) return;
        await this.tim.post('/sync', await this.getTimSyncData());
    }, 1200)

    async exitWorkspace() {
        if (!surface.user.isSign) return;
        var data = await this.getTimSyncData();
        data.sockId = this.tim.id;
        delete data.wsId;
        delete data.viewUrl;
        await this.tim.post('/sync', data);
    }
    async getTimSyncData() {
        var device = await sCache.get(CacheKey.device);
        var token = await sCache.get(CacheKey.token);
        var lang = await sCache.get(CacheKey.lang);
        var data = {
            device,
            token,
            lang
        } as any;
        data.sockId = this.tim.id;
        data.wsId = this.id;
        data.userid = surface.user.id;
        if (surface.supervisor?.page) {
            data.viewUrl = surface.supervisor.page.elementUrl
        }
        return data;
    }
    async onImportFiles() {
        var r = await useImportFile();
        if (r) {
            var pageItem = surface.workspace.childs.last();
            var npa = await buildPage(r.blocks, { isTitle: true }, surface.workspace);
            var rc = await channel.put('/import/page/data', {
                text: r.text,
                pageData: await npa.getString(),
                parentId: pageItem.id,
                plain: await npa.getPlain(),
                mime: Mime.page,
                wsId: surface.workspace.id
            });
            if (rc) {
                await pageItem.onSync(true);
                channel.act('/page/open', { elementUrl: getPageItemElementUrl(rc.data.item) })
            }
        }
    }
    async onOpenTemplate(e: React.MouseEvent) {
        var ut = await useTemplateView();
        if (ut) {
            /**
            * 自动创建空间
            */
            var pageItem = surface.workspace.childs.last()
            var rr = await channel.post('/import/page', {
                text: ut.text,
                templateUrl: ut.file?.url,
                wsId: surface.workspace.id,
                parentId: pageItem.id
            });
            if (rr.ok) {
                await pageItem.onSync(true)
                console.log('rd', rr.data);
                channel.act('/page/open', { elementUrl: getPageItemElementUrl(rr.data.item) })
            }
        }
    }
    async onOpenTrash(e: React.MouseEvent) {
        var item = surface.workspace.childs.last();
        var rg = await useTrashBox({
            ws: surface.workspace,
            parentId: item.id
        });
        if (rg) {
            await item.onSync(true);
        }
    }
    robots: RobotInfo[];
    async loadWsRobots(robotIds: string[]) {
        if (robotIds.length > 0) {
            var rs = await channel.get('/robots/info', { ids: robotIds });
            if (rs.ok) {
                this.robots = rs.data.list;
                this.robots.forEach(robot => {
                    if (robot.abledCommandModel !== true)
                        robot.tasks = [
                            {
                                id: util.guid(),
                                name: lst("问题"),
                                args: [
                                    {
                                        id: util.guid(),
                                        text: lst("问题"),
                                        name: 'ask',
                                        type: 'string'
                                    }
                                ]
                            }
                        ]
                })
            }
        }
        else this.robots = [];
    }
    async getWsRobots(force?: boolean) {
        try {
            if (Array.isArray(this.robots) && force !== true) return this.robots;
            var gs = await channel.get('/ws/robots');
            if (gs.ok) {
                if (gs.data.list.length > 0) {
                    var rs = await channel.get('/robots/info', { ids: gs.data.list.map(g => g.userid) });
                    if (rs.ok) {
                        this.robots = rs.data.list;
                        this.robots.forEach(robot => {
                            if (robot.abledCommandModel !== true)
                                robot.tasks = [
                                    {
                                        id: util.guid(),
                                        name: lst("问题"),
                                        args: [
                                            {
                                                id: util.guid(),
                                                text: lst("问题"),
                                                name: 'ask',
                                                type: 'string'
                                            }
                                        ]
                                    }
                                ]
                        })
                    }
                }
                else this.robots = [];
            }
        }
        catch (ex) {
            console.error(ex);
        }
        finally {
            return this.robots || [];
        }
    }
    _isApp: boolean = false;
    get isApp() {
        if (this.isManager) {
            return this._isApp;
        }
        else return true;
    }
    async setMode(isApp: boolean) {
        this._isApp = isApp;
        await yCache.set(yCache.resolve(CacheKey[CacheKey.workspaceMode], this.id), isApp);
        if (surface.supervisor.page) surface.supervisor.page.view.forceUpdate()
    }
    /**
     * 是否自定义workspace头部菜单
     */
    get isPubSiteDefineBarMenu() {
        return this.isPubSite && this?.publishConfig?.navMenus?.length > 0 && this?.publishConfig?.defineNavMenu
    }
    /**
     * 是否隐藏默认的导航菜单
     */
    get isPubSiteHideMenu() {
        return this.isPubSite && this?.publishConfig?.contentTheme == 'web'
    }
    /**
     * 空间是否处于应用模式
     */
    get isPubSite() {
        if (this.publishConfig?.abled === true) {
            if (!this.isOwner && !this.isManager) {
                return true;
            }
            else {
                return this._isApp;
            }
        }
        return false;
    }
    async openMenu(pos: PopoverPosition, width: number = 200) {
        if (!this.isMember) return;
        if (isMobileOnly) return;
        var menus: MenuItem<string>[] = [];
        if (this.isManager) {
            menus = [
                { name: 'setting', icon: SettingsSvg, text: lst('空间设置') },
                { type: MenuItemType.divide },
                { name: 'enterApp', text: lst('发布应用'), icon: { name: 'byte', code: 'application-one' } },
                {
                    text: lst('应用模式'),
                    icon: { name: 'byte', code: 'intermediate-mode' },
                    visible: surface.workspace.publishConfig?.abled,
                    childs: [
                        {
                            name: 'editApp',
                            text: lst('编辑'),
                            icon: { name: 'byte', code: 'write' },
                            checkLabel: surface.workspace.isApp ? false : true
                        },
                        {
                            name: 'operateApp', text: lst('运营'),
                            icon: { name: 'byte', code: 'zijinyunying' },
                            checkLabel: surface.workspace.isApp ? true : false
                        }
                    ]
                },
                { type: MenuItemType.divide },
                { name: 'createFolder', icon: FolderPlusSvg, text: lst('创建栏目') },
                { name: 'importFiles', icon: UploadSvg, text: lst('导入文件') },
                { type: MenuItemType.divide },
                { name: 'userPay', icon: { name: 'bytedance-icon', code: 'flash-payment' }, text: lst('付费升级') },
                { name: 'wsUsers', icon: MemberSvg, text: lst('空间成员') },
                { type: MenuItemType.divide },
                { name: 'invite', text: lst('邀请ta人'), icon: AddUserSvg }
            ]
            if (!this.isOwner) {
                menus.push(...[
                    { type: MenuItemType.divide },
                    { name: 'exit', text: lst('退出空间'), icon: LogoutSvg }
                ])
            }
            else {
                menus.push(...[
                    { type: MenuItemType.divide },
                    { name: 'report', text: lst('举报'), icon: { name: 'bytedance-icon', code: 'harm' } as any }
                ])
            }
        }
        else {
            menus = [
                { name: 'userSetting', icon: SettingsSvg, text: lst('个人设置') },
                { type: MenuItemType.divide },
                { name: 'userPay', icon: { name: 'bytedance-icon', code: 'flash-payment' }, text: lst('付费升级') },
                { name: 'invite', text: lst('邀请ta人'), icon: AddUserSvg },
                // { name: 'edit', text: '编辑个人空间资料', icon: EditSvg },
                { type: MenuItemType.divide },
                { name: 'report', text: lst('举报'), icon: { name: 'bytedance-icon', code: 'harm' } },
                { name: 'exit', text: lst('退出空间'), icon: LogoutSvg }
            ]
        }
        var se = await useSelectMenuItem(
            pos,
            menus,
            {
                width: width
            }
        );
        if (se) {
            if (se.item.name == 'exit') {
                surface.exitWorkspace();
            }
            else if (se.item.name == 'invite') {
                this.onCreateInvite(true);
            }
            else if (se.item.name == 'userSetting') {
                useOpenUserSettings()
            }
            else if (se.item.name == 'userPay') {
                useOpenUserSettings('price')
            }
            else if (se.item.name == 'wsUsers') {
                useLazyOpenWorkspaceSettings('members')
            }
            else if (se.item.name == 'importFiles') {
                this.onImportFiles();
            }
            else if (se.item.name == 'edit') {

            }
            else if (se.item.name == 'setting') {
                useLazyOpenWorkspaceSettings();
            }
            else if (se.item.name == 'createFolder') {
                var r = await useForm({
                    title: lst('创建分栏'),
                    fields: [{ name: 'text', text: lst('分栏名称'), type: 'input' }],
                    async checkModel(model) {
                        if (!model.text) return lst('分栏名称不能为空')
                        if (model.text.length > 30) return lst('分栏名称过长')
                        return '';
                    }
                });
                if (r?.text) {
                    surface.sln.onCreateFolder(r.text)
                }
            }
            else if (se.item.name == 'report') {
                await useOpenReport({
                    workspaceId: this.id,
                    userid: surface?.user?.id,
                    reportContent: lst('举报空间'),
                })
            }
            else if (se.item.name == 'enterApp') {
                if (this.publishConfig?.abled !== true) {
                    await useLazyOpenWorkspaceSettings('publish');
                    return;
                }
                else {
                    await usePublishSite(surface.workspace.publishConfig)
                }
            }
            else if (se.item.name == 'editApp') {
                await this.setMode(false);
            }
            else if (se.item.name == 'operateApp') {
                await this.setMode(true);
            }
        }
    }

}