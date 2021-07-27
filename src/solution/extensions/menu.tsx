
import React from 'react';
import { createPortal } from 'react-dom';
import { Point, Rect, RectUtility } from 'rich/src/common/point';
import { Icon } from 'rich/component/icon';
import { SyExtensionsComponent } from "rich/extensions/sy.component"
import { PageItem } from '../item';
import { PageItemDirective } from '../item/operator';
export type PageItemMenuType = {
    name?: PageItemDirective,
    icon?: string | SvgrComponent,
    text?: string,
    label?: string,
    disabled?: boolean,
    childs?: PageItemMenuType[],
    type?: 'devide' | 'item' | 'text'
}
export class PageItemMenu extends SyExtensionsComponent<{}, string> {
    private node: HTMLElement;
    constructor(props) {
        super(props);
        this.node = document.body.appendChild(document.createElement('div'))
    }
    openItem(item: PageItem, event: MouseEvent) {
        this.currentItem = item;
        this.point = Point.from(event);
        this.visible = true;
        var items = this.currentItem.getPageItemMenus();
        this.items = items;
        this.forceUpdate(() => {
            if (this.boxEl) {
                var bound = this.boxEl.getBoundingClientRect();
                var newPoint = RectUtility.getChildRectPositionInRect(this.point, Rect.from(bound))
                if (!this.point.equal(newPoint)) {
                    this.point = newPoint;
                    this.forceUpdate()
                }
            }
        });
    }
    private currentItem: PageItem;
    items: PageItemMenuType[] = [];
    visible: boolean = false;
    point: Point = new Point(0, 0);
    private mousedownCover(event: MouseEvent) {
        var target = event.target as HTMLElement;
        if (target && target.classList.contains('sy-ws-menu-cove')) {
            this.visible = false;
            this.forceUpdate();
        }
    }
    private mousedownItem(item: PageItemMenuType, event: MouseEvent) {
        try {
            this.currentItem.onMenuClickItem(item, event);
        }
        catch (ex) {

        }
        finally {
            this.visible = false;
            this.forceUpdate();
        }
    }
    renderItem(item: PageItemMenuType, at: number) {
        return <div key={at} className='sy-ws-menu-item'>
            {item.type == 'devide' && <a className='sy-ws-menu-item-devide'></a>}
            {(item.type == 'item' || !item.type) && <a className={`sy-ws-menu-item-option ${item.disabled == true ? "disabled" : ""}`} onMouseUp={e => this.mousedownItem(item, e.nativeEvent)}>
                <Icon icon={item.icon} size={17}></Icon>
                <span>{item.text}</span>
                <label>{item.label}</label>
            </a>}
            {item.type == 'text' && <a className='sy-ws-menu-item-text'><span>{item.text}</span></a>}
        </div>
    }
    private boxEl: HTMLElement;
    render() {
        var style: Record<string, any> = {};
        style.top = this.point.y;
        style.left = this.point.x;
        return createPortal(
            <div className='sy-ws-menu'>
                {this.visible && <div className='sy-ws-menu-cove' onMouseUp={e => this.mousedownCover(e.nativeEvent)} >
                    <div className='sy-ws-menu-box' ref={e => this.boxEl = e} style={style}>
                        <div className='sy-ws-menu-box-content'>{this.items.map((item, index) => this.renderItem(item, index))}</div>
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




