
import { ElementType } from "rich/net/element.type";
import { Page } from "rich/src/page";
import { PageDirective } from "rich/src/page/directive";
import { surface } from "../..";
import { SnapSync } from "../../../../services/snap/sync";
import { PageItem } from "../../sln/item";
export async function createPageContent(item: PageItem) {
    try {
        if (!item.contentView) {
            var pd = await item.snapSync.querySnap();
            var page = new Page();
            page.pageItemId = item.id;
            item.contentView = page;
            page.on(PageDirective.blur, function (ev) {
                // console.log('blur', ev)
            });
            page.on(PageDirective.focus, function (ev) {
                //console.log('focus', ev);
            });
            page.on(PageDirective.focusAnchor, function (anchor) {
                // console.log('focusAnchor', anchor);
            });
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
            page.loadPageInfo({ icon: item.icon, id: item.id, sn: item.sn, text: item.text });
            await page.load(pd.content);
            if (Array.isArray(pd.operates) && pd.operates.length > 0) {
                var operate = pd.operates.map(op => op.operate);
                await page.loadUserActions(operate);
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
            var bound = view.getBoundingClientRect();
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
            item.contentView.renderFragment(view);
        }
    }
    catch (ex) {
        console.log(ex);
    }
}