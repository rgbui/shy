import { get, post, put } from "rich/net/annotation";
import { masterSock } from "../net/sock";
import { surface } from "../src/surface/store";
import { wss } from "./workspace";

export class RobotService {
    @put('/sync/wiki/doc')
    async syncWikiDoc(args) {
        args.wsId = surface.workspace?.id;
        return await masterSock.put('/sync/wiki/doc', args);
    }
    @post('/robot/doc/embedding')
    async setWikiDocEmbedding(args) {
        return await masterSock.post<{ tokenCount: number }>('/robot/doc/embedding', args);
    }
    @get('/ws/robots')
    async wsRobots(args) {
        if (typeof args == 'undefined') args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/ws/robots', args);
    }
    @get('/robots/info')
    async robotsInfo(args) {
        args.wsId = surface.workspace.id;
        return await masterSock.get('/robots/info', args);
    }
    @get('/get/robot')
    async getRobot(args) {
        args.wsId = surface.workspace.id;
        return await masterSock.get('/get/robot', args);
    }
}