
import { act, del, get, patch, post, put } from "rich/net/annotation";
import { UserAction } from "rich/src/history/action";
import { surface } from "../src/surface";
import { BaseService } from "./common/base";
import { SnapStore } from "./snap/store";

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
    @get('/view/snap/query')
    async getPageSyncBlock(args: { elementUrl: string }) {
        var snapStore = SnapStore.createSnap(args.elementUrl);
        return { ok: true, data: await snapStore.querySnap() }
    }
    @act('/view/snap/operator')
    async PageViewOperator(args: { elementUrl: string, operate: Partial<UserAction> }) {
        var snapStore = SnapStore.createSnap(args.elementUrl);
        return await snapStore.viewOperator(args.operate);
    }
    @act('/view/snap/store')
    async PageViewSnap(args: { elementUrl: string, seq: number, content: any }) {
        var snapStore = SnapStore.createSnap(args.elementUrl);
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
    @del('/view/snap/del')
    async viewSnapDelete(args) {
        return surface.workspace.sock.delete('/view/snap/del', { ...args, wsId: surface.workspace.id });
    }
    @patch('/view/snap/patch')
    async viewSnapPatch(args) {
        return surface.workspace.sock.patch('/view/snap/patch', { ...args, wsId: surface.workspace.id });
    }
    @post('/view/snap/rollup')
    async viewSnapRollup(args) {
        return surface.workspace.sock.post('/view/snap/rollup', { ...args, wsId: surface.workspace.id });
    }

}