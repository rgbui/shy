
import { User } from "./user/user";
import { Sln } from "./sln";
import { Events } from "rich/util/events";
import { Supervisor } from "./supervisor";
import { ShyUrl, UrlRoute } from "../history";
import { Workspace } from "./workspace";
import { makeObservable, observable } from "mobx";
import { CacheKey, sCache } from "../../net/cache";
import { config } from "../common/config";
import { timService } from "../../net/primus";
import { channel } from "rich/net/channel";
import "./message.center";
import { userChannelStore } from "./user/channel/store";

export class Surface extends Events {
    constructor() {
        super();
        makeObservable(this, {
            isShowSln: observable,
            config: observable,
            supervisor: observable,
            user: observable,
            sln: observable,
            workspace: observable
        });
    }
    supervisor: Supervisor = new Supervisor();
    user: User = new User();
    sln: Sln = new Sln();
    workspace: Workspace = null;
    wss: Partial<Workspace>[] = [];
    isShowSln: boolean = true;
    config: { showSideBar: boolean } = { showSideBar: true };
    async loadUser() {
        var r = await channel.get('/sign')
        if (r.ok) {
            config.updateServiceGuid(r.data.guid);
            Object.assign(this.user, r.data.user);
            await timService.open();
            await this.bindTimServiceCollaboration();
        }
    }
    async bindTimServiceCollaboration() {
        /*用户个人协作*/
        //私信
        timService.tim.on('/user/chat/notify', e => userChannelStore.notifyChat(e));

        /*空间协作*/
        //空间会话
        timService.tim.on('/ws/channel/notify', e => { channel.fire('/ws/channel/notify', e) });
        //页面文档
        timService.tim.on('/ws/view/operate/notify', e => { console.log(e); });
        //页面侧栏
        timService.tim.on('/ws/page/item/operate/notify', e => { });
        //页面数据表格元数据
        timService.tim.on('/ws/datagrid/schema/operate/notify', e => { });
    }
    async loadWorkspaceList() {
        if (this.user.isSign) {
            var r = await channel.get('/user/wss');
            if (r?.ok) {
                this.wss = r.data.list;
            }
        }
    }
    async loadWorkspace(wsId: string, name?: string) {
        var r = await channel.get('/ws/info', { name, wsId });
        if (r.ok) {
            var ws = new Workspace();
            ws.load({ ...r.data.workspace });
            this.workspace = ws;
            await ws.loadRoles();
            await ws.loadPages();
            await timService.enterWorkspace(this.workspace.id);
            await sCache.set(CacheKey.wsHost, config.isPro ? ws.host : ws.sn);
            var page = await ws.getDefaultPage();
            this.sln.onMousedownItem(page);
        }
    }
    async getWsName() {
        var domain, sn, wsId;
        sn = UrlRoute.match(ShyUrl.pageDev)?.wsId;
        if (!sn) {
            sn = UrlRoute.match(ShyUrl.ws)?.wsId;
        }
        if (sn && location.host && /[\da-z\-]+\.shy\.(red|live)/.test(location.host)) {
            domain = location.host.replace(/\.shy\.(red|live)$/g, '');
        }
        if (!domain && !sn) {
            wsId = await sCache.get(CacheKey.wsHost);
        }
        return sn || domain || wsId;
    }
    async onChangeWorkspace(workspace: Partial<Workspace>) {
        if (workspace.id != this.workspace.id) {
            await this.loadWorkspace(workspace.id);
        }
    }
    onCreateWorkspace() {
        UrlRoute.push(ShyUrl.workCreate);
    }
    onToggleSln(isShowSln: boolean) {
        this.isShowSln = isShowSln;
    }
}
export var surface = new Surface();