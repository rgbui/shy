import { get, post, put } from "rich/net/annotation";
import { BaseService } from "./common/base";
import { surface } from "../src/surface/store";
import {  masterSock } from "../net/sock";
import { wss } from "./workspace";

class PageService extends BaseService {

    @post('/row/block/sync/refs')
    async pageRefPages(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return sock.post('/row/block/sync/refs', { ...args });
    }

    @get('/get/page/refs')
    async addPageRef(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/get/page/refs', { ...args });
    }
    @get('/get/tag/refs')
    async syncPageRef(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/get/tag/refs', { ...args });
    }
    @get('/tag/word/query')
    async tagWordQuery(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/tag/word/query', { ...args })
    }
    @put('/tag/create')
    async tagCreate(args) {
        return surface.workspace.sock.put('/tag/create', { ...args, wsId: surface.workspace.id })
    }
    @get('/tag/query')
    async tagQuery(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/tag/query', { ...args })
    }
    @post('/download/file')
    async downloadFile(args) {
        return masterSock.post('/download/file', { ...args });
    }
}