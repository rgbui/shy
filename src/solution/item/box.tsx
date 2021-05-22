import React from "react";
import { PageItem } from ".";
import { PageItemView } from "./view";

export class PageItemBox extends React.Component<{ items: PageItem[], deep?: number }>{
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.items.length == 0) {
            var style: Record<string, any> = {};
            style.paddingLeft = 10 + ((this.props.deep || 0) + 1) * 15;
            return <div className='sy-ws-items'>
                <div className='sy-ws-item-empty' style={style}><span>没有子页面</span></div>
            </div>
        }
        return <div className='sy-ws-items'>{this.props.items.map(item => {
            return <PageItemView key={item.id} item={item} deep={this.props.deep}></PageItemView>
        })}</div>
    }
}