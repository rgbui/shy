import { generatePath } from "react-router";
import { Directive } from "rich/util/bus/directive";
import { messageChannel } from "rich/util/bus/event.bus";
import { Surface, surface } from ".";
import { userService } from "../../../services/user";
import { workspaceService } from "../../../services/workspace";
import { SyHistory } from "../history";
import { SlnDirective } from "./sln/declare";
export function MessageCenter(surface: Surface) {
    surface.sln.on(SlnDirective.togglePageItem, async (item) => {
        await workspaceService.togglePage(item);
    });
    surface.sln.on(SlnDirective.updatePageItem, async (item) => {
        await workspaceService.savePage(item);
    });
    surface.sln.on(SlnDirective.removePageItem, async (item) => {
        await workspaceService.deletePage(item.id)
    });
    surface.sln.on(SlnDirective.addSubPageItem, async (item) => {
        await workspaceService.savePage(item);
    });
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
        var item = surface.workspace.find(g => g.id == id);
        if (item) {
            item.onUpdateDocument();
            Object.assign(item, pageInfo);
            // if (item.view) item.view.forceUpdate()
        }
        workspaceService.updatePage(id, pageInfo);
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