import { observer } from "mobx-react";
import React, { CSSProperties } from "react";
import { PageItem } from "..";
import { surface } from "../../..";
export var PageItemBox = observer(function (props: { items: PageItem[], style?: CSSProperties, deep?: number }) {
    if (props.items.length == 0) {
        var style: Record<string, any> = {};
        style.paddingLeft = 0 + ((props.deep || 0) + 1) * 15;
        return <div style={props.style || {}} className='shy-ws-items'>
            <div className='shy-ws-item-empty' style={style}><span>没有子页面</span></div>
        </div>
    }
    return <div style={props.style || {}} className='shy-ws-items'>{props.items.map(item => {
        var View = surface.sln.getMimeViewComponent(item.mime);
        return <View key={item.id} item={item} deep={props.deep}></View>
    })}</div>
})
