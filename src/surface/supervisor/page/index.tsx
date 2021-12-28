import { FieldType } from "rich/blocks/table-store/schema/field.type";
import { Page } from "rich/src/page";
import { PageDirective } from "rich/src/page/directive";
import { surface } from "../..";
import { schemaService } from "../../../../services/schema";
import { PageItem } from "../../sln/item";
export async function createPageContent(item: PageItem) {
    if (!item.contentView) {
        var pd = await item.store.getPageContent();
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
            await item.store.saveHistory(action);
            await item.store.savePageContent(action, await page.getFile());
        });

        // schemaLoad,
        // schemaCreate,
        // schemaCreateField,
        // schemaRemoveField,
        // schemaTurnTypeField,
        // schemaUpdateField,

        // schemaTableLoad,
        // schemaTableLoadAll,
        // schemaInsertRow,
        // schemaUpdateRow,
        // schemaDeleteRow,

        page.on(PageDirective.schemaCreate, async (data) => {
            data.workspaceId = surface.workspace.id;
            var r = await schemaService.create(surface.workspace.sock, data as any);
            return r;
        });
        page.on(PageDirective.schemaLoad, async (schemaId: string) => {
            var r = await schemaService.load(surface.workspace.sock, schemaId);
            return r;
        });
        page.on(PageDirective.schemaCreateField, async (schemaId: string, options: { text: string, type: any }) => {
            var r = await schemaService.addField(surface.workspace.sock, schemaId, options);
            return r.field;
        })
        page.on(PageDirective.schemaRemoveField, async (schemaId: string, fieldId: string) => {
            return await schemaService.removeField(surface.workspace.sock, schemaId, fieldId);
        })
        page.on(PageDirective.schemaUpdateField, async (schemaId: string, fieldId: string, data) => {
            return await schemaService.updateField(surface.workspace.sock, schemaId, fieldId, data);
        })
        page.on(PageDirective.schemaTurnTypeField, async (schemaId: string, fieldId: string, type: FieldType) => {
            return await schemaService.turnField(surface.workspace.sock, schemaId, fieldId, type);
        });

        page.on(PageDirective.schemaTableLoad, async (schemaId: string, options) => {
            var r = await schemaService.tableQuery(surface.workspace.sock, schemaId, options);
            return r;
        });
        page.on(PageDirective.schemaTableLoadAll, async (schemaId: string, options) => {
            var r = await schemaService.tableAllQuery(surface.workspace.sock, schemaId, options);
            return r;
        });

        page.on(PageDirective.schemaInsertRow, async (schemaId: string, data, pos) => {
            var r = await schemaService.tableInsertRow(surface.workspace.sock, schemaId, data, pos);
            return r as any;
        });
        page.on(PageDirective.schemaDeleteRow, async (schemaId: string, id) => {
            var r = await schemaService.tableRemoveRow(surface.workspace.sock, schemaId, id);
            return r;
        });
        page.on(PageDirective.schemaUpdateRow, async (schemaId: string, id, data) => {
            var r = await schemaService.tableUpdateRow(surface.workspace.sock, schemaId, id, data);
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