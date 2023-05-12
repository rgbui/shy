import { get, patch, put } from "rich/net/annotation";
import { BaseService } from "./common/base";
import { surface } from "../src/surface/store";

class PageService extends BaseService {
    @get('/block/ref/pages')
    async pageRefPages(args) {
        return surface.workspace.sock.get('/block/ref/pages', { ...args, wsId: surface.workspace.id });
    }
    @put('/block/ref/add')
    async addPageRef(args) {
        return surface.workspace.sock.put('/block/ref/add', { ...args, wsId: surface.workspace.id });
    }
    @patch('/block/ref/sync')
    async syncPageRef(args) {
        return surface.workspace.sock.patch('/block/ref/sync', { ...args, wsId: surface.workspace.id });
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