
import { Page } from "rich/src/page";
import { PageDirective } from "rich/src/page/directive";
import { surface } from "../..";
import { PageItem } from "../../sln/item";
export async function createPageContent(item: PageItem) {
    if (!item.contentView) {
        var pd = await item.snapSync.querySnap();
        var page = new Page();
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
            var r = await item.snapSync.viewOperator(action);
            await item.snapSync.viewSnap(r.seq, await page.getFile());
        });
        page.on(PageDirective.error, error => {
            console.error(error);
        });
        page.on(PageDirective.save, async () => {
            await item.snapSync.forceSave();
        });
        await page.loadFile(pd.file)
        if (Array.isArray(pd.operates) && pd.operates.length > 0) await page.loadUserActions(pd.operates);
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