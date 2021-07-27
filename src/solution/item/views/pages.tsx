import React from "react";
import { Icon } from "rich/component/icon";
import { PageView } from "../view";
import { PageItemBox } from "./box";
export class PagesView extends PageView {
    render() {
        var item = this.props.item;
        return <div className='sy-ws-pages' key={item.id}>
            <div className='sy-ws-pages-head'>
                <span onMouseDown={e => item.onSpread()}>{item.text || "我的页面"}</span>
            </div>
            <div className='sy-ws-pages-operators'>
                <Icon icon='add:sy' mousedown={e => item.onAdd()}></Icon>
            </div>
            {item.willLoadSubs == true && <div className='sy-ws-item-page-loading'>...</div>}
            {item.spread != false && <PageItemBox items={item.childs || []} deep={(this.props.deep || 0) + 1}></PageItemBox>}
        </div>
    }
}
