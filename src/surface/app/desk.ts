import { Pid } from "../workspace/declare";
import { surface } from "./store";


export async function getDeskLocalPids() {
    if (window.shyConfig?.isDesk) {
        var rs = await surface.shyDesk.readLocalStore();
        return [
            {
                id: 'local-colund',
                types: ['ws', 'tim', 'file'],
                url: `http://127.0.0.1:${rs?.port||12800}`
            }
        ] as Pid[]
    }
    else return []

}
