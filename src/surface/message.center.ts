
import lodash from "lodash";
import { act, air, get, query } from "rich/net/annotation";
import { channel } from "rich/net/channel";
import { ElementType, parseElementUrl } from "rich/net/element.type";
import { PageLayoutType } from "rich/src/page/declare";
import { surface } from "./store";
import { yCache, CacheKey } from "../../net/cache";
import { UrlRoute } from "../history";
import { Mime } from "./sln/declare";
import { PageItem } from "./sln/item";
import { pageItemStore } from "./sln/item/store/sync";
import { getPageItemElementUrl } from "./sln/item/util";
import { ShyAlert } from "rich/component/lib/alert";


class MessageCenter {
    @query('/ws/current/pages')
    getWsPages() {
        if (surface.workspace) return surface.workspace.findAll(x => x.mime == Mime.page).map(g => g.get())
        else return []
    }
    @query('/user/get/onlines')
    getOnlines() {
        if (surface.workspace) return surface.workspace.onLineUsers;
        return new Set()
    }
    @query('/get/view/onlines')
    async getViewOnlines(e: { viewUrl: string, viewEdit?: boolean }) {
        if (surface.workspace) {
            var os = e.viewEdit ? surface.workspace.viewEditOnlineUsers : surface.workspace.viewOnlineUsers;
            var ub = os.get(e.viewUrl)
            if (!ub || ub?.load == false) {
                await surface.workspace.loadViewOnlineUsers(e.viewUrl)
                ub = os.get(e.viewUrl)
            }
            if (ub) return ub.users;
        }
        return new Set()
    }
    @air('/page/open')
    async pageOpen(args: { item?: string | PageItem, elementUrl?: string, config?: { isTemplate?: boolean, force?: boolean } }) {
        var { item, elementUrl } = args;
        if (item) {
            if ((item as PageItem)?.elementUrl) elementUrl = (item as PageItem).elementUrl;
            else {
                var r = await channel.get('/page/query/info', {
                    id: (item as any)?.id || item
                });
                if (r) {
                    elementUrl = r.data.elementUrl;
                }
                else {
                    ShyAlert('页面不存在')
                    return;
                }
            }
        }
        await surface.supervisor.onOpen(elementUrl, args.config);
        if (surface.supervisor.page?.item) {
            var it = surface.supervisor.page?.item;
            UrlRoute.pushToPage(surface.workspace.siteDomain || surface.workspace.sn, it.sn);
            it.onUpdateDocument();
            surface.sln.onFocusItem(it);
        }
    }
    @air('/page/dialog')
    async pageDialog(args: { elementUrl: string, config?: { isTemplate?: boolean } }) {
        return await surface.supervisor.onOpenDialog(args.elementUrl, args.config);
    }
    @air('/page/slide')
    async pageSlide(args: { elementUrl: string, config?: { isTemplate?: boolean } }) {
        return await surface.supervisor.onOpenSlide(args.elementUrl, args.config);
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
                    elementUrl: item.elementUrl
                }
            };
        }
        else {
            var r = await surface.workspace.sock.get('/page/item', { id: args.id });
            if (r.ok && r.data.item) return {
                ok: true,
                data: Object.assign({
                    url: surface.workspace.url + '/page/' + r.data.item.sn,
                    elementUrl: getPageItemElementUrl(r.data.item as any)
                },
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
    async pageUpdateInfo(args: { id?: string, elementUrl?: string, pageInfo: Partial<PageItem> }) {
        var itemId;
        if (args.id) {
            itemId = args.id;
        }
        else if (args.elementUrl) {
            var pe = parseElementUrl(args.elementUrl);
            if ([ElementType.PageItem, ElementType.Schema, ElementType.Room].includes(pe.type)) {
                itemId = pe.id;
            }
            else if (ElementType.SchemaFieldBlogData == pe.type) {

            }
        }
        if (itemId) {
            var item = surface.workspace.find(g => g.id == itemId);
            if (!item) item = surface.workspace.otherChilds.find(g => g.id == itemId);
            if (item) {
                await pageItemStore.updatePageItem(item, args.pageInfo);
                item.onUpdateDocument();
            }
        }
        channel.fire('/page/update/info', args as any);
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