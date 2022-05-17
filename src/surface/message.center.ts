
import lodash from "lodash";
import { air, get, query } from "rich/net/annotation";
import { channel } from "rich/net/channel";
import { surface } from ".";
import { yCache, CacheKey } from "../../net/cache";
import { UrlRoute } from "../history";
import { PageItem } from "./sln/item";
import { pageItemStore } from "./sln/item/store/sync";

class MessageCenter {
    @air('/page/open')
    async pageOpen(args: { item: string | { id: string } }) {
        var { item } = args;
        var id = typeof item == 'string' ? item : item?.id;
        var it = id ? surface.workspace.find(g => g.id == id) : undefined;
        if (it) {
            UrlRoute.pushToPage(surface.workspace.host, it.sn)
            it.onUpdateDocument();
            await surface.workspace.loadViewOnlines(it.id);
            surface.sln.onFocusItem(it);
            await surface.supervisor.onOpenItem(it);
        }
        else {
            surface.sln.onFocusItem();
            await surface.supervisor.onOpenItem();
        }
    }
    @get('/page/query/info')
    async pageQueryInfo(args: { id: string }) {
        var item = surface.workspace.find(g => g.id == args.id);
        if (item) {
            return {
                ok: true,
                data: {
                    icon: item.icon,
                    pageType: item.pageType,
                    id: item.id,
                    sn: item.sn,
                    text: item.text
                }
            };
        }
        else {
            var r = await surface.workspace.sock.get('/page/item', { id: args.id });
            if (r.ok && r.data.item) return {
                ok: true,
                data: lodash.pick(r.data.item, ['icon', 'id', 'sn', 'text', 'pageType'])
            }
            else return { ok: false, warn: r.warn };
        }
    }
    @query('/query/current/user')
    queryCurrentUser() {
        return surface.user;
    }
    @air('/update/user')
    async updateUser(args: { data: Record<string, any> }) {
        await surface.user.onUpdateUserInfo(args.data);
    }
    @query('/current/workspace')
    queryWorkspace() {
        return surface.workspace;
    }
    @air('/page/update/info')
    async pageUpdateInfo(args: { id: string, pageInfo: Partial<PageItem> }) {
        var item = surface.workspace.find(g => g.id == args.id);
        if (item) {
            await pageItemStore.updatePageItem(item, args.pageInfo);
            channel.fire('/page/update/info', args);
            item.onUpdateDocument();
        }
    }
    @air('/page/notify/toggle')
    async pageNotifyToggle(args: { id: string, visible: boolean }) {
        await yCache.set(
            yCache.resolve(CacheKey[CacheKey.ws_toggle_pages], surface.workspace.id),
            surface.workspace.getVisibleIds()
        );
    }
}