
import lodash from "lodash";
import { ElementType } from "rich/net/element.type";
import { Rect } from "rich/src/common/vector/point";
import { Page } from "rich/src/page";
import { PageLayoutType } from "rich/src/page/declare";
import { PageDirective } from "rich/src/page/directive";
import { surface } from "../..";
import { SnapStore } from "../../../../services/snap/store";
import { Mime } from "../../sln/declare";
import { PageViewStore } from "./store";

export async function createPageContent(store: PageViewStore) {
    try {
        if (!store.page) {
            var pd = await store.snapStore.querySnap();
            var page = new Page();
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
            if (store.item) page.pageInfo = store.item;
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
            }
            page.on(PageDirective.history, async function (action) {
                var syncBlock = action.syncBlock;
                if (syncBlock) {
                    var snap = SnapStore.createSnap(syncBlock.elementUrl)
                    var r = await snap.viewOperator(action.get() as any);
                    await snap.viewSnap(r.seq, await syncBlock.getSyncString());
                }
                else {
                    var r = await store.snapStore.viewOperator(action.get() as any);
                    await store.snapStore.viewSnap(r.seq, await page.getString(), await page.getPlain(), store.item?.text);
                }
            });
            page.on(PageDirective.error, error => {
                console.error(error);
            });
            page.on(PageDirective.save, async () => {
                await store.snapStore.forceSave();
            });
            if (store.item && [PageLayoutType.board].includes(store.item.pageType)) {
                page.on(PageDirective.rollup, async (id) => {
                    var pd = await store.snapStore.rollupQuerySnap(id);
                    if (pd?.content) {
                        await page.reload(pd.content);
                        page.forceUpdate();
                    }
                });
            }
            await page.load(pd.content);
            if (Array.isArray(pd.operates) && pd.operates.length > 0) {
                var operates = pd.operates.map(op => op.operate ? op.operate : op) as any;
                await page.syncUserActions(operates, 'load');
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
        }
        if (store.page?.pageLayout?.type == PageLayoutType.textChannel) {
            var ws = surface.wss.find(g => g.id == surface.workspace?.id);
            if (ws) {
                lodash.remove(ws.unreadChats, c => c.roomId == store.item.id);
            }
        }
    }
    catch (ex) {
        console.log(ex);
    }
}