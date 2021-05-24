
import React from 'react';
import { createPortal } from 'react-dom';
import { Point } from 'rich/src/common/point';
import { Icon } from 'rich/src/component/icon';
import { SyPlugComponent } from "rich/src/plug/sy.plug.component"
import { PageItem } from '../item';
import { PageItemOperator } from '../item/operator.declare';
export type PageItemMenuType = {
    name: PageItemOperator,
    icon: string | SvgrComponent,
    text: string,
    label?: string,
    disabled?: boolean,
    childs?: PageItemMenuType[],
    type?: 'devide' | 'item' | 'text'
}
export class PageItemMenu extends SyPlugComponent {
    private node: HTMLElement;
    constructor(props) {
        super(props);
        //  记录参数 利用window.document
        const doc = window.document
        // 定义this.node 创建一个div节点
        this.node = doc.createElement("div")
        // 当前的body下挂载一个div节点
        doc.body.appendChild(this.node)
    }
    openItem(item: PageItem, event: MouseEvent) {
        this.currentItem = item;
        this.point = Point.from(event);
        this.visible = true;
        var items = this.currentItem.getPageItemMenus();
        this.items = items;
        this.forceUpdate();
    }

    private currentItem: PageItem;
    items: PageItemMenuType[] = [];
    visible: boolean = false;
    point: Point = new Point(0, 0);
    renderItem(item: PageItemMenuType) {
        return <div key={item.name} className='sy-ws-menu-item'>
            {item.type == 'devide' && <a className='sy-ws-menu-item-devide'></a>}
            {(item.type == 'item' || !item.type) && <a className={`sy-ws-menu-item-option ${item.disabled == true ? "disabled" : ""}`} onMouseDown={e => this.mousedownItem(item, e.nativeEvent)}>
                <Icon icon={item.icon}></Icon>
                <span>{item.text}</span>
                <label>{item.label}</label>
            </a>}
            {item.type == 'text' && <a className='sy-ws-menu-item-text'></a>}
        </div>
    }
    private mousedownCover(event: MouseEvent) {
        var target = event.target as HTMLElement;
        if (target && target.classList.contains('sy-ws-menu-cove')) {
            this.visible = false;
            this.forceUpdate();
        }
    }
    private mousedownItem(item: PageItemMenuType, event: MouseEvent) {
        try {
            this.emit('selectPageItemMenu', item, this.currentItem, event);
        }
        catch (ex) {

        }
        finally {
            this.visible = false;
            this.forceUpdate();
        }
    }
    render() {
        var style: Record<string, any> = {};
        style.top = this.point.y;
        style.left = this.point.x;
        return createPortal(
            <div className='sy-ws-menu'>
                {this.visible && <div className='sy-ws-menu-cove' onMouseDown={e => this.mousedownCover(e.nativeEvent)} >
                    <div className='sy-ws-menu-box' style={style}>
                        <div className='sy-ws-menu-box-content'>{this.items.map(item => this.renderItem(item))}</div>
                    </div>
                </div>}
            </div>
            , this.node);
    } // 在willUnmount中实现订阅和取消订阅
    componentWillUnmount() {
        // 删除this.node
        window.document.body.removeChild(this.node)
    }
}




