import React from "react";
import ReactDOM from "react-dom";
import { Icon } from "rich/src/component/icon";
import { PageItem } from ".";
import { PageItemBox } from "./box";

export class PageItemView extends React.Component<{ item: PageItem, deep?: number }> {
    constructor(props) {
        super(props);
        this.props.item.view = this;
    }
    get item() {
        return this.props.item;
    }
    el: HTMLElement;
    componentDidMount() {
        this.el = ReactDOM.findDOMNode(this) as HTMLElement;
    }
    mousedown(event: MouseEvent) {
        var item = this.item;
        var target = event.target as HTMLElement;
        if (target.classList.contains('sy-ws-item-page-spread')) {
            item.onSpread();
        }
        else if (target.classList.contains('sy-ws-item-page-add')) {
            item.onAdd();
        }
        else if (target.classList.contains('sy-ws-item-page-property')) {
            item.onContextmenu(event);
        }
        else {
            item.onMousedownItem(event);
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
        this.item.onContextmenu(event);
    }
    async keydown(event: KeyboardEvent) {
        if (event.code == 'Enter') {
            await this.blur()
        }
    }
    render() {
        var self = this;
        var item = this.props.item;
        var style:Record<string, any> = {};
        style.paddingLeft = 10 + (this.props.deep || 0) * 15;
        var isInEdit = this.item.isInEdit;
        return <div className='sy-ws-item'>
            <div className={'sy-ws-item-page' + (this.item.isSelected ? " sy-ws-item-page-selected" : "")}
                style={style}
                onContextMenu={e => self.contextmenu(e.nativeEvent)}
                onMouseDown={e => self.mousedown(e.nativeEvent)}>
                <Icon className='sy-ws-item-page-spread' icon={item.spread ? "arrow-down:sy" : 'arrow-right:sy'}></Icon>
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
            {item.willLoadSubs == true && <div className='sy-ws-item-page-loaddding'>...</div>}
            {item.spread != false && <PageItemBox items={item.childs || []} deep={(this.props.deep || 0) + 1}></PageItemBox>}
        </div>
    }
}
