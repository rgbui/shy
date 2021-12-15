import { observer } from "mobx-react-lite";
import React from "react";
import { Icon } from "rich/component/view/icon";
import { PageItem } from "..";


import { PageItemBox } from "../view/box";
export var PagesView = observer(function (props: { item: PageItem, deep?: number }) {
    var item = props.item;
    return <div className='shy-ws-pages' key={item.id}>
        <div className='shy-ws-pages-head'>
            <span onMouseDown={e => item.onSpread()}>{item.text || "我的页面"}</span>
        </div>
        <div className='shy-ws-pages-operators'>
            <Icon icon='add:sy' mousedown={e => item.onAddAndEdit()}></Icon>
        </div>
        {item.willLoadSubs == true && <div className='shy-ws-item-page-loading'>...</div>}
        <PageItemBox style={{ display: item.spread != false ? "block" : "none" }} items={item.childs || []} deep={(props.deep || 0) + 1}></PageItemBox>
    </div>
})

