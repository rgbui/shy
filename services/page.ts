
import { get } from "rich/net/annotation";
import { surface } from "../src/surface";
import { BaseService } from "./common/base";

class PageService extends BaseService {
    @get('/page/items')
    async pageItems(args: { ids: string[] }) {
        return await surface.workspace.sock.get('/page/items', { wsId: surface.workspace.id, ids: args.ids });
    }
    @get('/page/item/subs')
    async pageItemSubs(args: { id: string }) {
        return await surface.workspace.sock.get('/page/item/subs', args);
    }
    @get('/page/item')
    async queryPageItem(args: { id: string }) {
        return await surface.workspace.sock.get('/page/item', args);
    }
    @get('/page/query/links')
    async pageQueryLinks(args: { word: string }) {

    }
}