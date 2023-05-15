import { get, post, put } from "rich/net/annotation";
import { BaseService } from "./common/base";
import { surface } from "../src/surface/store";

class PageService extends BaseService {

    @post('/row/block/sync/refs')
    async pageRefPages(args) {
        return surface.workspace.sock.post('/row/block/sync/refs', { ...args, wsId: surface.workspace.id });
    }

    @get('/get/page/refs')
    async addPageRef(args) {
        return surface.workspace.sock.get('/get/page/refs', { ...args, wsId: surface.workspace.id });
    }

    @get('/get/tag/refs')
    async syncPageRef(args) {
        return surface.workspace.sock.get('/get/tag/refs', { ...args, wsId: surface.workspace.id });
    }

    @get('/tag/word/query')
    async tagWordQuery(args) {
        return surface.workspace.sock.get('/tag/word/query', { ...args, wsId: surface.workspace.id })
    }

    @put('/tag/create')
    async tagCreate(args) {
        return surface.workspace.sock.put('/tag/create', { ...args, wsId: surface.workspace.id })
    }
}