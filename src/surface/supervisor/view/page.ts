
import { Rect } from "rich/src/common/vector/point";
import { Page } from "rich/src/page";
import { PageLayoutType } from "rich/src/page/declare";
import { PageDirective } from "rich/src/page/directive";
import { timService } from "../../../../net/primus";
import { SnapStore } from "../../../../services/snap/store";
import { PageViewStore } from "./store";
export async function createPageContent(store: PageViewStore) {
    try {
        if (!store.page) {
            var pd = await store.snapStore.querySnap();
            var page = new Page();
            store.page = page;
            if (store.item) page.pageInfo = store.item;
            page.on(PageDirective.history, async function (action) {
                var syncBlocks = action.syncBlock();
                if (syncBlocks.length > 0) {
                    syncBlocks.eachAsync(async (block) => {
                        var snap = SnapStore.createSnap(block.elementUrl)
                        var r = await snap.viewOperator(action.get() as any);
                        await snap.viewSnap(r.seq, await block.getString());
                    })
                }
                else {
                    var r = await store.snapStore.viewOperator(action.get() as any);
                    await store.snapStore.viewSnap(r.seq, await page.getString(), await page.getPlain(), store.item.text);
                }
            });
            page.on(PageDirective.error, error => {
                console.error(error);
            });
            page.on(PageDirective.save, async () => {
                await store.snapStore.forceSave();
            });
            page.on(PageDirective.viewCursor, async (d) => {
                await timService.viewOperate(page.pageInfo?.id, d);
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
                await page.loadUserActions(operates, 'load');
            }
            var bound = Rect.fromEle(store.view.pageEl);
            page.render(store.view.pageEl, { width: bound.width, height: bound.height });
        }
        else {
            var bound = Rect.fromEle(store.view.pageEl);
            store.page.renderFragment(store.view.pageEl, { width: bound.width, height: bound.height });
        }
    }
    catch (ex) {
        console.log(ex);
    }
}