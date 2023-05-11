
import lodash from "lodash";
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

export async function createPageContent(store: PageViewStore) {
    try {
        if (!store.page) {
            var pd = await store.snapStore.querySnap((await store.canEdit()) ? false : true);
            var page = new Page();
            page.canEdit = await store.canEdit();
            page.openSource = store.source;
            page.customElementUrl = store.elementUrl;
            store.page = page;
            if (store.config?.type) store.page.pageLayout = { type: store.config.type };
            else {
                if ([ElementType.SchemaRecordView, ElementType.SchemaRecordViewData].includes(store.pe.type)) {
                    store.page.pageLayout = { type: PageLayoutType.dbForm };
                }
                else if (store.pe.type == ElementType.SchemaFieldBlogData) {
                    page.pageLayout = { type: PageLayoutType.blog };
                    page.customElementUrl = store.elementUrl;
                    page.requireSelectLayout = false;
                }
            }
            if (store.item) {
                // page.permissons = store.item.getPagePermissions();
                page.pageInfo = store.item;
                if (store.item.mime == Mime.table) {
                    page.pageLayout = { type: PageLayoutType.db };
                    page.requireSelectLayout = false;
                }
            }
            if (store.pe.type == ElementType.SchemaRecordView) {
                if (store.config.isTemplate)
                    page.recordViewTemplate = true;
            }
            if (store.pe.type == ElementType.SchemaFieldBlogData) {
                var rf = (await store.getSchemaRowField());
                var blogPageItem = await surface.workspace.loadOtherPage(rf?.id, {
                    mime: Mime.blog,
                    pageType: PageLayoutType.blog,
                    parentId: 'blog'
                });
                if (blogPageItem) {
                    if (rf?.id !== blogPageItem.id) {
                        await store.storeRowFieldContent(blogPageItem.get());
                    }
                }
                store.cachePageItem = blogPageItem;
                page.pageInfo = store.item;
            };
            page.on(PageDirective.history, async function (action) {
                var syncBlock = action.syncBlock;
                if (syncBlock) {
                    var snap = SnapStore.createSnap(syncBlock.elementUrl)
                    var r = await snap.viewOperator(action.get() as any);
                    await snap.viewSnap({ seq: r.seq, content: await syncBlock.getSyncString() });
                }
                else {
                    var r = await store.snapStore.viewOperator(action.get() as any);
                    await store.snapStore.viewSnap({
                        seq: r.seq,
                        content: await page.getString(),
                        plain: await page.getPlain(),
                        text: store.item?.text
                    });
                }
            });
            page.on(PageDirective.syncHistory, async (seq) => {
                await store.snapStore.viewSnap({
                    seq: seq,
                    content: await page.getString(),
                    plain: await page.getPlain(),
                    text: store.item?.text
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
            await page.load(pd.content);
            if (Array.isArray(pd.operates) && pd.operates.length > 0) {
                var operates = pd.operates.map(op => op.operate ? op.operate : op) as any;
                await page.onSyncUserActions(operates, 'load');
                var seq = operates.max(o => o.seq);
                var op = operates.find(g => g.seq == seq);
                page.on(PageDirective.mounted, async () => {
                    await store.snapStore.viewSnap({
                        seq: seq,
                        content: await page.getString(),
                        plain: await page.getPlain(),
                        text: store.item?.text,
                        force: true,
                        creater: op.creater
                    });
                })
            }
            if ([ElementType.SchemaRecordView, ElementType.SchemaRecordViewData].includes(store.pe.type)) {
                await page.loadSchemaView(store.elementUrl);
            }
            var bound = Rect.fromEle(store.view.pageEl);
            page.render(store.view.pageEl, {
                width: bound.width,
                height: bound.height
            });
        }
        else {
            var bound = Rect.fromEle(store.view.pageEl);
            store.page.renderFragment(store.view.pageEl, { width: bound.width, height: bound.height });
            if ([ElementType.SchemaRecordView, ElementType.SchemaRecordViewData].includes(store.pe.type)) {
                await store.page.loadSchemaView(store.elementUrl);
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