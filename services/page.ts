
import { act, del, get, patch, put } from "rich/net/annotation";
import { ElementType } from "rich/net/element.type";
import { UserAction } from "rich/src/history/action";
import { surface } from "../src/surface";
import { BaseService } from "./common/base";
import { SnapSync } from "./snap/sync";

class PageService extends BaseService {
    @get('/page/items')
    async pageItems(args: { ids: string[], sock?: any, wsId?: string }) {
        var sock = args.sock || surface.workspace.sock;
        var wsId = args.wsId || surface.workspace.id;
        return await sock.get('/page/items', { wsId: wsId, ids: args.ids });
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

    @get('/block/ref/pages')
    async pageRefPages(args) {
        return surface.workspace.sock.get('/block/ref/pages', { ...args, wsId: surface.workspace.id });
    }
    @put('/block/ref/add')
    async addPageRef(args) {
        return surface.workspace.sock.put('/block/ref/add', { ...args, wsId: surface.workspace.id });
    }
    @del('/block/ref/remove')
    async removePageRef(args) {
        return surface.workspace.sock.delete('/block/ref/remove', { ...args, wsId: surface.workspace.id });
    }
    @patch('/block/ref/sync')
    async syncPageRef(args) {
        return surface.workspace.sock.patch('/block/ref/sync', { ...args, wsId: surface.workspace.id });
    }

    @get('/view/snap/list')
    async viewSnapList(args) {
        return surface.workspace.sock.get('/view/snap/list', { ...args, wsId: surface.workspace.id });
    }
    @get('/view/snap/content')
    async viewSnapContent(args) {
        return surface.workspace.sock.get('/view/snap/content', { ...args, wsId: surface.workspace.id });
    }

}