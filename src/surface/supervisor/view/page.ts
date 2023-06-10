
import lodash, { chain } from "lodash";
import { ElementType } from "rich/net/element.type";
import { Rect } from "rich/src/common/vector/point";
import { Page } from "rich/src/page";
import { PageLayoutType } from "rich/src/page/declare";
import { PageDirective } from "rich/src/page/directive";
import { surface } from "../../store";
import { SnapStore } from "../../../../services/snap/store";
import { Mime } from "../../sln/declare";
import { PageViewStore } from "./store";
import { log } from "../../../../common/log";
import { channel } from "rich/net/channel";
export async function createPageContent(store: PageViewStore) {
    try {
        if (!store.page) {
            var pd = await store.snapStore.querySnap((await store.canEdit()) ? false : true);
            var page = new Page();
            page.canEdit = await store.canEdit();
            page.openSource = store.source;
            page.isSchemaRecordViewTemplate = store.config.isTemplate;
            page.customElementUrl = store.elementUrl;
            store.page = page;
            if (store.config?.type) store.page.pageLayout = { type: store.config.type }
            if (store.item) {
                // page.permissons = store.item.getPagePermissions();
                page.pageInfo = store.item;
                if (store.item.mime == Mime.table) {
                    page.pageLayout = { type: PageLayoutType.db };
                    page.requireSelectLayout = false;
                }
            }
            page.on(PageDirective.history, async function (action) {
                if (!page.canEdit) return;
                // console.log('action', action, 'syncBlocks');
                if (Array.isArray(action.syncBlocks))
                    for (var syncBlock of action.syncBlocks) {
                        var snap = SnapStore.createSnap(syncBlock.elementUrl)
                        var r = await snap.viewOperator(action.get() as any);
                        await snap.viewSnap({
                            seq: r.seq,
                            content: await syncBlock.getSyncString()
                        });
                    }
                if (action.syncPage) {
                    var r = await store.snapStore.viewOperator(action.get() as any);
                    await store.snapStore.viewSnap({
                        seq: r.seq,
                        content: await page.getString(),
                        plain: await page.getPlain(),
                        text: store.item?.text,
                        thumb: await page.getThumb(),
                    });
                }
            });
            page.on(PageDirective.syncHistory, async (data) => {
                await store.snapStore.viewSnap({
                    content: await page.getString(),
                    plain: await page.getPlain(),
                    text: store.item?.text,
                    thumb: await page.getThumb(),
                    ...data,
                });
            })
            page.on(PageDirective.changePageLayout, async () => {
                store.updateElementUrl(store.item.elementUrl);
            })
            page.on(PageDirective.error, error => {
                console.error(error);
                log.error(error);
            });
            page.on(PageDirective.save, async () => {
                if (!page.canEdit) return;
                var syncBlocks = page.findAll(g => g.syncBlockId ? true : false);
                for (let i = 0; i < syncBlocks.length; i++) {
                    if (syncBlocks[i].elementUrl) {
                        try {
                            var snap = SnapStore.createSnap(syncBlocks[i].elementUrl);
                            await snap.forceSave();
                        }
                        catch (ex) {
                            console.error(ex);
                        }
                    }
                }
                await store.snapStore.forceSave();
            });
            page.on(PageDirective.blur, async () => {
                if (store.source == 'slide')
                    store.emit('close');
            });
            page.on(PageDirective.close, async () => {
                store.emit('close');
            });
            page.on(PageDirective.spreadSln, async () => {
                surface.slnSpread = true;
            });
            page.on(PageDirective.rollup, async (id) => {
                var pd = await store.snapStore.rollupSnap(id);
                if (pd?.content) {
                    await page.reload(pd.content);
                    page.forceUpdate();
                }
            });
            page.on(PageDirective.reload, async () => {
                page.onUnmount();
                delete store.page;
                createPageContent(store);
            })
            page.on(PageDirective.back, async () => {
                var r = surface.supervisor.elementUrls.findLast(g => g.elementUrl !== page.elementUrl && g.source == 'page');
                if (r) {
                    channel.air('/page/open', { elementUrl: r.elementUrl })
                }
            })
            page.on(PageDirective.mounted, async () => {
                if (store.config.blockId) {
                    var b = page.find(g => g.id == store.config.blockId);
                    if (b) {
                        page.onHighlightBlock([b], true);
                    }
                }
            })
            await page.load(pd.content, pd.operates);
            var bound = Rect.fromEle(store.view.pageEl);
            page.render(store.view.pageEl, {
                width: bound.width,
                height: bound.height
            });
        }
        else {
            var bound = Rect.fromEle(store.view.pageEl);
            store.page.renderFragment(store.view.pageEl, { width: bound.width, height: bound.height });
            if ([ElementType.SchemaRecordView, ElementType.SchemaData].includes(store.pe.type)) {
                await store.page.loadPageSchema();
            }
            if (store.config.blockId) {
                var b = store.page.find(g => g.id == store.config.blockId);
                if (b) store.page.onHighlightBlock([b], true);
            }
        }
        if (store.page?.pageLayout?.type == PageLayoutType.textChannel) {
            var ws = surface.wss.find(g => g.id == surface.workspace?.id);
            if (ws) {
                lodash.remove(ws.unreadChats, c => c.roomId == store.item.id);
                store.item.unreadChats = [];
            }
        }
    }
    catch (ex) {
        console.log(ex);
    }
}