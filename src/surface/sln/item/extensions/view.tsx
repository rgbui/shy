import React from "react";
import { Icon } from "rich/component/view/icon";
import { PageItemBox } from "../view/box";
import { observer } from "mobx-react";
import { PageItem } from "..";
import { surface } from "../../../app/store";
import { DotNumber } from "rich/component/view/dot";
import { ChevronDownSvg, DotSvg, DotsSvg, PlusSvg } from "rich/component/svgs";
import { Mime } from "../../declare";
import { Spin } from "rich/component/view/spin";
import { getPageIcon, getPageText } from "rich/src/page/declare";
import { Tip } from "rich/component/view/tooltip/tip";

export var PageItemView = observer(function (props: { item: PageItem, deep?: number }) {
    var item = props.item;
    var paddingLeft = 5 + (props.deep || 0) * 15
    var style: Record<string, any> = {};
    style.paddingLeft = paddingLeft;
    style['--gap-left'] = (paddingLeft + 20) + 'px';
    var isCanEdit = item.isCanEdit;
    var isCanPlus = [Mime.table, Mime.chatroom].includes(item.mime) ? false : true;
    if (!isCanEdit) isCanPlus = false;
    var isSelected = surface.sln.selectIds.some(s => s == item.id);
    async function mousedown(event: MouseEvent) {
        if (event.button == 2) return;
        var target = event.target as HTMLElement;
        if (!isCanEdit) {
            if (target.closest('.shy-ws-item-page-spread')) {
                item.onSpread();
            }
            else item.onMousedownItem(event)
            return;
        }
        if (target.closest('.shy-ws-item-page-spread')) {
            item.onSpread();
        }
        else if (target.closest('.shy-ws-item-page-add')) {
            var te = target.closest('.visible') as HTMLElement
            te.classList.remove('visible');
            try { await item.onAdd(); }
            catch (e) { }
            finally {
                te.classList.add('visible');
            }
        }
        else if (target.closest('.shy-ws-item-page-property')) {
            var te = target.closest('.visible') as HTMLElement
            te.classList.remove('visible');
            try { await item.onContextmenu(event); }
            catch (e) { }
            finally {
                te.classList.add('visible');
            }
        }
        else if (target.closest('.shy-ws-item-page-icon')) {
            await item.onChangeIcon(event);
            return;
        }
        else {
            item.onMousedownItem(event);
        }
    }
    function contextmenu(event: MouseEvent) {
        event.preventDefault();
        if (isCanEdit) {
            item.onContextmenu(event);
        }
    }
    function renderItem() {
        return <div className={'shy-ws-item-page visible-hover flex gap-w-5 padding-r-5 min-h-28 round relative cursor  ' + (isSelected ? " shy-ws-item-page-selected" : "") + (surface.sln.isDrag && surface.sln.hover?.item === item ? " shy-ws-item-page-drop-" + surface.sln.hover.direction : "")}
            style={style}
            onContextMenu={e => {
                e.preventDefault()
                contextmenu(e.nativeEvent)
                return false;
            }}
            onMouseDown={e => {
                mousedown(e.nativeEvent)
            }}
        >
            <span className={"size-20 round flex-center  flex-fixed shy-ws-item-page-spread ts " + (item.spread ? " " : " angle-90-")+(!item.willLoadSubs && (item.subCount > 0 || item.childs.length > 0)?" item-hover":"") + (false ? (" visible" + (item.subCount == 0 ? '' : " ")) : " ")}>
                {item.willLoadSubs && <Spin></Spin>}
                {!item.willLoadSubs && (item.subCount > 0 || item.childs.length > 0) && <Icon className={'remark'} size={16} icon={ChevronDownSvg}></Icon>}
                {!item.willLoadSubs && !((item.subCount > 0 || item.childs.length > 0)) && !surface?.workspace?.isPubSite && <Icon className={'remark'} size={16} icon={DotSvg}></Icon>}
            </span>
            <i className='shy-ws-item-page-icon flex-fixed size-20 item-hover  round-3 flex-center gap-r-5 '><Icon  size={18} icon={surface.workspace.allowSlnIcon ? getPageIcon(item) : getPageIcon({ pageType: item.pageType })}></Icon></i>
            {<span className="text-overflow flex-auto h-20 l-20 padding-r-10  ">{getPageText(item)}</span>}
            {<div className='shy-ws-item-page-operators  visible'>
                {isCanEdit && <><Tip text='删除、复制及更多操作'><Icon className='shy-ws-item-page-property remark'  size={18} icon={DotsSvg}></Icon></Tip>
                    {isCanPlus && <Tip text='快速新建子页面'><Icon className='shy-ws-item-page-add remark' size={18} icon={PlusSvg}></Icon></Tip>}</>}
                {item.unreadChats.length > 0 && <span className="unread size-24 flex-center"><DotNumber arrow="none" count={item.unreadChats.length}></DotNumber></span>}
            </div>}
        </div>
    }
    return <div className='shy-ws-item' data-id={props.item.id} data-at={props.item.at} >
        {renderItem()}
        {item.spread != false && <PageItemBox items={item.childs || []} deep={(props.deep || 0) + 1}></PageItemBox>}
    </div>
})
