import React from "react";
import { Icon } from "rich/component/view/icon";
import { PageItemBox } from "../view/box";
import { observer } from "mobx-react";
import { PageItem } from "..";
import { surface } from "../../../store";
import { AtomPermission } from "rich/src/page/permission";
import { getPageIcon, getPageText } from "rich/extensions/at/declare";
import { DotNumber } from "rich/component/view/dot";
import { ChevronDownSvg, ChevronRightSvg, DotSvg, DotsSvg, PlusSvg } from "rich/component/svgs";
import { Mime } from "../../declare";

export var PageItemView = observer(function (props: { item: PageItem, deep?: number }) {
    let refInput = React.useRef<HTMLInputElement>(null);
    let refEditText = React.useRef<string>(null);
    var item = props.item;
    var style: Record<string, any> = {};
    style.paddingLeft = 0 + (props.deep || 0) * 15;
    var isInEdit = item.id == surface.sln.editId;
    var isCanEdit = item.isAllow(AtomPermission.docEdit, AtomPermission.channelEdit, AtomPermission.dbEdit);
    var isCanPlus = [Mime.table, Mime.chatroom, Mime.blog].includes(item.mime) ? false : true;
    var isSelected = surface.sln.selectIds.some(s => s == item.id);
    var isDragOver = surface.sln.isDrag && surface.sln.hoverId == item.id && !surface.sln.dragIds.some(s => s == props.item.id);

    async function mousedown(event: MouseEvent) {
        var target = event.target as HTMLElement;
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
        if (item.isAllow(AtomPermission.docEdit)) {
            event.preventDefault();
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
    return <div className='shy-ws-item' data-at={props.item.at} >
        <div className={'shy-ws-item-page flex gap-w-5 min-h-28 round relative cursor' + (isSelected ? " shy-ws-item-page-selected" : "") + (isDragOver ? " shy-ws-item-page-dragover" : "")}
            style={style}
            onMouseEnter={e => surface.sln.hoverId = props.item.id}
            onMouseLeave={e => surface.sln.hoverId = ''}
            onContextMenu={e => contextmenu(e.nativeEvent)}
            onMouseDown={e => mousedown(e.nativeEvent)}>
            <span className={"size-20 round item-hover flex-center flex-fixed shy-ws-item-page-spread ts " + (item.spread ? " " : " angle-90-")}>
                {item.subCount > 0 && <Icon size={16} icon={ChevronDownSvg}></Icon>}
                {item.subCount == 0 && <Icon size={16} icon={DotSvg}></Icon>}
            </span>
            <i className='shy-ws-item-page-icon flex-fixed size-20 item-hover round-3 flex-center gap-r-5 '><Icon size={16} icon={getPageIcon(item)}></Icon></i>
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
        {item.willLoadSubs == true && <div className='shy-ws-item-page-loading'>...</div>}
        {item.spread != false && <PageItemBox items={item.childs || []} deep={(props.deep || 0) + 1}></PageItemBox>}
    </div>
})
