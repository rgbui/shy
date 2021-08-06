import React from "react";
import { Icon } from "rich/component/icon";
import { PageView } from "../view";
import { PageItemBox } from "./box";
import PageSvg from "../../../assert/svg/page.svg";
export class PageItemView extends PageView {
    async mousedown(event: MouseEvent) {
        var item = this.item;
        var target = event.target as HTMLElement;
        if (target.closest('.sy-ws-item-page-spread')) {
            item.onSpread();
        }
        else if (target.closest('.sy-ws-item-page-add')) {
            item.onAdd();
        }
        else if (target.closest('.sy-ws-item-page-property')) {
            item.onContextmenu(event);
            return;
        }
        else if (target.closest('.sy-ws-item-page-icon')) {
            await item.onChangeIcon(event);
            return;
        }
        else {
            item.onMousedownItem(event);
        }
        if (event.button == 2) {
            item.onContextmenu(event);
        }
    }
    inputName(event: Event) {
        var input = event.target as HTMLInputElement;
        this.item.text = input.value.trim();
    }
    private lastName: string;
    select() {
        var input = this.el.querySelector('.sy-ws-item-page input') as HTMLInputElement;
        if (input) {
            this.lastName = this.item.text;
            input.focus();
            input.select();
        }
    }
    async blur() {
        if (this.lastName != this.item.text) {
            if (!this.item.text) {
                this.item.text = this.lastName;
            }
            else {
                this.item.onUpdate({ text: this.item.text });
            }
        }
        this.item.onExitEdit();
    }
    contextmenu(event: MouseEvent) {
        event.preventDefault();
        // this.item.onContextmenu(event);
    }
    async keydown(event: KeyboardEvent) {
        if (event.code == 'Enter') {
            await this.blur()
        }
    }
    render() {
        var self = this;
        var item = this.props.item;
        var style: Record<string, any> = {};
        style.paddingLeft = 10 + (this.props.deep || 0) * 15;
        var isInEdit = this.item.isInEdit;
        return <div className='sy-ws-item'>
            <div className={'sy-ws-item-page' + (this.item.isSelected ? " sy-ws-item-page-selected" : "")}
                style={style}
                onContextMenu={e => self.contextmenu(e.nativeEvent)}
                onMouseUp={e => self.mousedown(e.nativeEvent)}>
                <Icon className='sy-ws-item-page-spread' icon={item.spread ? "arrow-down:sy" : 'arrow-right:sy'}></Icon>
                <i className='sy-ws-item-page-icon'><Icon size={18} icon={item.icon ? item.icon : PageSvg}></Icon></i>
                {!isInEdit && <span>{item.text}</span>}
                {isInEdit && <div className='sy-ws-item-page-input'><input type='text'
                    onBlur={e => this.blur()}
                    defaultValue={item.text}
                    onKeyDown={e => this.keydown(e.nativeEvent)}
                    onInput={e => self.inputName(e.nativeEvent)} /></div>}
                {!isInEdit && <div className='sy-ws-item-page-operators'>
                    <Icon className='sy-ws-item-page-property' icon='elipsis:sy'></Icon>
                    <Icon className='sy-ws-item-page-add' icon='add:sy'></Icon>
                </div>}
            </div>
            {item.willLoadSubs == true && <div className='sy-ws-item-page-loading'>...</div>}
            {item.spread != false && <PageItemBox items={item.childs || []} deep={(this.props.deep || 0) + 1}></PageItemBox>}
        </div>
    }
}
