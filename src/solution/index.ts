import { Events } from "rich/src/util/events";
import { KeyboardPlate } from "rich/src/common/keys";
import { PageItemMenu } from "./extensions/menu";
import { PageItem } from "./item";
import { Workarea } from "./workarea";
import { SolutionDirective } from "./operator";
import { SolutionView } from "./view";
export class Solution extends Events<SolutionDirective> {
    constructor() {
        super();
        this.init()
    }
    /**
     * 右键菜单
     */
    menu: PageItemMenu;
    /**
     * 当前选择的
     */
    selectItems: PageItem[] = [];
    /**
     * 当前正在编辑名称的pageItem
     */
    editItem: PageItem;
    view: SolutionView;
    keyboardPlate = new KeyboardPlate();
    private init() {

    }
    onOpenItemMenu(item: PageItem, event: MouseEvent) {
        this.menu.openItem(item, event);
    }
    onMousedownItem(item: PageItem, event: MouseEvent) {
        if (!this.selectItems.exists(g => g === item)) {
            item.selectedDate = new Date().getTime();
            var lastItems = this.selectItems.map(o => o);
            this.selectItems = [item];
            lastItems.each(item => item.view.forceUpdate())
            item.view.forceUpdate();
            this.emit(SolutionDirective.openItem, item);
        }
        else {
            item.selectedDate = new Date().getTime();
        }
    }
    onEditItem(item: PageItem) {
        var lastEditItem: PageItem;
        if (this.editItem && this.editItem != item) {
            lastEditItem = this.editItem;
        }
        if (item) {
            this.editItem = item;
            this.editItem.view.forceUpdate(() => {
                this.editItem.view.select();
            })
        }
        else this.editItem = null;
        if (lastEditItem) {
            lastEditItem.view.forceUpdate();
        }
    }
}

export interface Solution {
    on(name: SolutionDirective.openItem, fn: (item: PageItem) => void);
    emit(name: SolutionDirective.openItem, item: PageItem);
    emit(name: SolutionDirective.addSubPageItem, item: PageItem);
    on(name: SolutionDirective.addSubPageItem, fn: (item: PageItem) => void);
    emit(name: SolutionDirective.removePageItem, item: PageItem);
    on(name: SolutionDirective.removePageItem, fn: (item: PageItem) => void);
    emit(name: SolutionDirective.updatePageItem, item: PageItem);
    on(name: SolutionDirective.updatePageItem, fn: (item: PageItem) => void);
    emit(name: SolutionDirective.toggleModule, module: Workarea);
    on(name: SolutionDirective.toggleModule, fn: (module: Workarea) => void);
    emit(name: SolutionDirective.togglePageItem, item: PageItem);
    on(name: SolutionDirective.togglePageItem, fn: (item: PageItem) => void);
}