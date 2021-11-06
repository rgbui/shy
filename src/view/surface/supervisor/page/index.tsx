
import React from 'react';
import { Page } from 'rich/src/page';
import { PageDirective } from 'rich/src/page/directive';
import { PageItem } from '../../sln/item';
import { surface } from '../..';
import { workspaceService } from '../../../../../services/workspace';
export class DocPage extends React.Component<{ item: PageItem }>{
    constructor(props) { super(props) }
    get item() {
        return this.props.item;
    }
    el: HTMLElement;
    page: Page;
    async componentDidMount() {
        var self = this;
        var pd = await self.item.store.getPageContent();
        var page = new Page(this.el, {
            user: surface.user as any
        });
        this.page = page;
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
            await self.item.store.saveHistory(action);
            await self.item.store.savePageContent(action, await page.getFile());
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
            return { text: self.item.text, icon: self.item.icon, id: self.item.id };
        });
        page.on(PageDirective.save, async () => {
            await self.item.store.forceStorePageContent();
        });
        await page.loadFile(pd.file)
        if (Array.isArray(pd.actions) && pd.actions.length > 0) await page.loadUserActions(pd.actions);
        page.render();
    }
    async componentWillUnmount() {
        //https://www.jianshu.com/p/7648c6f30d1e
        if (this.page) this.page.onUnmount();
    }
    render() {
        return <div className='shy-supervisor-view-page' ref={e => this.el = e}></div>
    }
}