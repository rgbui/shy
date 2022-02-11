
import { air, get, query } from "rich/net/annotation";
import { Directive } from "rich/util/bus/directive";
// import { messageChannel } from "rich/util/bus/event.bus";
import { surface, Surface } from ".";
import { CacheKey, yCache } from "../../net/cache";
import { userTim } from "../../net/primus/tim";
import { pageItemStore } from "./sln/item/store/sync";


// import { workspaceService } from "../../services/workspace";
import { UrlRoute } from "../history";

// export function MessageCenter(surface: Surface) {
//     // if (messageChannel.has(Directive.GalleryQuery)) return;
//     // messageChannel.on(Directive.GalleryQuery, async (type, word) => {

//     // });
//     // messageChannel.on(Directive.PagesQuery, async (word) => {

//     // });
//     // messageChannel.on(Directive.UploadFile, async (file, progress) => {
//     //     var r = await userService.uploadFile(file, progress);
//     //     return r;
//     // });
//     // messageChannel.on(Directive.UploadWorkspaceFile, async (file, progress) => {
//     //     var r = await workspaceService.uploadFile(surface.workspace.sock, file, surface.workspace.id, progress);
//     //     return r;
//     // });
//     // messageChannel.on(Directive.UploadWorkspaceFileUrl, async (url) => {
//     //     var r = await workspaceService.uploadUrl(surface.workspace.sock, url, surface.workspace.id);
//     //     return r;
//     // })
//     // messageChannel.on(Directive.UsersQuery, async () => {

//     // });
//     // messageChannel.on(Directive.CreatePage, async (pageInfo) => {
//     //     // var item = surface.workspace.find(g => surface.sln.selectIds.some(s => s == g.id))
//     //     // var newItem = await item.onAdd(pageInfo);
//     //     // return { id: newItem.id, sn: newItem.sn, text: newItem.text }
//     // });
//     // messageChannel.on(Directive.TogglePageItem, async () => {
//     //     var visibleIds = surface.workspace.getVisibleIds();
//     //     await yCache.set(yCache.resolve(CacheKey[CacheKey.ws_toggle_pages], surface.workspace.id), visibleIds);
//     // })
//     // messageChannel.on(Directive.getPageInfo, async (id: string) => {
//     //     var item = surface.workspace.find(g => g.id == id);
//     //     if (item) {
//     //         return { icon: item.icon, id: item.id, sn: item.sn, text: item.text };
//     //     }
//     //     else {
//     //         var r = await workspaceService.getPage(id);
//     //         if (r.ok && r.data.page)
//     //             return { icon: r.data.page.icon, id: item.id, sn: item.sn, text: r.data.page.text }
//     //     }
//     // });
//     // messageChannel.on(Directive.UpdatePageItem, async (id: string, pageInfo) => {
//     //     var item = surface.workspace.find(g => g.id == id);
//     //     if (item) {
//     //         await pageItemStore.updatePageItem(item, pageInfo);
//     //         if (surface.supervisor?.item === item) item.onUpdateDocument();
//     //     }
//     // });
//     // messageChannel.on(Directive.OpenPageItem, async (item) => {
//     //     var id = typeof item == 'string' ? item : item.id;
//     //     var it = surface.workspace.find(g => g.id == id);
//     //     if (it) {
//     //         UrlRoute.pushToPage(surface.workspace.host, it.sn)
//     //         it.onUpdateDocument();
//     //         surface.sln.onFocusItem(it);
//     //         await surface.supervisor.onOpenItem(it);
//     //     }
//     // });
//     // messageChannel.on(Directive.openPageLink, async (item) => {
//     //     var id = typeof item == 'string' ? item : item.id;
//     //     var it = surface.workspace.find(g => g.id == id);
//     //     if (!it) {
//     //         //这里当前页面不一定加载过pageItem,所以需要通过后台自动加载，查询
//     //     }
//     //     if (it) {
//     //         UrlRoute.pushToPage(surface.workspace.host, it.sn)
//     //         it.onUpdateDocument();
//     //         surface.sln.onFocusItem(it);
//     //         await surface.supervisor.onOpenItem(it);
//     //     }
//     // });
//     // messageChannel.on(Directive.QueryWorkspaceTableSchemas, async () => {
//     //     return schemaService.allWorkspace(surface.workspace.sock, surface.workspace.id)
//     // });
//     // messageChannel.on(Directive.getSchemaFields, async (id) => {
//     //     return schemaService.load(surface.workspace.sock, id);
//     // });
//     // messageChannel.on(Directive.getCurrentUser, () => {
//     //     return surface.user;
//     // })
//     // userTim.on('/ws/:wsId/update', () => {

//     // });
//     // userTim.on('/page/content/operator', () => {

//     // });
//     // userTim.on('/page/item/operator', () => {

//     // });
// }

class MessageCenter {
    @air('/page/open')
    async pageOpen(args: { item: string | { id: string } }) {
        var { item } = args;
        var id = typeof item == 'string' ? item : item.id;
        var it = surface.workspace.find(g => g.id == id);
        if (it) {
            UrlRoute.pushToPage(surface.workspace.host, it.sn)
            it.onUpdateDocument();
            surface.sln.onFocusItem(it);
            await surface.supervisor.onOpenItem(it);
        }
        else {
            /**
             * 本地没有item.id时，怎么处理，
             * 需要后台依次查出来，然后加载
             */
        }
    }
    @get('/page/query/info')
    async pageQueryInfo(args: { id: string }) {
        var item = surface.workspace.find(g => g.id == args.id);
        if (item) {
            return { ok: true, data: { icon: item.icon, id: item.id, sn: item.sn, text: item.text } };
        }
        else {
            var r = await surface.workspace.sock.get('/page/item', { id: args.id });
            if (r.ok && r.data.item) return { ok: true, data: r.data.item }
            else return { ok: false, warn: r.warn };
        }
    }
    @query('/query/current/user')
    queryCurrentUser() {
        return surface.user;
    }
    @air('/update/user')
    async updateUser(args: { data: Record<string, any> }) {
        await surface.user.onUpdateUserInfo(args.data);
    }
    @query('/current/workspace')
    queryWorkspace() {
        return surface.workspace;
    }
}