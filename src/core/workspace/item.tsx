import React from "react";
import ReactDOM from "react-dom";
import { Icon } from "rich/src/component/icon";
import { util } from "rich/src/util/util";
import { surface } from "../../view/surface";
import { eventBus } from "../event/event.bus";
import { EventName } from "../event/event.name";
import { Mime } from "./item.mine";
import { WorkspaceModule } from "./module";

export class PageItem {
    id: string;
    childs?: PageItem[];
    text: string;
    spread?: boolean;
    view?: WorkspaceItemView;
    module: WorkspaceModule;
    mime: Mime;
    /***
     * 用户设置的路径
     */
    uri: string;
    get path() {
        if (this.uri) return this.uri;
        else return '/' + this.id;
    }
    get url() {
        return this.workspace.url + this.path;
    }
    get workspace() {
        return this.module.workspace;
    }
    parent?: PageItem;
    load(data) {
        for (var n in data) {
            if (n == 'childs') {
                this.childs = [];
                data.childs.each(child => {
                    var item = new PageItem();
                    item.parent = this;
                    item.module = this.module;
                    item.load(child);
                    this.childs.push(item);
                });
            }
            else {
                this[n] = data[n];
            }
        }
    }
    onSpread(spread?: boolean) {
        var sp = typeof spread != 'undefined' ? spread : this.spread;
        this.spread = sp == false ? true : false;
        if (this.view)
            this.view.forceUpdate();
        else console.error('not found item view when spread')
    }
    onAdd() {
        var item = new PageItem();
        item.id = util.guid();
        item.text = '新页面';
        item.mime = Mime.page;
        item.module = this.module;
        item.spread = false;
        this.spread = true;
        if (!Array.isArray(this.childs)) this.childs = [];
        this.childs.insertAt(0, item);
        if (this.view) this.view.forceUpdate();
        else console.error('not found item view when add child')
    }
    onOpenProperty(event: MouseEvent) {
        surface.pageItemMenuView.openItem(this, event);
    }
    onMousedown(event: MouseEvent) {
        eventBus.emit(EventName.selectPageItem, this, event);
    }
}

export class WorkspaceItemView extends React.Component<{ item: PageItem, deep?: number }> {
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
            item.onOpenProperty(event);
        }
        else {
            item.onMousedown(event);
        }
    }
    inputName(event: Event) {
        var input = event.target as HTMLInputElement;
        if (input.value) {
            this.item.text = input.value;
        }
    }
    inputBlur(event: Event) {
        surface.onCancelRenameItem()
    }
    contextmenu(event: MouseEvent) {
        event.preventDefault();
        this.item.onOpenProperty(event);
    }
    render() {
        var self = this;
        var item = this.props.item;
        var style: Record<string, any> = {};
        style.paddingLeft = 10 + (this.props.deep || 0) * 15;
        return <div className='sy-ws-item'>
            <div className='sy-ws-item-page' style={style} onContextMenu={e => self.contextmenu(e.nativeEvent)} onMouseDown={e => self.mousedown(e.nativeEvent)}>
                <Icon className='sy-ws-item-page-spread' icon={item.spread ? "arrow-down:sy" : 'arrow-right:sy'}></Icon>
                {surface.renameItem !== item && <span>{item.text}</span>}
                {surface.renameItem === item && <div className='sy-ws-item-page-input'><input type='text' onBlur={e => this.inputBlur(e.nativeEvent)} value={item.text} onInput={e => self.inputName(e.nativeEvent)} /></div>}
                <div className='sy-ws-item-page-operators'>
                    <Icon className='sy-ws-item-page-property' icon='elipsis:sy'></Icon>
                    <Icon className='sy-ws-item-page-add' icon='add:sy'></Icon>
                </div>
            </div>
            {item.spread != false && <WorkspaceItemBox items={item.childs || []} deep={(this.props.deep || 0) + 1}></WorkspaceItemBox>}
        </div>
    }
}
export class WorkspaceItemBox extends React.Component<{ items: PageItem[], deep?: number }>{
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.items.length == 0) {
            var style: Record<string, any> = {};
            style.paddingLeft = 10 + ((this.props.deep || 0) + 1) * 15;
            return <div className='sy-ws-items'>
                <div className='sy-ws-item-empty' style={style}><span>没有子页面</span></div>
            </div>
        }
        return <div className='sy-ws-items'>{this.props.items.map(item => {
            return <WorkspaceItemView key={item.id} item={item} deep={this.props.deep}></WorkspaceItemView>
        })}</div>
    }
}