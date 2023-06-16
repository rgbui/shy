import { post, put } from "rich/net/annotation";
import { masterSock } from "../net/sock";
import { surface } from "../src/surface/store";

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
}