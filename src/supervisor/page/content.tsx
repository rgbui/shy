import React from "react";
import ReactDOM from "react-dom";
import { PageItem } from "../../sln/item";
import { surface } from "../../surface";
import { Page } from "rich/src/page";
import { workspaceService } from "../../workspace/service";
import { PageDirective } from "rich/src/page/directive";
export class DocView extends React.Component<{ item: PageItem }>{
    constructor(props) { super(props) }
    get item() {
        return this.props.item;
    }
    el: HTMLElement;
    page: Page;
    async componentDidMount() {
        var self = this;
        this.el = ReactDOM.findDOMNode(this) as HTMLElement;
        var pageData = await workspaceService.loadPageContent(this.item.id);
        var page = new Page(this.el, {
            user: surface.user
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
            var _pagedata = await page.get();
            await workspaceService.savePageContent(self.item.id, _pagedata);
        });
        page.on(PageDirective.createDefaultTableSchema, async (data) => {
            var r = await workspaceService.createDefaultTableSchema(data);
            return r;
        });
        page.on(PageDirective.loadTableSchemaData, async (schemaId: string, options) => {
            var r = await workspaceService.loadTableSchemaData(schemaId, options);
            return r;
        });
        page.on(PageDirective.loadTableSchema, async (schemaId: string) => {
            var r = await workspaceService.loadTableSchema(schemaId);
            return r;
        });
        page.on(PageDirective.error, error => {
            console.error(error);
        });
        page.on(PageDirective.loadPageInfo, async () => {
            return { text: self.item.text, icon: self.item.icon, id: self.item.id };
        });
        await page.load(pageData);
        await page.render();
    }
    async componentWillUnmount() {
        //https://www.jianshu.com/p/7648c6f30d1e
        if (this.page) this.page.onUnmount();
    }
    render() {
        return <div className='sy-doc-view'></div>
    }
}