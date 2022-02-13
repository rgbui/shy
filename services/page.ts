
import { get } from "rich/net/annotation";
import { ElementType } from "rich/net/element.type";
import { surface } from "../src/surface";
import { BaseService } from "./common/base";
import { SnapSync } from "./snap/sync";

class PageService extends BaseService {
    @get('/page/items')
    async pageItems(args: { ids: string[] }) {
        return await surface.workspace.sock.get('/page/items', { wsId: surface.workspace.id, ids: args.ids });
    }
    @get('/page/item/subs')
    async pageItemSubs(args: { id: string }) {
        return await surface.workspace.sock.get('/page/item/subs', args);
    }
    @get('/page/item')
    async queryPageItem(args: { id: string }) {
        return await surface.workspace.sock.get('/page/item', args);
    }
    @get('/page/query/links')
    async pageQueryLinks(args: { word: string }) {

    }
    @get('/page/sync/block')
    async getPageSyncBlock(args: { syncBlockId: string }) {
        var snapStore = SnapSync.create(ElementType.Block, args.syncBlockId);
        return await snapStore.querySnap();
    }
}