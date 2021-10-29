import React from "react";
import ReactDOM from "react-dom";
import { PageItem } from "..";
export class BasePageItemView extends React.Component<{ item: PageItem, deep?: number }>{
    constructor(props) {
        super(props);
    }
    get item() {
        return this.props.item;
    }
    el: HTMLElement;
    componentDidMount() {
        this.el = ReactDOM.findDOMNode(this) as HTMLElement;
    }
    componentWillUnmount() {

    }
}