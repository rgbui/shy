import { get, post } from "rich/net/annotation";
import { masterSock } from "../net/sock";
import { surface } from "../src/surface/store";

export class AiService {
    @get('/query/wiki/answer')
    async add(args) {
        args.wsId = surface.workspace?.id;
        var d = await masterSock.get('/query/wiki/answer', args);
        return d;
    }
    @post('/text/ai')
    async textAI(args) {
        args.wsId = surface.workspace?.id;
        var d = await masterSock.post('/text/ai', args);
        return d;
    }
    @post('/text/edit')
    async textEdit(args) {
        args.wsId = surface.workspace?.id;
        var d = await masterSock.post('/text/edit', args);
        return d;
    }
    @get('/text/embedding')
    async textEmbedding(args) {
        args.wsId = surface.workspace?.id;
        var d = await masterSock.get('/text/embedding', args);
        return d;
    }
    @get('/text/to/image')
    async textToImage(args) {
        args.wsId = surface.workspace?.id;
        var d = await masterSock.post('/text/to/image', args);
        return d;
    }
    @post('/text/ai/stream')
    async textAIStream(args) {
        args.wsId = surface.workspace?.id;
        var callback = args.callback;
        delete args.callback;
        var d = masterSock.fetchStream({
            url: '/text/ai/stream',
            data: args,
            method: 'POST'
        }, callback)
        return d;
    }
    @post('/fetch')
    async fetchStream(args) {
        var cb = args.callback;
        delete args.callback;
        await masterSock.fetchStream(args, cb);
    }
    @post('/http')
    async http(args) {
        var me = args.method.toLowerCase();
        if (typeof args.data == 'undefined') args.data = {}
        args.data.wsId = surface.workspace?.id;
        if (me == 'get') return await masterSock.get(args.url, args.data);
        else if (me == 'put') return await masterSock.put(args.url, args.data);
        else if (me == 'post') return await masterSock.post(args.url, args.data);
    }
}