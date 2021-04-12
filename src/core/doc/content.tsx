import React from "react";
import { SY } from "rich";
import ReactDOM from "react-dom";
import { PageItem } from "../workspace/item";
import { UserService } from "../../service/user";

export class DocView extends React.Component<{ item: PageItem }>{
    constructor(props) { super(props) }
    get item() {
        return this.props.item;
    }
    el: HTMLElement;
    async componentDidMount() {
        this.el = ReactDOM.findDOMNode(this) as HTMLElement;
        var pageData = await UserService.getPageData(this.item.id);
        var page = new SY.Page(this.el);
        page.on('blur', function (ev) {
            // console.log('blur', ev)
        });
        page.on('focus', function (ev) {
            //console.log('focus', ev);
        });
        page.on('focusAnchor', function (anchor) {
            // console.log('focusAnchor', anchor);
        });
        if (pageData) await page.load(pageData);
        await page.render();
    }
    render() {
        return <div className='sy-doc-view'></div>
    }
}