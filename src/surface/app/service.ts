
import lodash from "lodash";
import { act, air, get, post, query } from "rich/net/annotation";
import { channel } from "rich/net/channel";
import { ElementType, parseElementUrl } from "rich/net/element.type";
import { LinkWs, PageLayoutType } from "rich/src/page/declare";
import { surface } from "./store";
import { yCache, CacheKey } from "../../../net/cache";
import { ShyUrl, UrlRoute } from "../../history";
import { Mime } from "../sln/declare";
import { PageItem } from "../sln/item";
import { pageItemStore } from "../sln/item/store/sync";
import { findItemPermisson, getPageItemElementUrl, itemIsPermissons } from "../sln/item/util";
import { ShyAlert } from "rich/component/lib/alert";
import { useSelectPayView } from "../../component/pay/select";
import { SnapDataType, SnapStore } from "../../../services/snap/store";
import { masterSock } from "../../../net/sock";
import { TableSchema, TableSchemaView } from "rich/blocks/data-grid/schema/meta";
import { AtomPermission, getEditOwnPerssions } from "rich/src/page/permission";
import { Workspace } from "../workspace";
import { wss } from "../../../services/workspace";
import { lst } from "rich/i18n/store";
import { RobotInfo } from "rich/types/user";
import { useOpenRobotSettings } from "../workspace/robot/view";

import { userChannelStore } from "../user/channel/store";
import { useLazyOpenWorkspaceSettings } from "../workspace/settings/lazy";
import { useOpenUserSettings } from "../user/settings/lazy";
import { getDeskLocalPids } from "./desk";

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
    async getViewOnlines(e: { viewUrl: string }) {
        if (surface.workspace) {
            var os = surface.workspace.viewOnlineUsers;
            var ub = os.get(e.viewUrl)
            if (!ub || ub?.load == false) {
                await surface.workspace.loadViewOnlineUsers(e.viewUrl)
                ub = os.get(e.viewUrl)
            }
            if (ub) return { users: ub.users };
        }
        return { users: new Set() }
    }
    @act('/robot/open')
    async robotOpen(args: { robot: RobotInfo }) {
        await useOpenRobotSettings(args.robot);
    }
    @act('/page/open')
    async pageOpen(args: { item?: string | PageItem, elementUrl?: string, config?: { isTemplate?: boolean, blockId?: string, force?: boolean } }) {
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
                    ShyAlert(lst('页面不存在'))
                    return;
                }
            }
        }
        if (window.location.hash) {
            args.config = Object.assign(args.config || {},
                {
                    blockId: window.location.hash.slice(1)
                }
            )
        }
        await surface.supervisor.onOpen(elementUrl, args.config);

        if (surface.supervisor.page?.item) {
            var it = surface.supervisor.page?.item;
            var willPageId = UrlRoute.isMatch(ShyUrl.root) ? surface.workspace.defaultPageId : undefined;
            if (UrlRoute.isMatch(ShyUrl.page)) willPageId = UrlRoute.match(ShyUrl.page)?.pageId;
            else if (UrlRoute.isMatch(ShyUrl.wsPage)) willPageId = UrlRoute.match(ShyUrl.wsPage)?.pageId;
            it.onUpdateDocument();
            surface.sln.onFocusItem(it);
            if (args.config?.force == true || !(willPageId == it.id || willPageId && it && willPageId.toString() == it.sn?.toString())) {
                UrlRoute.pushToPage(surface.workspace.siteDomain || surface.workspace.sn, it.sn);
            }
        }
        else {
            var pe = parseElementUrl(elementUrl);
            if (pe.type == ElementType.SchemaRecordView || pe.type == ElementType.SchemaRecordViewData || pe.type == ElementType.SchemaData) {
                UrlRoute.pushToResource(surface.workspace.siteDomain || surface.workspace.sn, elementUrl);
            }
        }
    }
    @post('/clone/page')
    async pageClone(args: { pageId: string, text?: string, parentId?: string, downPageId?: string }) {
        var r = await surface.workspace.sock.post('/clone/page', {
            wsId: surface.workspace.id,
            sourcePageId: args.pageId,
            newPageText: args.text,
            parentId: args.parentId,
            downPageId: args.downPageId
        })
        var items = r.data.items;
        var item = surface.workspace.find(g => args.parentId && g.id == args.parentId || args.downPageId && g.id == args.downPageId)
        if (item) {
            if (args.downPageId) item = item.parent;
            if (item) {
                await item.onSync()
            }
        }
        return { ok: true, data: { items } };
    }
    @act('/page/dialog')
    async pageDialog(args: { elementUrl: string, config?: { isTemplate?: boolean } }) {
        return await surface.supervisor.onOpenDialog(args.elementUrl, args.config);
    }
    @act('/page/slide')
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
    async pageQueryInfo(args: { ws?: LinkWs, id: string, sn?: number }) {
        var item = surface?.workspace?.find(g => args.id && g.id == args.id || g.sn == args.sn);
        if (item) {
            return {
                ok: true,
                data: {
                    icon: item.icon,
                    pageType: item.pageType,
                    cover: lodash.cloneDeep(item.cover),
                    plain: lodash.cloneDeep(item.plain),
                    thumb: lodash.cloneDeep(item.thumb),
                    mime: item.mime,
                    id: item.id,
                    sn: item.sn,
                    text: item.text,
                    url: item.url,
                    elementUrl: item.elementUrl,
                    share: item.share,
                    speak: item.speak,
                    speakDate: item.speakDate,
                    netPermissions: item.netPermissions,
                    memberPermissions: item.memberPermissions,
                    inviteUsersPermissions: item.inviteUsersPermissions,
                    parentId: item.parentId
                }
            };
        }
        else {
            var sock = args.ws && args.ws?.id != surface?.workspace?.id ? await wss.getWsSock(args.ws?.id) : surface.workspace.sock;
            var ws = args.ws || surface.workspace;
            var r = await sock.get('/page/item', { id: args.id || undefined, sn: args.sn || undefined });
            if (r.ok && r.data.item) return {
                ok: true,
                data: Object.assign({
                    url: ws.url + '/page/' + r.data.item.sn,
                    elementUrl: getPageItemElementUrl(r.data.item as any)
                }, lodash.pick(r.data.item,
                    [
                        'id',
                        'icon',
                        'locker',
                        'sn',
                        'text',
                        'pageType',
                        'cover',
                        'plain',
                        'thumb',
                        'share',
                        'netPermissions',
                        'memberPermissions',
                        'inviteUsersPermissions',
                        'parentId',
                        'mime',
                        'speak',
                        'speakDate'
                    ]))
            }
            else return { ok: false, warn: r.warn };
        }
    }
    @get('/page/query/parents')
    async pageQueryPages(args: { ws?: LinkWs, id: string, sn?: number }) {
        var item = surface?.workspace?.find(g => args.id && g.id == args.id || g.sn == args.sn);
        if (item) {
            var items: PageItem[] = [];
            var r = item;
            var count = 0;
            while (true) {
                count += 1;
                if (count > 100) break;
                if (r) {
                    items.push(r);
                    r = r.parent
                }
                else break;
            }
            return { ok: true, data: { items } };
        }
        else {
            var sock = args.ws && args.ws?.id != surface?.workspace?.id ? await wss.getWsSock(args.ws?.id) : surface.workspace.sock;
            var ws = args.ws || surface.workspace;
            var rc = await sock.get('/page/parent/items', { id: args.id || undefined, sn: args.sn || undefined });
            if (rc.ok && rc.data.items)
                return {
                    ok: true,
                    data: {
                        items: rc.data.items.map(item => {
                            return Object.assign({
                                url: ws.url + '/page/' + item.sn,
                                elementUrl: getPageItemElementUrl(item as any)
                            }, lodash.pick(item,
                                [
                                    'id',
                                    'icon',
                                    'locker',
                                    'sn',
                                    'text',
                                    'pageType',
                                    'cover',
                                    'plain',
                                    'thumb',
                                    'share',
                                    'netPermissions',
                                    'memberPermissions',
                                    'inviteUsersPermissions',
                                    'parentId',
                                    'mime'
                                ]))

                        })
                    }
                }
            else return { ok: false, warn: rc.warn };
        }
    }
    @get('/page/query/elementUrl')
    async pageQueryElementUrl(args: { ws?: LinkWs, elementUrl: string }) {
        var pe = parseElementUrl(args.elementUrl);
        switch (pe.type) {
            case ElementType.PageItem:
            case ElementType.Room:
            case ElementType.Schema:
                var item = await channel.get('/page/query/info', { ws: args.ws, id: pe.id });
                return item
                break;
            case ElementType.SchemaView:
            case ElementType.SchemaRecordView:
                var schema = await TableSchema.loadTableSchema(pe.id, args.ws);
                var sv = schema ? schema.views.find(g => g.id == pe.id1) : undefined;
                return sv
                break;
            case ElementType.SchemaData:
                var schema = await TableSchema.loadTableSchema(pe.id, args.ws);
                var row = await schema.rowGet(pe.id1);
                if (row) {
                    return row;
                }
                break;
        }
    }
    @get('/page/allow')
    async pageAllow(args: { elementUrl: string }) {
        var pe = parseElementUrl(args.elementUrl);
        switch (pe.type) {
            case ElementType.PageItem:
            case ElementType.Room:
                return await findItemPermisson(surface, pe.id);
            case ElementType.Schema:
                if (surface.workspace.isOwner) return {
                    source: 'wsOwner',
                    permissions: getEditOwnPerssions()
                }
                var schema = await TableSchema.loadTableSchema(pe.id, surface.workspace);
                var rcs = itemIsPermissons(surface, schema, false) as { source: 'schema', data: Partial<TableSchema>, permissions: AtomPermission[] };
                if (rcs) {
                    rcs.source = 'schema'
                    rcs.data = lodash.pick(schema, ['id', 'icon', 'locker', 'sn', 'text', 'cover', 'share', 'netPermissions', 'memberPermissions', 'inviteUsersPermissions'])
                    return rcs;
                }
                return await findItemPermisson(surface, pe.id);
            case ElementType.SchemaRecordView:
                if (surface.workspace.isOwner) return {
                    source: 'wsOwner',
                    permissions: getEditOwnPerssions()
                }
                var schema = await TableSchema.loadTableSchema(pe.id, surface.workspace);
                var sv = schema.views.find(g => g.id == pe.id1);
                if (sv) {
                    var rc = itemIsPermissons(surface, sv, false) as { source: 'SchemaRecordView', data: Partial<TableSchemaView>, permissions: AtomPermission[] };
                    if (rc) {
                        rc.source = 'SchemaRecordView'
                        rc.data = sv as any;
                        return rc;
                    }
                    var rcs = itemIsPermissons(surface, schema, false) as { source: 'schema', data: Partial<TableSchema>, permissions: AtomPermission[] };
                    if (rcs) {
                        rcs.source = 'schema'
                        rcs.data = lodash.pick(schema, ['id', 'icon', 'locker', 'sn', 'text', 'cover', 'share', 'netPermissions', 'memberPermissions', 'inviteUsersPermissions'])
                        return rcs;
                    }
                    return await findItemPermisson(surface, pe.id);
                }
                break;
            case ElementType.SchemaData:
                if (surface.workspace.isOwner) return {
                    source: 'wsOwner',
                    permissions: getEditOwnPerssions()
                }
                var schema = await TableSchema.loadTableSchema(pe.id, surface.workspace);
                var row = await schema.rowGet(pe.id1);
                if (row) {
                    var rcg = itemIsPermissons(surface, row.config, false) as { source: 'SchemaData', data: Record<string, any>, permissions: AtomPermission[] };
                    if (rcg) {
                        rcg.source = 'SchemaData';
                        rcg.data = row;
                        return rcg;
                    }
                    var rcs = itemIsPermissons(surface, schema, false) as { source: 'schema', data: Partial<TableSchema>, permissions: AtomPermission[] };
                    if (rcs) {
                        rcs.source = 'schema'
                        rcs.data = lodash.pick(schema, ['id', 'icon', 'locker', 'sn', 'text', 'cover', 'share', 'netPermissions', 'memberPermissions', 'inviteUsersPermissions'])
                        return rcs;
                    }
                    return await findItemPermisson(surface, pe.id);
                }
                break;
            case ElementType.SchemaRecordViewData:
                if (surface.workspace.isOwner) return {
                    source: 'wsOwner',
                    permissions: getEditOwnPerssions()
                }
                var schema = await TableSchema.loadTableSchema(pe.id, surface.workspace);
                var row = await schema.rowGet(pe.id2);
                if (row) {
                    var rcg = itemIsPermissons(surface, row.config, false) as { source: 'SchemaData', data: Record<string, any>, permissions: AtomPermission[] };
                    if (rcg) {
                        rcg.source = 'SchemaData';
                        rcg.data = row;
                        return rcg;
                    }
                    var sv = schema.views.find(g => g.id == pe.id1);
                    if (sv) {
                        var rc = itemIsPermissons(surface, sv, false) as { source: 'SchemaRecordView', data: Partial<TableSchemaView>, permissions: AtomPermission[] };;
                        if (rc) {
                            rc.source = 'SchemaRecordView';
                            rc.data = sv;
                            return rc;
                        }
                    }
                    var rcs = itemIsPermissons(surface, schema, false) as { source: 'schema', data: Partial<TableSchema>, permissions: AtomPermission[] };
                    if (rcs) {
                        rcs.source = 'schema'
                        rcs.data = lodash.pick(schema, ['id', 'icon', 'locker', 'sn', 'text', 'cover', 'share', 'netPermissions', 'memberPermissions', 'inviteUsersPermissions'])
                        return rcs;
                    }
                    return await findItemPermisson(surface, pe.id);
                }
                break;
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
    @query('/current/page')
    queryPage() {
        return surface.supervisor?.page?.item
    }
    @get('/ws/create/object')
    async queryWorkspace(args: { wsId: string }) {
        if (surface.workspace?.id == args.wsId)
            return surface.workspace;
        else {
            var r = await channel.get('/ws/query', { name: args.wsId });
            if (r?.data.workspace) {
                var ws = new Workspace();
                ws.load({ ...r.data.workspace });
                if (r.data.workspace?.datasource == 'private-local') {
                    ws.pids = await getDeskLocalPids()
                }
                else if (Array.isArray(r.data.pids)) {
                    ws.pids = r.data.pids;
                }
                wss.setWsPids(ws.id, ws.pids);
                var g = await Workspace.getWsSock(ws.pids, 'ws', ws.id).get('/ws/access/info', { wsId: ws.id });
                if (g.data.accessForbidden) {
                    return
                }
                if (g.data.workspace) {
                    ws.load({ ...g.data.workspace });
                }
                if (Array.isArray(g.data.onlineUsers)) g.data.onlineUsers.forEach(u => ws.onLineUsers.add(u))
                ws.roles = g.data.roles || [];
                ws.member = g.data.member || null;
                var willPageItem = g.data.page as PageItem;
                if (ws.access == 0
                    &&
                    !ws.member
                    &&
                    willPageItem
                ) {
                    ws.load({ childs: [willPageItem] })
                }
                else {
                    await ws.onLoadPages();
                }
                return ws;
            }
        }
    }
    @air('/page/update/info')
    async pageUpdateInfo(args: { id?: string, elementUrl?: string, pageInfo: Partial<PageItem> }, options: { locationId?: string | number }) {
        var itemId;
        var pe = parseElementUrl(args.elementUrl);
        if (args.id) {
            itemId = args.id;
        }
        else if (args.elementUrl) {
            if ([ElementType.PageItem, ElementType.Schema, ElementType.Room].includes(pe.type)) {
                itemId = pe.id;
            }
        }
        if (itemId) {
            if (typeof args.pageInfo?.pageType != 'undefined') {
                if (args.pageInfo.pageType == PageLayoutType.db) {
                    args.pageInfo.mime = Mime.table;
                }
                else if (args.pageInfo?.pageType == PageLayoutType.textChannel) {
                    args.pageInfo.mime = Mime.chatroom
                }
            }
            var item = surface.workspace.find(g => g.id == itemId);
            var updateProps: string[] = ['icon',
                'cover',
                'text',
                'sourcePermission',
                'share',
                'netPermissions',
                'inviteUsersPermissions',
                'memberPermissions'];
            var updateDatas = lodash.pick(args.pageInfo, updateProps);
            if (!item) {
                await pageItemStore.updatePage(itemId, args.pageInfo);
                if (pe && pe.type == ElementType.Schema && Object.keys(updateDatas).length > 0) {
                    var ts = await TableSchema.loadTableSchema(itemId, surface.workspace);
                    await ts.update(updateDatas as any, options.locationId);
                }
            }
            else if (item) {
                if ((item.mime == Mime.table || item.pageType == PageLayoutType.db) && Object.keys(updateDatas).length > 0) {
                    var ts = await TableSchema.loadTableSchema(item.id, surface.workspace);
                    await ts.update(updateDatas as any, options.locationId);
                }
                await pageItemStore.updatePageItem(item, lodash.cloneDeep(args.pageInfo));
                item.onUpdateDocument();
            }
        }
        channel.fire('/page/update/info', args as any, options);
    }
    @act('/page/notify/toggle')
    async pageNotifyToggle(args: { id: string, visible: boolean }) {
        await yCache.set(
            yCache.resolve(CacheKey[CacheKey.ws_toggle_pages], surface.workspace.id),
            surface.workspace.getVisibleIds()
        );
    }
    @query('/page/recently/viewed')
    async pageLately(args: { wsId: string }) {
        if (!args?.wsId) args = { wsId: surface.workspace.id }
        var ids = await yCache.get(yCache.resolve(CacheKey[CacheKey.ws_toggle_pages], args.wsId));
        var items = surface.workspace.findAll(g => ids.includes(g.id));
        items = items.map(g => {
            if (g.mime == Mime.pages) {
                return g.childs
            }
            else return g;
        }).flat(3)
        return { items }
    }
    @query('/cache/get')
    async cacheGet(args: { key: string }) {
        return await yCache.get(args.key);
    }
    @act('/cache/set')
    async cacheSet(args: { key: string, value }) {
        return await yCache.set(args.key, args.value);
    }
    @act('/open/pay')
    async openPay() {
        await useSelectPayView('fill');
    }
    @act('/view/snap/store')
    async viewSnapStore(args: SnapDataType & { elementUrl: string }) {
        var ss = await SnapStore.createSnap(args.elementUrl);
        if (ss) {
            await ss.viewSnap({
                seq: args.seq,
                content: args.content,
                plain: args.plain,
                text: args.text,
                thumb: args.thumb,
                preview: args.preview

            }, { force: true });
        }
    }
    @act('/shy/share')
    async shyShare(args: { type: string, title: string, description?: string, pic?: string, url: string }) {
        if (args.type == 'weibo') {

        }
        else {
            var url = 'https://shy.live/redict?url=' + encodeURIComponent(args.url);
            // var url = args.url;
            var r = await masterSock.get('/wx/share', { url: url });
            JSON.stringify(r.data);
            //**配置微信信息**
            (window as any).wx.config(r.data);
            (window as any).wx.ready(function () {
                // 微信分享的数据
                var shareData = {
                    "imgUrl": args.pic ?? "https://static.shy.live/assert/img/shy.svg",
                    "link": url,
                    "desc": args.description,
                    "title": args.title,
                    success: function () {
                        // 分享成功可以做相应的数据处理
                        ShyAlert(lst('分享成功'))
                    }
                };
                // alert(JSON.stringify(shareData))
                // if (args.type == 'updateTimelineShareData') {
                //分享微信朋友圈
                (window as any).wx.updateTimelineShareData(shareData);
                // }
                // else {
                //分享给朋友
                (window as any).wx.updateAppMessageShareData(shareData);
                //}
            })
        }
    }
    @query('/query/my/wss')
    async queryWss(args: {}) {
        var list = surface.wss.findAll(g => g.owner && g.owner == surface.user.id || !g.owner && g.creater == surface.user.id);
        lodash.remove(list, g => g.id == surface.workspace.id)
        return { wss: list };
    }
    @act('/open/user/settings')
    async openUser() {
        await useOpenUserSettings();
    }
    @act('/open/workspace/settings')
    async openWorkspace() {
        await useLazyOpenWorkspaceSettings();
    }
    @act('/user/logout')
    async openLogout() {
        if (surface?.user) surface.user.logout()
    }
    @act('/user/exit/current/workspace')
    async userExitWorkspace() {
        await surface.exitWorkspace();
    }
    @act('/current/ws/remove/member')
    async wsRemoveMember(args: { userid: string }) {
        await channel.del('/ws/member/delete', {
            userid: args.userid
        })
        await masterSock.delete('/user/del/join/ws', {
            wsId: surface.workspace.id,
            userid: args.userid
        })
    }
    @act('/open/user/private/channel')
    async currentUserSend(args: { userid: string }) {
        UrlRoute.push(ShyUrl.me);
        if (surface.workspace) await surface.workspace.exitWorkspace();
        await userChannelStore.openUserChannel(args.userid);
    }
    @act('/current/page/copy')
    async currentPageCopy() {
        var item = surface.supervisor.page?.item;
        if (item) {
            await item.onCopy();
        }
    }
    @act('/current/page/move')
    async currentPageMove(args: { event: React.MouseEvent }) {
        var item = surface.supervisor.page?.item;
        if (item) {
            await item.onMove(args?.event?.target as HTMLElement);
        }
    }
    @act('/workspace/mode')
    async workspaceMode(args: { isApp: boolean }) {
        await surface.workspace.setMode(args.isApp)
    }
    @get('/current/page/preOrNext')
    async curentPagePreOrNext(args: { pageId: string }) {
        if (surface.workspace) {
            var item = surface.workspace.find(c => c.id == args.pageId);
            if (item) {
                var pre = surface.workspace.find(c => c.parentId == item.parentId && c.at < item.at);
                var next = surface.workspace.find(c => c.parentId == item.parentId && c.at > item.at);
                return { ok: true, data: { pre, next } }
            }
            else {
                var r = await surface.workspace.sock.get('/page/preOrNext', { wsId: surface.workspace.id, pageId: args.pageId });
                return r;
            }
        }
        else return { ok: false }
    }
}




