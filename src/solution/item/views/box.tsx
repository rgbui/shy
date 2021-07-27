import React, { CSSProperties } from "react";
import { PageItem } from "..";
import { getMimeViewComponent } from "../mime";
export class PageItemBox extends React.Component<{ items: PageItem[], style?: CSSProperties, deep?: number }>{
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.items.length == 0) {
            var style: Record<string, any> = {};
            style.paddingLeft = 10 + ((this.props.deep || 0) + 1) * 15;
            return <div style={this.props.style || {}} className='sy-ws-items'>
                <div className='sy-ws-item-empty' style={style}><span>没有子页面</span></div>
            </div>
        }
        return <div style={this.props.style || {}} className='sy-ws-items'>{this.props.items.map(item => {
            var View = getMimeViewComponent(item.mime);
            return <View ref={e=>item.view=e} key={item.id} item={item} deep={this.props.deep}></View>
        })}</div>
    }
}