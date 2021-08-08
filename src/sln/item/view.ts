import React from "react";
import ReactDOM from "react-dom";
import { PageItem } from ".";
export class PageView extends React.Component<{ item: PageItem, deep?: number }>{
    constructor(props) {
        super(props);
        // this.item.view = this;
    }
    get item() {
        return this.props.item;
    }
    el: HTMLElement;
    componentDidMount() {
        this.el = ReactDOM.findDOMNode(this) as HTMLElement;
        // console.log('mount', this.item, this);
    }
    componentWillUnmount() {
        // delete this.el;
        // delete this.item.view;
        // console.log('unmount')
    }
}