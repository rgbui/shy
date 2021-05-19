import React from "react";
import { SY } from "rich";
import ReactDOM from "react-dom";
import { PageItem } from "../workspace/item";
import { surface } from "../../view/surface";
import { DataStore } from "../../service/store";

export class DocView extends React.Component<{ item: PageItem }>{
    constructor(props) { super(props) }
    get item() {
        return this.props.item;
    }
    el: HTMLElement;
    async componentDidMount() {
        var self = this;
        this.el = ReactDOM.findDOMNode(this) as HTMLElement;
        var pageData = await DataStore.getPageData(this.item.id);
        var page = new SY.Page(this.el, {
            user: surface.user
        });
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
            console.log(_pagedata);
            DataStore.savePageData(self.item.id, _pagedata);
        });
        await page.load(pageData);
        await page.render();
    }
    render() {
        return <div className='sy-doc-view'></div>
    }
}