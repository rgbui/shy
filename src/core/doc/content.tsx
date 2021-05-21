import React from "react";
import { SY } from "rich";
import ReactDOM from "react-dom";
import { PageItem } from "../workspace/item";
import { surface } from "../../view/surface";
import { DataStore } from "../../service/store";
import { Page } from "rich/src/page";

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
        var pageData = await DataStore.getPageData(this.item.id);
        var page = new SY.Page(this.el, {
            user: surface.user
        });
        this.page = page;
        page.on('blur', function (ev) {
            // console.log('blur', ev)
        });
        page.on('focus', function (ev) {
            //console.log('focus', ev);
        });
        page.on('focusAnchor', function (anchor) {
            // console.log('focusAnchor', anchor);
        });
        page.on('history', async function (action) {
            var _pagedata = await page.get();
            await DataStore.savePageData(self.item.id, _pagedata);
        });
        await page.load(pageData);
        await page.render();
    }
    async componentWillUnmount() {
        //https://www.jianshu.com/p/7648c6f30d1e
        this.page.onUnmount();
    }
    render() {
        return <div className='sy-doc-view'></div>
    }
}