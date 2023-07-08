
import { act, del, get, patch, post, put } from "rich/net/annotation";
import { UserAction } from "rich/src/history/action";
import { surface } from "../src/surface/store";
import { BaseService } from "./common/base";
import { SnapStore } from "./snap/store";
import { IconArguments } from "rich/extensions/icon/declare";
import { wss } from "./workspace";

class PageService extends BaseService {
    @get('/page/items')
    async pageItems(args: { ids: string[], sock?: any, wsId?: string }) {
        var sock = args.sock || surface.workspace.sock;
        var wsId = args.wsId || surface.workspace.id;
        return await sock.get('/page/items', { wsId: wsId, ids: args.ids });
    }
    @get('/page/item/subs')
    async pageItemSubs(args: Record<string, any>) {
        if (!args.wsId) args.wsId = surface.workspace.id;
        return await surface.workspace.sock.get('/page/item/subs', args);
    }
    @get('/page/parent/ids')
    async pageParentIds(args: Record<string, any>) {
        if (!args.wsId) args.wsId = surface.workspace.id;
        return await surface.workspace.sock.get('/page/parent/ids', args);
    }
    @get('/page/parent/subs')
    async pageParentSubs(args: Record<string, any>) {
        if (!args.wsId) args.wsId = surface.workspace.id;
        return await surface.workspace.sock.get('/page/parent/subs', args);
    }
    @get('/page/item')
    async queryPageItem(args: { id: string }) {
        return await surface.workspace.sock.get('/page/item', args);
    }
    @put('/page/item/create')
    async pageItemCreate(args: Record<string, any>) {
        if (!args.wsId) args.wsId = surface.workspace.id;
        return await surface.workspace.sock.put('/page/item/create', args);
    }
    @get('/view/snap/query/readonly')
    async getAutoPageSyncBlock(args: { wsId?: string, elementUrl: string }) {
        var wsId = args.wsId || surface.workspace.id;
        var sock = args?.wsId ? await wss.getWsSock(args.wsId) : surface.workspace.sock;
        var r = await sock.get<{
            localExisting: boolean,
            file: IconArguments,
            operates: any[],
            content: string
        }>('/view/snap/query', {
            elementUrl: args.elementUrl,
            wsId: wsId,
            seq: -1,
            readonly: true
        });
        return r
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
        return snapStore.viewSnap({ seq: args.seq, content: args.content })
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

    @post('/screenshot/png')
    async screenShotPng(args) {
        return surface.workspace.sock.post('/screenshot/png', { ...args, wsId: surface.workspace.id });
    }
    @post('/screenshot/pdf')
    async screenshotPdf(args) {
        return surface.workspace.sock.post('/screenshot/pdf', { ...args, wsId: surface.workspace.id });
    }
    @post('/import/page')
    async importPage(args) {
        return surface.workspace.sock.post('/import/page', { ...args, wsId: surface.workspace.id });
    }
}