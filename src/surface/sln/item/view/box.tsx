import { observer } from "mobx-react";
import React, { CSSProperties } from "react";
import { PageItem } from "..";
import { surface } from "../../../app/store";
export var PageItemBox = observer(function (props: { items: PageItem[], style?: CSSProperties, deep?: number }) {
    if (props.items.length == 0) {
        return <></>
    }
    return <div style={props.style || {}} className='shy-ws-items'>{props.items.map(item => {
        var View = surface.sln.getMimeViewComponent(item.mime);
        return <View key={item.id} item={item} deep={props.deep}></View>
    })}</div>
})
