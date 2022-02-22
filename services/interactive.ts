import { patch } from "rich/net/annotation";
import { surface } from "../src/surface";

class interactiveService {
    @patch('/interactive/emoji')
    async interactiveEmoji(elementUrl: string) {
        return surface.workspace.sock.patch('/interactive/emoji', {
            elementUrl,
            wsId: surface.workspace.id
        });
    }
}