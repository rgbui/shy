import { observer } from "mobx-react-lite";
import React from "react";
import { ChevronDownSvg, DotsSvg, PlusSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { PageItem } from "..";
import { PageItemBox } from "../view/box";
import { Spin } from "rich/component/view/spin";
import { surface } from "../../../store";
import { lst } from "rich/i18n/store";

export var PagesView = observer(function (props: { item: PageItem, deep?: number }) {
    var item = props.item;
    var isCanEdit = item.isCanEdit;
    function renderHead() {
        var gap = 30;
        return <div
            onContextMenu={e => {
                if (!isCanEdit) return;
                e.preventDefault();
                item.onContextmenu(e.nativeEvent)
            }}
            onMouseDown={e => {
                if (e.nativeEvent.button == 2) return
                item.onMousedownItem(e.nativeEvent)
            }}
            style={{ '--gap-left': gap + 'px' } as any}
            className={"relative flex padding-w-10 padding-b-3 " + (surface.sln.isDrag && surface.sln.hover?.item === item ? " shy-ws-item-page-drop-" + surface.sln.hover.direction : "")}>
            <div className={'flex-auto flex '}>
                <span onMouseDown={e => {
                    // e.stopPropagation();
                    if (e.nativeEvent.button == 2) return;
                    item.onSpread()
                }} className="f-12 remark padding-l-4 round cursor flex">
                    <span>{item.text || lst("我的页面")}</span>
                    <span
                        className={"cursor visible  flex-center ts " + (item.spread ? " " : " angle-90-")}>
                        {item.willLoadSubs && <Spin></Spin>}
                        {!item.willLoadSubs && <Icon size={14} icon={ChevronDownSvg}></Icon>}
                    </span>
                </span>
            </div>
            {isCanEdit && <div className='flex-fixed flex-end visible padding-r-5'>
                <span className="size-18 flex-center cursor item-hover round">
                    <Icon icon={DotsSvg} size={18} onMousedown={e => { e.stopPropagation(); item.onContextmenu(e.nativeEvent) }}></Icon>
                </span>
                <span className="size-18 flex-center cursor item-hover round">
                    <Icon icon={PlusSvg} size={18} onMousedown={e => { e.stopPropagation(); item.onAdd() }}></Icon>
                </span>
            </div>}
        </div>
    }
    return <div key={item.id} data-id={item.id} className="shy-ws-pages-item visible-hover padding-b-10">
        {renderHead()}
        <PageItemBox style={{ display: item.spread != false ? "block" : "none" }} items={item.childs || []} deep={(props.deep || 0) + 1}></PageItemBox>
    </div>
})

