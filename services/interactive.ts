import { patch, get } from "rich/net/annotation";
import { surface } from "../src/surface/store";
import { wss } from "./workspace";

class interactiveService {
    @patch('/interactive/emoji')
    async interactiveEmoji(args: { elementUrl: string }) {
        return surface.workspace.sock.patch('/interactive/emoji', {
            ...args,
            wsId: surface.workspace.id
        });
    }
    @get('/user/interactives')
    async getUserInteractives(args: {}) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/user/interactives', {
            ...args,
            wsId: surface.workspace.id
        })
    }
}