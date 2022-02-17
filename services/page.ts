
import { act, get } from "rich/net/annotation";
import { ElementType } from "rich/net/element.type";
import { UserAction } from "rich/src/history/action";
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
        return { ok: true, data: await snapStore.querySnap() }
    }
    @act('/page/view/operator')
    async PageViewOperator(args: { syncBlockId: string, operate: Partial<UserAction> }) {
        var snapStore = SnapSync.create(ElementType.Block, args.syncBlockId);
        return await snapStore.viewOperator(args.operate);
    }
    @act('/page/view/snap')
    async PageViewSnap(args: { syncBlockId: string, seq: number, content: any }) {
        var snapStore = SnapSync.create(ElementType.Block, args.syncBlockId);
        return snapStore.viewSnap(args.seq, args.content)
    }
}