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
    get solution() {
        return this.item.solution;
    }
    el: HTMLElement;
    componentDidMount() {
        this.el = ReactDOM.findDOMNode(this) as HTMLElement;
    }
    componentWillUnmount() {

    }
    componentDidUpdate() {
        var input = this.el.querySelector('.sy-ws-item-page input') as HTMLInputElement;
        if (input) {
            setTimeout(() => {
                input.focus();
                input.select();
            }, 100);
        }
    }
    mousedown(event: MouseEvent) {
        var item = this.props.item;
        var target = event.target as HTMLElement;
        if (target.classList.contains('sy-ws-item-page-spread')) {
            item.onSpread();
        }
        else if (target.classList.contains('sy-ws-item-page-add')) {
            item.onAdd();
        }
        else if (target.classList.contains('sy-ws-item-page-property')) {
            this.item.solution.onOpenItemMenu(this.item, event);
        }
        else {
            this.item.solution.onMousedownItem(this.item, event);
        }
    }
    inputName(event: Event) {
        var input = event.target as HTMLInputElement;
        if (input.value) {
            this.item.text = input.value;
        }
    }
    inputBlur(event: Event) {
        //surface.onCancelRenameItem()
    }
    contextmenu(event: MouseEvent) {
        event.preventDefault();
        this.item.solution.onOpenItemMenu(this.item, event);
    }
    render() {
        var self = this;
        var item = this.props.item;
        var style: Record<string, any> = {};
        style.paddingLeft = 10 + (this.props.deep || 0) * 15;
        return <div className='sy-ws-item'>
            <div className={'sy-ws-item-page' + (this.solution.selectItems.exists(g => g == item) ? " sy-ws-item-page-selected" : "")} style={style} onContextMenu={e => self.contextmenu(e.nativeEvent)} onMouseDown={e => self.mousedown(e.nativeEvent)}>
                <Icon className='sy-ws-item-page-spread' icon={item.spread ? "arrow-down:sy" : 'arrow-right:sy'}></Icon>
                {this.solution.editItem !== item && <span>{item.text}</span>}
                {this.solution.editItem === item && <div className='sy-ws-item-page-input'><input type='text'
                    onBlur={e => this.inputBlur(e.nativeEvent)}
                    value={item.text}
                    onInput={e => self.inputName(e.nativeEvent)} /></div>}
                <div className='sy-ws-item-page-operators'>
                    <Icon className='sy-ws-item-page-property' icon='elipsis:sy'></Icon>
                    <Icon className='sy-ws-item-page-add' icon='add:sy'></Icon>
                </div>
            </div>
            {item.spread != false && <PageItemBox items={item.childs || []} deep={(this.props.deep || 0) + 1}></PageItemBox>}
        </div>
    }
}
