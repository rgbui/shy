
import { User } from "../user/user";
import { ViewSurface } from "./view";
import { Sln } from "../sln";
import { Events } from "rich/util/events";
import { SlnDirective } from "../sln/operator";
import { Supervisor } from "../supervisor";
import { SyHistory } from "../history";
import { generatePath } from "react-router";
import { Workspace } from "../workspace";
import { workspaceService, workspaceTogglePages } from "../workspace/service";
import { Directive } from "rich/util/bus/directive";
import { userService } from "../user/service";
import { util } from "../util";
import { messageChannel } from "rich/util/bus/event.bus";
import { sockSync } from "../service/primus";
class Surface extends Events {
    constructor() {
        super();
        this.init();
    }
    view: ViewSurface;
    supervisor: Supervisor = new Supervisor();
    user: User = new User();
    sln: Sln = new Sln();
    workspace: Workspace;
    /**
     * 是否成功加载数据
     */
    isSuccessfullyLoaded: boolean = false;
    isShowSln: boolean = true;
    private init() {
        this.sln.on(SlnDirective.togglePageItem, async (item) => {
            await workspaceService.togglePage(item);
        });
        this.sln.on(SlnDirective.updatePageItem, async (item) => {
            await workspaceService.savePage(item);
        });
        this.sln.on(SlnDirective.removePageItem, async (item) => {
            await workspaceService.deletePage(item.id)
        });
        this.sln.on(SlnDirective.addSubPageItem, async (item) => {
            await workspaceService.savePage(item);
        });
    }
    async load() {
        if (!this.user.isSign) await this.user.loadUser();
        if (!this.user.isSign) return SyHistory.push('/login');
        if (this.user.isSign) await sockSync.load();
        if (!surface.workspace) {
            var loadResult = await this.loadWorkspace();
            if (loadResult.ok != true) {
                if (loadResult?.data?.toSn) return SyHistory.push(generatePath('/ws/:id', { id: loadResult?.data?.toSn }))
                else return SyHistory.push('/work/create')
            }
            else {
                await this.loadPages();
            }
        }
        this.isSuccessfullyLoaded = true;
        await this.loadAfter();
    }
    async loadAfter() {
        if (messageChannel.has(Directive.GalleryQuery)) return;
        messageChannel.on(Directive.GalleryQuery, async (type, word) => {

        });
        messageChannel.on(Directive.PagesQuery, async (word) => {

        });
        messageChannel.on(Directive.UploadFile, async (file, progress) => {
            var r = await userService.uploadFile(file, surface.workspace.id, progress);
            return r;
        });
        messageChannel.on(Directive.UsersQuery, async () => {

        });
        messageChannel.on(Directive.CreatePage, async (pageInfo) => {
            var item = surface.sln.selectItems[0];
            var newItem = await item.onAdd(pageInfo);
            return { id: newItem.id, sn: newItem.sn, text: newItem.text }
        });
        messageChannel.on(Directive.UpdatePageItem, async (id: string, pageInfo) => {
            var item = this.workspace.find(g => g.id == id);
            if (item) {
                item.onUpdateDocument();
                Object.assign(item, pageInfo);
                if (item.view) item.view.forceUpdate()
            }
            workspaceService.updatePage(id, pageInfo);
        });
        messageChannel.on(Directive.OpenPageItem, (item) => {
            var id = typeof item == 'string' ? item : item.id;
            var it = surface.workspace.find(g => g.id == id);
            if (it) {
                SyHistory.push(generatePath('/page/:id', { id: it.id }));
                it.onUpdateDocument();
                this.supervisor.onOpenItem(it);
                this.sln.onFocusItem(it);
            }
        });
    }
    updateUser(user: Partial<User>) {
        Object.assign(this.user, user);
    }
    async loadWorkspace() {
        var rr = await workspaceService.loadWorkSpace();
        if (rr.ok) {
            this.workspace = new Workspace()
            this.workspace.load({ ...rr.data.workspace, users: rr.data.users });
        }
        return rr;
    }
    async loadPages() {
        var ids = await workspaceTogglePages.getIds();
        var rr = await workspaceService.loadWorkspaceItems(this.workspace.id, ids);
        if (rr) {
            if (Array.isArray(rr?.data?.pages)) {
                var pages = rr.data.pages;
                pages = util.flatArrayConvertTree(pages);
                this.workspace.load({ childs: pages });
            }
        }
    }
    onChangeWorkspace(workspace: Partial<Workspace>) {
        SyHistory.push(generatePath('/ws/:id', { id: workspace.sn }))
    }
    onCreateWorkspace() {
        SyHistory.push('/work/create')
    }
    onToggleSln(isShowSln: boolean) {
        this.isShowSln = isShowSln;
        this.view.forceUpdate();
    }
}
export var surface = new Surface();