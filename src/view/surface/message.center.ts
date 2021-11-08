import { generatePath } from "react-router";
import { Directive } from "rich/util/bus/directive";
import { messageChannel } from "rich/util/bus/event.bus";
import { Surface } from ".";
import { CacheKey, yCache } from "../../../net/cache";
import { pageItemStore } from "../../../services/page.item";
import { userService } from "../../../services/user";
import { workspaceService } from "../../../services/workspace";
import { SyHistory } from "../history";

export function MessageCenter(surface: Surface) {
    if (messageChannel.has(Directive.GalleryQuery)) return;
    messageChannel.on(Directive.GalleryQuery, async (type, word) => {

    });
    messageChannel.on(Directive.PagesQuery, async (word) => {

    });
    messageChannel.on(Directive.UploadFile, async (file, progress) => {
        var r = await userService.uploadFile(file, progress);
        return r;
    });
    messageChannel.on(Directive.UploadWorkspaceFile, async (file, progress) => {
        var r = await workspaceService.uploadFile(surface.workspace.sock, file, surface.workspace.id, progress);
        return r;
    });
    messageChannel.on(Directive.UsersQuery, async () => {

    });
    messageChannel.on(Directive.CreatePage, async (pageInfo) => {
        // var item = surface.workspace.find(g => surface.sln.selectIds.some(s => s == g.id))
        // var newItem = await item.onAdd(pageInfo);
        // return { id: newItem.id, sn: newItem.sn, text: newItem.text }
    });
    messageChannel.on(Directive.TogglePageItem, async () => {
        var visibleIds = surface.workspace.getVisibleIds();
        await yCache.set(yCache.resolve(CacheKey[CacheKey.ws_toggle_pages], surface.workspace.id), visibleIds);
    })
    messageChannel.on(Directive.UpdatePageItem, async (id: string, pageInfo) => {
        var item = surface.workspace.find(g => g.id == id);
        if (item) {
            pageItemStore.updatePageItem(item, pageInfo);
            item.onUpdateDocument();
        }
    });
    messageChannel.on(Directive.OpenPageItem, (item) => {
        var id = typeof item == 'string' ? item : item.id;
        var it = surface.workspace.find(g => g.id == id);
        if (it) {
            SyHistory.push(generatePath('/page/:id', { id: it.id }));
            it.onUpdateDocument();
            surface.supervisor.onOpenItem(it);
            surface.sln.onFocusItem(it);
        }
    });
}