
import { act, del, get, patch, post, put } from "rich/net/annotation";
import { UserAction } from "rich/src/history/action";
import { surface } from "../src/surface/app/store";
import { BaseService } from "./common/base";
import { SnapStore } from "./snap/store";
import { IconArguments } from "rich/extensions/icon/declare";
import { wss } from "./workspace";
import { LinkWs } from "rich/src/page/declare";

class PageService extends BaseService {
    @get('/page/deleted/query')
    async pageDeletedQuery(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/page/deleted/query', args);
    }
    @del('/page/deleted/clean')
    async pageDeletedClean(args: Record<string, any>) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.delete('/page/deleted/clean', args);
    }
    @post('/page/item/recover')
    async pageItemRecover(args: Record<string, any>) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.post('/page/item/recover', args);
    }
    @get('/page/items')
    async pageItems(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/page/items', args);
    }
    @get('/page/ws/items')
    async pageWsItems(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/page/ws/items', args);
    }
    @get('/page/item/subs')
    async pageItemSubs(args: Record<string, any>) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/page/item/subs', args);
    }
    @get('/page/parent/ids')
    async pageParentIds(args: Record<string, any>) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/page/parent/ids', args);
    }
    @get('/page/parent/subs')
    async pageParentSubs(args: Record<string, any>) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/page/parent/subs', args);
    }
    @get('/page/item')
    async queryPageItem(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/page/item', args);
    }
    @put('/page/item/create')
    async pageItemCreate(args: Record<string, any>) {
        if (!args.wsId) args.wsId = surface.workspace.id;
        return await surface.workspace.sock.put('/page/item/create', args);
    }
    @get('/view/snap/query/readonly')
    async getAutoPageSyncBlock(args: { wsId?: string, elementUrl: string }) {
        if (!args) args = {} as any
        var sock = await wss.getArgsSock(args);
        return await sock.get<{
            localExisting: boolean,
            file: IconArguments,
            operates: any[],
            content: string
        }>('/view/snap/query', {
            elementUrl: args.elementUrl,
            wsId: args.wsId,
            seq: -1,
            readonly: true
        });
    }
    @get('/view/snap/query')
    async getPageSyncBlock(args: { ws: LinkWs, elementUrl: string }) {
        if (args.ws?.id == surface.workspace?.id || !args.ws) {
            var snapStore = SnapStore.createSnap(args.elementUrl);
            return { ok: true, data: await snapStore.querySnap() }
        }
        var sock = await wss.getArgsSock(args.ws);
        return await sock.get<{
            localExisting: boolean,
            file: IconArguments,
            operates: any[],
            content: string
        }>('/view/snap/query', {
            elementUrl: args.elementUrl,
            wsId: args.ws?.id,
            seq: -1,
            readonly: false
        })
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
    @put('/view/snap/direct')
    async PageViewDirect(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        sock.put('/view/snap/direct', {
            ...args,
            wsId: surface.workspace.id
        });
    }
    @get('/view/snap/list')
    async viewSnapList(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/view/snap/list', { ...args, wsId: surface.workspace.id });
    }
    @get('/view/snap/content')
    async viewSnapContent(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/view/snap/content', { ...args, wsId: surface.workspace.id });
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
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return sock.post('/import/page', { ...args });
    }
    @put('/import/page/data')
    async importPageData(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return sock.put('/import/page/data', { ...args });
    }
}