import React from "react";
import { Icon } from "rich/component/icon";
import { PageView } from "../view";
import { PageItemBox } from "./box";
import PageSvg from "../../../assert/svg/page.svg";
export class PageItemView extends PageView {
    async mousedown(event: MouseEvent) {
        var item = this.item;
        var target = event.target as HTMLElement;
        if (target.closest('.shy-ws-item-page-spread')) {
            item.onSpread();
        }
        else if (target.closest('.shy-ws-item-page-add')) {
            item.onAddAndEdit();
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
        if (event.button == 2) {
            item.onContextmenu(event);
        }
    }
    inputting(event: Event) {
        var input = event.target as HTMLInputElement;
        this.item.text = input.value.trim();
    }
    private editBeforeName: string;
    select() {
        var input = this.el.querySelector('.shy-ws-item-page input') as HTMLInputElement;
        if (input) {
            this.editBeforeName = this.item.text;
            input.focus();
            input.select();
        }
    }
    async blur() {
        if (this.editBeforeName != this.item.text) {
            if (!this.item.text) {
                this.item.text = this.editBeforeName;
            }
            else {
                this.item.onChange({ text: this.item.text }, true);
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
        return <div className='shy-ws-item'>
            <div className={'shy-ws-item-page' + (this.item.isSelected ? " shy-ws-item-page-selected" : "")}
                style={style}
                onContextMenu={e => self.contextmenu(e.nativeEvent)}
                onMouseUp={e => self.mousedown(e.nativeEvent)}>
                <Icon className='shy-ws-item-page-spread' icon={item.spread ? "arrow-down:sy" : 'arrow-right:sy'}></Icon>
                <i className='shy-ws-item-page-icon'><Icon size={18} icon={item.icon ? item.icon : PageSvg}></Icon></i>
                {!isInEdit && <span>{item.text}</span>}
                {isInEdit && <div className='shy-ws-item-page-input'><input type='text'
                    onBlur={e => this.blur()}
                    defaultValue={item.text}
                    onKeyDown={e => this.keydown(e.nativeEvent)}
                    onInput={e => self.inputting(e.nativeEvent)} /></div>}
                {!isInEdit && <div className='shy-ws-item-page-operators'>
                    <Icon className='shy-ws-item-page-property' icon='elipsis:sy'></Icon>
                    <Icon className='shy-ws-item-page-add' icon='add:sy'></Icon>
                </div>}
            </div>
            {item.willLoadSubs == true && <div className='shy-ws-item-page-loading'>...</div>}
            {item.spread != false && <PageItemBox items={item.childs || []} deep={(this.props.deep || 0) + 1}></PageItemBox>}
        </div>
    }
}
