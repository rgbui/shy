import { patch,get} from "rich/net/annotation";
import { surface } from "../src/surface";

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
        
        return surface.workspace.sock.get('/user/interactives', {
            ...args,
            wsId: surface.workspace.id
        })
    }
}