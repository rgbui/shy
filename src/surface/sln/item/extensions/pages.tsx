import { observer } from "mobx-react-lite";
import React from "react";
import { PlusSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { AtomPermission } from "rich/src/page/permission";
import { PageItem } from "..";
import { PageItemBox } from "../view/box";
import { Spin } from "rich/component/view/spin";

export var PagesView = observer(function (props: { item: PageItem, deep?: number }) {
    var item = props.item;
    return <div key={item.id} className="visible-hover gap-b-10">
        <div onContextMenu={e => {
            e.preventDefault();
            item.onContextmenu(e.nativeEvent)
        }}
            onMouseDown={e => item.onMousedownItem(e.nativeEvent)}
            className="shy-ws-pages flex padding-w-10 gap-b-3">
            <div className='shy-ws-pages-head flex-auto' onMouseDown={e => item.onSpread()}>
                <span className="item-hover f-12 remark padding-w-2 padding-h-2 round cursor">{item.text || "我的页面"}</span>
            </div>
            {item.isAllow(AtomPermission.dbEdit, AtomPermission.docEdit, AtomPermission.channelEdit) && <div className='flex-fixed flex-end visible'>
                <span className="size-20 flex-center cursor item-hover round">
                    <Icon icon={PlusSvg} size={18} onMousedown={e => { e.stopPropagation(); item.onAdd() }}></Icon>
                </span>
            </div>}
        </div>
        {item.willLoadSubs == true && <div className='shy-ws-item-page-loading'><Spin></Spin></div>}
        <PageItemBox style={{ display: item.spread != false ? "block" : "none" }} items={item.childs || []} deep={(props.deep || 0) + 1}></PageItemBox>
    </div>
})

