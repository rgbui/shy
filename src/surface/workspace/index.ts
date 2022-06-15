
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
import { computed, makeObservable, observable } from "mobx";
import { config } from "../../common/config";
import { channel } from "rich/net/channel";
import { surface } from "..";
import { AtomPermission, getAllAtomPermission, getCommonPerssions } from "rich/src/page/permission";
import { ElementType, parseElementUrl } from "rich/net/element.type";
import { UserAction } from "rich/src/history/action";
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

export type WorkspaceOnLineUser = {
    userid: string;
    deviceId?: string;
    sockId?: string;
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
    public permissions: number[] = getCommonPerssions();
    public roles: WorkspaceRole[] = [];
    public member: WorkspaceMember = null;
    /**
     * 在线的成员
     */
    public onlineUsers: Map<string, WorkspaceOnLineUser[]> = new Map();
    public access: number = 0;
    public accessJoinTip: boolean = false;
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
            roles: observable,
            onlineUsers: observable,
            isJoinTip: computed,
            permissions: observable,
            member: observable,
            memberPermissions: computed,
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
        if (config.isPro) return `https://${this.host}.shy.live`
        else return 'http://' + location.host + "/ws/" + this.sn + "";
    }
    get isJoinTip() {
        return !this.member && surface.user.isSign && this.access == 1
    }
    /**
     * 获取当前成员在这个空间的权限
     */
    get memberPermissions() {
        var ps: AtomPermission[] = [];
        if (surface.user?.id == this.owner) {
            return getAllAtomPermission()
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
        ps = this.permissions?.length > 0 ? this.permissions : getCommonPerssions();
        if (!ps) ps = [];
        return ps;
    }
    isAllow(permission: AtomPermission) {
        return (this.memberPermissions || []).includes(permission);
    }
    get isCanEdit() {
        return this.isAllow(AtomPermission.createOrDeleteDoc) || false;
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
    async loadRoles(roles?: WorkspaceRole[]) {
        if (roles) this.roles = roles;
        else {
            var rs = await channel.get('/ws/roles');
            if (rs.ok) {
                this.roles = rs.data.list;
            }
            else this.roles = [];
        }
    }
    async loadPages() {
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
    pageSort = (x, y) => {
        if (x.at > y.at) return 1;
        else if (x.at == y.at) return 0;
        else return -1;
    }
    async loadMember(member: WorkspaceMember) {
        this.member = member;
    }
    async loadViewOnlines(viewId: string) {
        var ov = this.onlineUsers.get(viewId);
        if (!ov) {
            ov = [];
            var r = await channel.get('/ws/view/online/users', { viewId });
            if (r.ok) ov = r.data.users.map(u => ({ userid: u })) || [];
            this.onlineUsers.set(viewId, ov);
        }
        return ov;
    }
    async addViewLine(viewId: string, user: WorkspaceOnLineUser) {
        var s = this.onlineUsers.get(viewId);
        if (!s) {
            this.onlineUsers.set(viewId, [{ userid: user.userid }]);
        }
        else {
            if (!s.some(g => g.userid == user.userid)) {
                s.push({ userid: user.userid });
            }
        }
    }
    async removeViewLine(user: WorkspaceOnLineUser, viewId?: string) {
        if (typeof viewId == 'string') {
            var s = this.onlineUsers.get(viewId);
            if (s) {
                s.removeAll(g => g.userid == user.userid);
            }
        }
        else {
            this.onlineUsers.forEach((vs, m) => {
                if (vs.some(v => v.userid == user.userid)) {
                    vs.remove(g => g.userid == user.userid);
                }
            })
        }
    }
    async onNotifyViewOperater(data: UserAction) {
        var ec = parseElementUrl(data.elementUrl);
        if (ec.type == ElementType.PageItem) {
            var item = surface.workspace.find(g => g.id == ec.id);
            if (item?.contentView) {
                item?.contentView.loadUserActions([data], ec.id == surface.supervisor.item.id ? 'notifyView' : 'notify');
            }
        }
    }
    get pages() {
        return this.pages.map(pa => pa.get());
    }
}