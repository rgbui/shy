import { observer } from "mobx-react-lite";
import React from "react";
import { DotsSvg, PlusSvg, TriangleSvg } from "rich/component/svgs";
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
            className={"relative flex gap-w-5 round padding-r-5 item-hover padding-h-3 " + (surface.sln.isDrag && surface.sln.hover?.item === item ? " shy-ws-item-page-drop-" + surface.sln.hover.direction : "")}>
            <div className={'flex-auto flex '}>
                <span onMouseDown={e =>{
                    if (e.nativeEvent.button == 2) return;
                    item.onSpread()
                }} className="f-12 round cursor flex">
                    <span className={" flex-fixed item-hover round text-1 size-12 flex-center ts " + (item.spread ? "angle-180 " : "angle-90 ")}><Icon size={6} icon={TriangleSvg}></Icon></span>
                    <span className="flex-fixed   text-overflow ">{item.text || lst("我的页面")}</span>
                    <span
                        className={"cursor visible  flex-center ts " + (item.spread ? " " : " angle-90-")}>
                        {item.willLoadSubs && <Spin size={16} ></Spin>}
                    </span>
                </span>
            </div>
            {isCanEdit && <div className='flex-fixed flex-end visible padding-r-5'>
                <span className="size-18  flex-center cursor item-hover round">
                    <Icon icon={DotsSvg} size={18} onMousedown={e => {
                        e.stopPropagation();
                        var el = e.currentTarget.parentNode.parentNode as HTMLElement;
                        el.classList.remove('visible');
                        item.onContextmenu(e.nativeEvent).then(() => {
                            el.classList.add('visible');
                        }).catch(() => {
                            el.classList.add('visible');
                        })
                    }}></Icon>
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

