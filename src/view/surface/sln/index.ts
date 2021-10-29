import { Events } from "rich/util/events";
import { KeyboardPlate } from "rich/src/common/keys";
import { PageItem } from "./item";

import { SlnView } from "./view";
import { currentParams, SyHistory } from "../../history";
import { CacheKey, yCache } from "../../../../net/cache";
import { generatePath } from "react-router";
import { surface } from "..";

import { useSelectMenuItem } from "rich/component/view/menu";
import { Point } from "rich/src/common/point";
import { messageChannel } from "rich/util/bus/event.bus";
import { Directive } from "rich/util/bus/directive";
import { SlnDirective, Mime } from "./declare";
import { PagesView } from "./item/extensions/pages";
import { PageItemView } from "./item/extensions/view";
import { BasePageItemView } from "./item/view/base";

export class Sln extends Events<SlnDirective> {
    constructor() {
        super();
    }
    /**
     * 当前选择的
     */
    selectItems: PageItem[] = [];
    /**
     * 当前正在编辑名称的pageItem
     */
    editItem: PageItem;
    keyboardPlate = new KeyboardPlate();
    async onOpenItemMenu(item: PageItem, event: MouseEvent) {
        var menuItem = await useSelectMenuItem({ roundPoint: Point.from(event) }, item.getPageItemMenus());
        if (menuItem) {
            item.onContextmenuClickItem(menuItem.item, menuItem.event);
        }
    }
    onMousedownItem(item: PageItem, event: MouseEvent) {
        messageChannel.fire(Directive.OpenPageItem, item);
    }
    onFocusItem(item: PageItem) {
        if (!this.selectItems.exists(g => g === item)) {
            item.selectedDate = new Date().getTime();
            var lastItems = this.selectItems.map(o => o);
            this.selectItems = [item];
            // lastItems.each(item => item?.view?.forceUpdate())
            // if (item.view) item.view.forceUpdate();
            this.emit(SlnDirective.openItem, this.selectItems[0]);
        }
        else {
            item.selectedDate = new Date().getTime();
        }
    }
    onEditItem(item: PageItem) {
        // var lastEditItem: PageItem;
        // if (this.editItem && this.editItem != item) {
        //     lastEditItem = this.editItem;
        // }
        // if (item) {
        //     this.editItem = item;
        //     this.editItem.view.forceUpdate(() => {
        //         (this.editItem.view as any).select();
        //     })
        // }
        // else this.editItem = null;
        // if (lastEditItem) {
        //     lastEditItem.view.forceUpdate();
        // }
    }
    getMimeViewComponent(mime: Mime): typeof BasePageItemView {
        switch (mime) {
            case Mime.page:
                return PageItemView;
            case Mime.pages:
                return PagesView;
            default:
                return PageItemView;
        }
    }
}
export interface Sln {
    on(name: SlnDirective.openItem, fn: (item: PageItem) => void);
    emit(name: SlnDirective.openItem, item: PageItem);

    emit(name: SlnDirective.addSubPageItem, item: PageItem);
    emitAsync(name: SlnDirective.addSubPageItem, item: PageItem): Promise<void>;
    on(name: SlnDirective.addSubPageItem, fn: (item: PageItem) => Promise<void>);

    emit(name: SlnDirective.removePageItem, item: PageItem);
    on(name: SlnDirective.removePageItem, fn: (item: PageItem) => void);
    emit(name: SlnDirective.updatePageItem, item: PageItem);
    on(name: SlnDirective.updatePageItem, fn: (item: PageItem) => void);
    emit(name: SlnDirective.togglePageItem, item: PageItem);
    on(name: SlnDirective.togglePageItem, fn: (item: PageItem) => void);
}