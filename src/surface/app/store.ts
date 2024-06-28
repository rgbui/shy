
import { User } from "../user/user";
import { Sln } from "../sln";
import { Events } from "rich/util/events";
import { Supervisor } from "../supervisor";
import { ShyUrl, UrlRoute } from "../../history";
import { Workspace } from "../workspace";
import { computed, makeObservable, observable, runInAction } from "mobx";
import { CacheKey, sCache } from "../../../net/cache";
import { channel } from "rich/net/channel";
import { PageItem } from "../sln/item";
import { PageViewStores } from "../supervisor/view/store";
import { config } from "../../../common/config";
import { blockStore } from "rich/extensions/block/store";
import { ls } from "rich/i18n/store";
import { PageTemplateType } from "rich/extensions/template";
import { ElementType, getElementUrl } from "rich/net/element.type";
import { Sock } from "../../../net/sock";
import { ShyDesk } from "../../../type";
import { useCreateWorkspace } from "../workspace/create/box";
import { wss } from "../../../services/workspace";
import { isMobileOnly } from "react-device-detect";
import { KeyboardPlate } from "rich/src/common/keys";
import "./service";
import { IconArguments } from "rich/extensions/icon/declare";
import { GlobalKeyboard } from "./keyboard";
import { getDeskLocalPids } from "./desk";
import { util } from "rich/util/util";
import lodash from "lodash";

export type UserWorkspaceItem = {
    id: string,
    sn: number,
    text: string,
    icon: IconArguments,
    cover: IconArguments,
    overlayDate: Date,
    randomOnlineUsers: Set<string>,
    loadingOnlineUsers: boolean,
    unreadChats: { id: string, roomId: string, seq: number }[],
    datasource?: 'private-cloud' | 'public-cloud' | 'private-local',
    datasourceClientId?: string,
    memberOnlineCount: number,
    memberCount: number,
    folderId: string,
    at: number,
    owner: string,
    creater: string
}

export class Surface extends Events {
    constructor() {
        super();
        makeObservable(this, {
            supervisor: observable,
            user: observable,
            sln: observable,
            workspace: observable,
            temporaryWs: observable,
            wss: observable,
            showJoinTip: computed,
            showSlideBar: computed,
            showSln: computed,
            mobileSlnSpread: observable,
            slnSpread: observable,
            showWorkspace: computed,
            accessPage: observable
        });
    }
    mobileSlnSpread: boolean = null;
    slnSpread: boolean = null;
    supervisor: Supervisor = new Supervisor();
    user: User = new User();
    sln: Sln = new Sln();
    workspace: Workspace = null;
    wss: UserWorkspaceItem[] = [];
    temporaryWs: UserWorkspaceItem = null;
    // wssFolderSpreads: Map<string, boolean> = new Map();
    keyboardPlate = new KeyboardPlate();
    /**
     * 空间的访问方式
     * none: 无权限
     * embed: 基于嵌入的方式访问调用
     */
    accessWorkspace: 'none' | 'embed' = 'none';
    /**
     * 当前页面的访问权限
     * none: 无权限
     * accessWorkspace: 可以访问工作区
     * accessPage: 可以访问页面
     * forbidden: 禁止访问
     */
    accessPage: 'none' | 'forbidden' | 'accessWorkspace' | 'accessPage' = 'none';
    async loadWorkspaceList() {
        if (this.user.isSign) {
            var r = await channel.get('/user/wss');
            if (r?.ok) {
                var list: UserWorkspaceItem[] = r.data.list;
                if (!window.shyConfig.isDesk) {
                    list = list.filter(g => g.datasource != 'private-local')
                }
                else {
                    var rd = await this.shyDesk.readLocalStore();
                    if (rd && rd.clientId)
                        list = list.filter(g => g.datasource != 'private-local' || g.datasource == 'private-local' && (g.datasourceClientId && g.datasourceClientId == rd.clientId || !g.datasourceClientId));
                }
                list = list.sort((x, y) => {
                    if (typeof x.at == 'number' && typeof y.at == 'number' && x?.at < y?.at) return -1;
                    else return 1;
                })
                list.forEach(l => {
                    l.overlayDate = null;
                    l.randomOnlineUsers = new Set();
                    l.loadingOnlineUsers = false;
                    l.unreadChats = [];
                })
                this.wss = list;
                if (this.temporaryWs && this.wss.some(s => s.id == this.temporaryWs.id))
                    this.temporaryWs = null;
            }
        }
    }
    async onLoadWorkspace(name: string, autoLoadPage = true) {
        try {
            if (typeof (name as any) == 'number') name = name.toString();
            if (name) {
                try {
                    var r = await channel.get('/ws/query', { name });
                    if (r?.data.workspace) {
                        var ws = new Workspace();
                        ws.load({ ...r.data.workspace });
                        if (r.data.workspace.datasource == 'private-local') {
                            ws.pids = await getDeskLocalPids();
                            await this.waitRunLocalServer();
                        }
                        else if (Array.isArray(r.data.pids)) {
                            ws.pids = r.data.pids;
                        }
                        wss.setWsPids(ws.id, ws.pids);
                        var willPageId = UrlRoute.isMatch(ShyUrl.root) ? ws.defaultPageId : undefined;
                        if (UrlRoute.isMatch(ShyUrl.page)) willPageId = UrlRoute.match(ShyUrl.page)?.pageId;
                        else if (UrlRoute.isMatch(ShyUrl.wsPage)) willPageId = UrlRoute.match(ShyUrl.wsPage)?.pageId;
                        if (lodash.isNull(willPageId)) willPageId = undefined;
                        var g: any;
                        // if (ws.datasource == 'private-local') {
                        //     var count = 0;
                        //     while (true) {
                        //         count += 1;
                        //         if (count > 100) break;
                        //         try {
                        //             g = await Workspace.getWsSock(ws.pids, 'ws', ws.id).get('/ws/access/info', { wsId: ws.id, pageId: willPageId });
                        //             break;
                        //         }
                        //         catch (ex) {
                        //             await util.delay(50);
                        //         }
                        //     }
                        // }
                        // else {
                        g = await Workspace.getWsSock(ws.pids, 'ws', ws.id).get('/ws/access/info', { wsId: ws.id, pageId: willPageId });
                        // }
                        if (g.data.accessForbidden) {
                            this.accessPage = 'forbidden';
                            return
                        }
                        if (g.data.workspace) {
                            ws.load({ ...g.data.workspace });
                        }
                        if (Array.isArray(g.data.onlineUsers)) g.data.onlineUsers.forEach(u => ws.onLineUsers.add(u))
                        ws.roles = g.data.roles || [];
                        ws.member = g.data.member || null;
                        var robotIds = (g.data.robotIds || []) as string[];
                        var willPageItem = g.data.page as PageItem;
                        if (ws.access == 0
                            &&
                            !ws.member
                            &&
                            willPageItem
                        ) {
                            this.accessPage = 'accessPage';
                            ws.load({ childs: [willPageItem] })
                        }
                        else {
                            this.accessPage = 'accessWorkspace';
                            await ws.onLoadPages();
                        }
                        if (surface.user.isSign) await ws.createTim();
                        await sCache.set(CacheKey.wsHost, ws.sn);
                        runInAction(() => {
                            if (!this.wss.some(s => s.id == ws.id)) this.temporaryWs = ws as any;
                            else this.temporaryWs = null;
                            this.workspace = ws;
                        })
                        if (autoLoadPage) {
                            await this.willOpenPage();
                        }
                        this.workspace.loadWsRobots(robotIds);
                        return;
                    }
                }
                catch (ex) {
                    console.error(ex);
                }
            }
            if (this.workspace) {
                await this.workspace.exitWorkspace()
            }
            this.workspace = null;
            if (window.shyConfig.isDesk) {
                // UrlRoute.push(ShyUrl.signIn);
            }
            else if (window.shyConfig.isPro) {
                if (this.user.isSign) UrlRoute.push(ShyUrl.home)
                else UrlRoute.push(ShyUrl.signIn);
            }
            else if (window.shyConfig.isDev) {
                UrlRoute.push(ShyUrl.home);
            }

        }
        catch (ex) {
            console.error(ex)
        }
    }
    async willOpenPage() {
        if (UrlRoute.isMatch(ShyUrl.wsResource) || UrlRoute.isMatch(ShyUrl.resource)) {
            var ul = new URL(location.href);
            var url = ul.searchParams.get('url');
            channel.act('/page/open', { elementUrl: url })
        }
        else {
            var page = await surface.workspace.getDefaultPage();
            channel.act('/page/open', { item: page });
        }
    }
    async exitWorkspace() {
        await channel.del('/user/exit/ws', { wsId: surface.workspace.id });
        await channel.del('/ws/member/exit', { wsId: surface.workspace.id });
        var list = surface.wss.map(w => w);
        list.remove(g => g.id == surface.workspace.id);
        surface.wss = list;
        var w = surface.wss.first();
        if (w) await this.onLoadWorkspace(w.id);
        else await this.onLoadWorkspace(undefined);
    }
    static async getWsName() {
        var domain: string, sn, wsId;
        sn = UrlRoute.match(ShyUrl.wsPage)?.wsId;
        if (!sn) {
            sn = UrlRoute.match(ShyUrl.ws)?.wsId;
        }
        if (!sn) {
            sn = UrlRoute.match(ShyUrl.wsResource)?.wsId;
        }
        if (!sn && location.host && /[\da-z\-]+\.shy\.live/.test(location.host)) {
            domain = location.host.replace(/\.shy\.live$/g, '');
        }
        if (!sn && location.host && /[\da-z\-]+\.shy\.red/.test(location.host)) {
            domain = location.host.replace(/\.shy\.red$/g, '');
        }
        if (!sn && !domain) {
            domain = location.host as string;
            if (domain == UrlRoute.getHost() || domain.startsWith('localhost:') || domain.startsWith('127.0.0.1')) {
                domain = undefined;
            }
        }
        if (!domain && !sn) {
            wsId = await sCache.get(CacheKey.wsHost);
        }
        return sn || domain || wsId;
    }
    async onChangeWorkspace(workspace: Partial<Workspace>) {
        if (workspace.id != this.workspace?.id) {
            runInAction(() => {
                var od = surface.wss.find(c => c.id == this.workspace?.id);
                if (!od && surface.temporaryWs?.id == this.workspace?.id) od = surface.temporaryWs;
                if (od && od.randomOnlineUsers && od.randomOnlineUsers.has(surface.user.id))
                    od.randomOnlineUsers.delete(surface.user.id);
                if (od) od.memberOnlineCount = (od.memberOnlineCount || 0) - 1;
            })
            await PageViewStores.clearAllPageViewStore()
            await this.onLoadWorkspace(workspace.id);
            runInAction(() => {
                var od = surface.wss.find(c => c.id == workspace.id);
                if (!od && surface.temporaryWs?.id == workspace.id) od = surface.temporaryWs;
                if (od && od.randomOnlineUsers && !od.randomOnlineUsers.has(surface.user.id))
                    od.randomOnlineUsers.add(surface.user.id);
                if (od) od.memberOnlineCount = (od.memberOnlineCount || 0) + 1;
            })
        }
        else if (workspace.id == this.workspace?.id) {
            if (UrlRoute.isMatch(ShyUrl.me) || UrlRoute.isMatch(ShyUrl.discovery)) {
                await this.onLoadWorkspace(workspace.id);
            }
            if (UrlRoute.isMatch(ShyUrl.page) || UrlRoute.isMatch(ShyUrl.wsPage)) {

            }
            else {
                //  UrlRoute.pushToPage(workspace.sn, surface.supervisor.item.sn);
            }
        }
    }
    async onCreateWorkspace() {
        await useCreateWorkspace();
    }
    /**
     * 
     */
    get showJoinTip() {
        if (this.user.isSign) {
            if (!this.showSlideBar) return false;
            return this.temporaryWs && this.temporaryWs.id == surface.workspace.id && surface.workspace?.accessProfile.disabledJoin !== true
        }
        else return false;
    }
    get showSlideBar() {
        if (this.accessWorkspace == 'embed') return false;
        if (this.workspace?.isPubSite) {
            if (config.isDomainWs) return false
        }
        if (!this.user.isSign) return false;
        if (this.workspace) {
            if (!this.workspace.member) {
                if (this.workspace.access == 0) {
                    return false;
                }
            }
        }
        return true;
    }
    onToggleSln() {
        if (isMobileOnly) surface.mobileSlnSpread = true;
        else surface.slnSpread = surface.slnSpread === false ? true : false;
        if (surface.supervisor.page?.page)
            surface.supervisor.page?.page?.view?.pageBar?.forceUpdate();
    }
    get showSln() {
        if (this.accessWorkspace == 'embed') return false;
        if (this.workspace) {
            if (!this.workspace.member) {
                if (this.workspace.access == 0) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    get showWorkspace() {
        return surface.workspace ? true : false;
    }
    async load() {
        await ls.import();
        await surface.user.sign();
        if (surface.user.isSign) {
            await surface.user.createTim()
        }
        else {
            if (window.shyConfig.isDesk) {
                return UrlRoute.push(ShyUrl.signIn);
            }
        }
        GlobalKeyboard()
        await blockStore.import();
        var ul = new URL(location.href);
        var accessWorkspace = ul.searchParams.get('accessWorkspace');
        if (typeof accessWorkspace != 'undefined') {
            surface.accessWorkspace = accessWorkspace as any;
        }
        window.addEventListener('message', event => {
            if (!event.data) return;
            if (!(typeof event.data == 'string' && event.data.startsWith('{'))) return;
            try {
                var json = JSON.parse(event.data);
                if (json.name) {
                    if (json.name == 'openPageByTemplate') {
                        var data: PageTemplateType = json.data;
                        channel.act('/page/open', { elementUrl: getElementUrl(ElementType.PageItem, data.sourcePageId) })
                    }
                }
            }
            catch (ex) {

            }
        })

        if (config.isDesk) {
            this.runLocalServer();
        }
    }
    get shyDesk() {
        return (window as any).ShyDesk as ShyDesk
    }
    async runLocalServer() {
        console.log('checkLocalServer');
        await this.checkLocalServer();
    }
    islocalServerSuccess: boolean = false;
    loadLocalServerFail: boolean = false;
    async checkLocalServer(force?: boolean) {
        try {
            var rd = await this.shyDesk.readLocalStore();
            if (rd?.abled || force == true) {
                var sock = Sock.createSock('http://127.0.0.1:' + (rd?.port || 12800));
                var code = Math.random();
                var r = await sock.get('/ws/check/connect', { code });
                if (r?.ok) {
                    if (r.data.code == code) {
                        this.islocalServerSuccess = true;
                        return true;
                    }
                }
            }
            return false;
        }
        catch (ex) {
            console.error(ex);
            return false;
        }
    }
    async waitRunLocalServer(force?: boolean) {
        var t = 0;
        while (true) {
            if (this.islocalServerSuccess) break;
            else {
                await this.checkLocalServer(force);
                await util.delay(100);
                t += 100;
            }
            if (t > 5000) {
                this.loadLocalServerFail = true;
                break;
            }
        }
        console.log('tim', t);
    }
}
export var surface = new Surface();