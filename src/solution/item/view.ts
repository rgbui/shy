import React from "react";
import ReactDOM from "react-dom";
import { PageItem } from ".";

export class PageView extends React.Component<{ item: PageItem, deep?: number }>{
    constructor(props) {
        super(props);
        this.props.item.view = this;
    }
    get item() {
        return this.props.item;
    }
    el: HTMLElement;
    componentDidMount() {
        this.el = ReactDOM.findDOMNode(this) as HTMLElement;
    }
}