import React from "react";
import { Icon } from "rich/component/view/icon";
import { PageItemBox } from "../view/box";
import { observer } from "mobx-react";
import { PageItem } from "..";
import { surface } from "../../../store";
import { DotNumber } from "rich/component/view/dot";
import { ChevronDownSvg, DotSvg, DotsSvg, PlusSvg } from "rich/component/svgs";
import { Mime } from "../../declare";
import { Spin } from "rich/component/view/spin";
import { getPageIcon, getPageText } from "rich/src/page/declare";

export var PageItemView = observer(function (props: { item: PageItem, deep?: number }) {
    let refInput = React.useRef<HTMLInputElement>(null);
    let refEditText = React.useRef<string>(null);
    var item = props.item;
    var gapLeft = 0 + (props.deep || 0) * 15
    var style: Record<string, any> = {};
    style.paddingLeft = gapLeft;
    style['--gap-left'] = (gapLeft + 20) + 'px';
    var isInEdit = item.id == surface.sln.editId;
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
            item.onAdd();
        }
        else if (target.closest('.shy-ws-item-page-property')) {
            item.onContextmenu(event);
            return;
        }
        else if (target.closest('.shy-ws-item-page-icon')) {
            await item.onChangeIcon(event);
            return;
        }
        else {
            item.onMousedownItem(event);
        }
    }
    function inputting(event: Event) {
        var input = event.target as HTMLInputElement;
        item.text = input.value.trim();
    }
    function contextmenu(event: MouseEvent) {
        event.preventDefault();
        if (isCanEdit) {
            item.onContextmenu(event);
        }
    }
    async function keydown(event: KeyboardEvent) {
        if (event.code == 'Enter') {
            await blur()
        }
    }
    function blur() {
        item.onExitEditAndSave(item.text, refEditText.current);
    }
    React.useEffect(() => {
        if (isInEdit) {
            refEditText.current = item.text;
        }
        if (refInput.current && isInEdit) {
            refInput.current.focus();
        }
    }, [isInEdit])
    function renderItem() {
        return <div className={'shy-ws-item-page flex gap-w-10 min-h-28 round relative cursor  ' + (isSelected ? " shy-ws-item-page-selected" : "") + (surface.sln.isDrag && surface.sln.hover?.item === item ? " shy-ws-item-page-drop-" + surface.sln.hover.direction : "")}
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
            <span className={"size-20 round flex-center flex-fixed shy-ws-item-page-spread ts " + (item.spread ? " " : " angle-90-") + (false ? (" visible" + (item.subCount == 0 ? '' : " item-hover")) : " item-hover")}>
                {item.willLoadSubs && <Spin></Spin>}
                {!item.willLoadSubs && (item.subCount > 0 || item.childs.length > 0) && <Icon size={18} icon={ChevronDownSvg}></Icon>}
                {!item.willLoadSubs && !((item.subCount > 0 || item.childs.length > 0)) && !surface?.workspace?.isPubSite && <Icon size={16} icon={DotSvg}></Icon>}
            </span>
            <i className='shy-ws-item-page-icon flex-fixed size-20 item-hover round-3 flex-center gap-r-5 '><Icon size={18} icon={surface.workspace.allowSlnIcon ? getPageIcon({ pageType: item.pageType }) : getPageIcon(item)}></Icon></i>
            {!isInEdit && <span className="text-overflow flex-auto h-20 l-20 padding-r-10">{getPageText(item)}</span>}
            {isInEdit && isCanEdit && <div className='shy-ws-item-page-input'><input type='text'
                onBlur={blur}
                ref={e => refInput.current = e}
                defaultValue={item.text}
                onKeyDown={e => keydown(e.nativeEvent)}
                onInput={e => inputting(e.nativeEvent)} /></div>}
            {!isInEdit && <div className='shy-ws-item-page-operators'>
                {isCanEdit && <><Icon className='shy-ws-item-page-property' size={18} icon={DotsSvg}></Icon>
                    {isCanPlus && <Icon className='shy-ws-item-page-add' size={18} icon={PlusSvg}></Icon>}</>}
                {item.unreadChats.length > 0 && <span className="unread size-24 flex-center"><DotNumber arrow="none" count={item.unreadChats.length}></DotNumber></span>}
            </div>}
        </div>
    }
    return <div className='shy-ws-item' data-id={props.item.id} data-at={props.item.at} >
        {renderItem()}
        {item.spread != false && <PageItemBox items={item.childs || []} deep={(props.deep || 0) + 1}></PageItemBox>}
    </div>
})
