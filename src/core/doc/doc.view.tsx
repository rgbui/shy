import React from "react";
import { PageData } from "../../model/page";
import { SY } from "rich";
import ReactDOM from "react-dom";

export class DocView extends React.Component<{ pageData: PageData }>{
    constructor(props) { super(props) }
    get pageData() {
        return this.props.pageData;
    }
    el: HTMLElement;
    async componentDidMount() {
        this.el = ReactDOM.findDOMNode(this) as HTMLElement;
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
        await page.load(this.pageData.data);
        await page.render();
    }
    render() {
        return <div className='sy-doc-view'></div>
    }
}