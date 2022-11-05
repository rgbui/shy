
import lodash from "lodash";
import { act, air, get, query } from "rich/net/annotation";
import { channel } from "rich/net/channel";
import { ElementType, getElementUrl } from "rich/net/element.type";
import { PageLayoutType } from "rich/src/page/declare";
import { surface } from ".";
import { yCache, CacheKey } from "../../net/cache";
import { UrlRoute } from "../history";
import { Mime } from "./sln/declare";
import { PageItem } from "./sln/item";
import { pageItemStore } from "./sln/item/store/sync";

class MessageCenter {
    @query('/ws/current/pages')
    getWsPages() {
        if (surface.workspace) return surface.workspace.findAll(x => x.mime == Mime.page).map(g => g.get())
        else return []
    }
    @air('/page/open')
    async pageOpen(args: { item?: string | { id: string }, elementUrl?: string }) {
        var { item, elementUrl } = args;
        if (item) {
            var id = typeof item == 'string' ? item : item?.id;
            elementUrl = getElementUrl(ElementType.PageItem, id);
        }
        await surface.supervisor.onOpen(elementUrl);
        if (surface.supervisor.main?.item) {
            var it = surface.supervisor.main?.item;
            UrlRoute.pushToPage(surface.workspace.host, it.sn);
            it.onUpdateDocument();
            surface.sln.onFocusItem(it);
        }
    }
    @air('/page/dialog')
    async pageDialog(args: { elementUrl: string }) {
        return await surface.supervisor.onOpenDialog(args.elementUrl);
    }
    @air('/page/create/sub')
    async createPageSub(args: { pageId: string, text: string }) {
        var item = surface.workspace.find(g => g.id == args.pageId);
        if (item) {
            await item.onSpread(true);
            var newItem = await pageItemStore.appendPageItem(item, {
                text: args.text,
                mime: Mime.page,
                pageType: PageLayoutType.doc,
                spread: false,
            });
            return newItem;
        }
    }
    @air('/page/remove')
    async removePage(args: { item: string | { id: string } }) {
        var { item } = args;
        var id = typeof item == 'string' ? item : item?.id;
        var it = id ? surface.workspace.find(g => g.id == id) : undefined;
        if (it) {
            pageItemStore.deletePageItem(it);
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
                    text: item.text,
                    url: item.url,
                    locker: item.locker
                }
            };
        }
        else {
            var r = await surface.workspace.sock.get('/page/item', { id: args.id });
            if (r.ok && r.data.item) return {
                ok: true,
                data: Object.assign({ url: surface.workspace.url + '/page/' + r.data.item.sn },
                    lodash.pick(r.data.item,
                        [
                            'id',
                            'icon',
                            'locker',
                            'sn',
                            'text',
                            'pageType'
                        ]))
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
        if (!item) item = surface.workspace.otherChilds.find(g => g.id == args.id);
        if (item) {
            await pageItemStore.updatePageItem(item, args.pageInfo);
            channel.fire('/page/update/info', args as any);
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
    @query('/cache/get')
    async cacheGet(args: { key: string }) {
        return await yCache.get(args.key);
    }
    @act('/cache/set')
    async cacheSet(args: { key: string, value }) {
        return await yCache.set(args.key, args.value);
    }
}