import { Page } from "rich/src/page";
import { PageDirective } from "rich/src/page/directive";
import { surface } from "../..";
import { workspaceService } from "../../../../services/workspace";
import { PageItem } from "../../sln/item";
export async function createPageContent(item: PageItem) {
    if (!item.contentView) {
        var pd = await item.store.getPageContent();
        var page = new Page({
            user: surface.user as any
        });
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
            await item.store.saveHistory(action);
            await item.store.savePageContent(action, await page.getFile());
        });
        page.on(PageDirective.createDefaultTableSchema, async (data) => {
            var r = await workspaceService.createDefaultTableSchema(surface.workspace.sock, data);
            return r;
        });
        page.on(PageDirective.loadTableSchemaData, async (schemaId: string, options) => {
            var r = await workspaceService.loadTableSchemaData(surface.workspace.sock, schemaId, options);
            return r;
        });
        page.on(PageDirective.loadTableSchema, async (schemaId: string) => {
            var r = await workspaceService.loadTableSchema(surface.workspace.sock, schemaId);
            return r;
        });
        page.on(PageDirective.error, error => {
            console.error(error);
        });
        page.on(PageDirective.loadPageInfo, async () => {
            return { text: item.text, icon: item.icon, id: item.id };
        });
        page.on(PageDirective.save, async () => {
            await item.store.forceStorePageContent();
        });
        await page.loadFile(pd.file)
        if (Array.isArray(pd.actions) && pd.actions.length > 0) await page.loadUserActions(pd.actions);
        var view = await surface.supervisor.getView();
        var subs = view.querySelectorAll('.shy-supervisor-view-page');
        if (subs.length > 0) {
            for (let i = 0; i < subs.length; i++) {
                if (subs[i]) subs[i].remove();
            }
        }
        var el = view.appendChild(document.createElement('div'));
        el.classList.add('shy-supervisor-view-page');
        var bound = el.getBoundingClientRect();
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