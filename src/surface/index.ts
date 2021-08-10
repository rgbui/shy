
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
import { richBus } from "../../../rich/util/bus/event.bus";
import { Directive } from "../../../rich/util/bus/directive";
import { userService } from "../user/service";
import { util } from "../util";
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
    private init() {
        this.sln.on(SlnDirective.openItem, (item) => {
            SyHistory.push(generatePath('/page/:id', { id: item.id }));
            this.supervisor.onOpenItem(item);
        });
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
        if (richBus.has(Directive.GalleryQuery)) return;
        richBus.only(Directive.GalleryQuery, async (type, word) => {

        });
        richBus.only(Directive.PagesQuery, async (word) => {

        });
        richBus.only(Directive.UploadFile, async (file, progress) => {
            var r = await userService.uploadFile(file, surface.workspace.id, progress);
            return r;
        });
        richBus.only(Directive.UsersQuery, async () => {

        });
        richBus.only(Directive.CreatePage, async (pageInfo) => {
            var item = surface.sln.selectItems[0];
            var newItem = await item.onAdd(pageInfo);
            return { id: newItem.id, sn: newItem.sn, text: newItem.text }
        });
    }
    updateUser(user: Partial<User>) {
        Object.assign(this.user, user);
    }
    async loadWorkspace() {
        var rr = await workspaceService.loadWorkSpace();
        if (rr.ok) {
            this.workspace = new Workspace()
            this.workspace.load({ ...rr.data.workspace, areas: rr.data.areas });
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
}
export var surface = new Surface();