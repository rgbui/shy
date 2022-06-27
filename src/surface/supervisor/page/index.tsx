
import { ElementType } from "rich/net/element.type";
import { Rect } from "rich/src/common/vector/point";
import { Page } from "rich/src/page";
import { PageDirective } from "rich/src/page/directive";
import { surface } from "../..";
import { timService } from "../../../../net/primus";
import { SnapSync } from "../../../../services/snap/sync";
import { PageItem } from "../../sln/item";
export async function createPageContent(item: PageItem) {
    try {
        if (!item.contentView) {
            var pd = await item.snapSync.querySnap();
            var page = new Page();
            page.pageItemId = item.id;
            item.contentView = page;
            page.on(PageDirective.history, async function (action) {
                var syncBlocks = action.syncBlock();
                if (syncBlocks.length > 0) {
                    syncBlocks.eachAsync(async (block) => {
                        var snap = SnapSync.create(ElementType.Block, block.syncBlockId);
                        var r = await snap.viewOperator(action.get() as any);
                        await snap.viewSnap(r.seq, await block.getString());
                    })
                }
                else {
                    var r = await item.snapSync.viewOperator(action.get() as any);
                    await item.snapSync.viewSnap(r.seq, await page.getString());
                }
            });
            page.on(PageDirective.error, error => {
                console.error(error);
            });
            page.on(PageDirective.save, async () => {
                await item.snapSync.forceSave();
            });
            page.on(PageDirective.viewCursor, async (d) => {
                await timService.viewOperate(page.pageItemId, d);
            });
            page.on(PageDirective.rollup, async (id) => {
               var pd = await item.snapSync.rollupQuerySnap(id);
                if (pd?.content) {
                    await page.reload(pd.content);
                    page.forceUpdate();
                }
            })
            page.loadPageInfo({ url: item.url, locker: item.locker, icon: item.icon, id: item.id, sn: item.sn, text: item.text });
            await page.load(pd.content);
            if (Array.isArray(pd.operates) && pd.operates.length > 0) {
                var operates = pd.operates.map(op => op.operate ? op.operate : op) as any;
                await page.loadUserActions(operates, 'load');
            }
            var view = await surface.supervisor.getView();
            var subs = view.querySelectorAll('.shy-supervisor-view-page');
            if (subs.length > 0) {
                for (let i = 0; i < subs.length; i++) {
                    if (subs[i]) subs[i].remove();
                }
            }
            var el = view.appendChild(document.createElement('div'));
            el.classList.add('shy-supervisor-view-page');
            var bound = Rect.fromEle(view);
            page.render(el, { width: bound.width, height: bound.height });
        }
        else {
            var view = await surface.supervisor.getView();
            var subs = view.querySelectorAll('.shy-supervisor-view-page');
            if (subs.length > 0) {
                for (let i = 0; i < subs.length; i++) {
                    if (subs[i]) subs[i].remove();
                }
            }
            var bound = Rect.fromEle(view);
            item.contentView.renderFragment(view, { width: bound.width, height: bound.height });
        }
    }
    catch (ex) {
        console.log(ex);
    }
}