import { Events } from "rich/util/events";
import { KeyboardPlate } from "rich/src/common/keys";
import { PageItemMenu } from "./extensions/menu";
import { PageItem } from "./item";
import { SolutionDirective } from "./operator";
import { SolutionView } from "./view";
import { currentParams, SyHistory } from "../history";
import { CacheKey, yCache } from "../service/cache";
import { generatePath } from "react-router";
import { surface } from "../surface";
import { Mime } from "./item/mime";
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
            lastItems.each(item => item?.view?.forceUpdate())
            if (item.view)
                item.view.forceUpdate();
            this.emit(SolutionDirective.openItem, this.selectItems[0]);
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
                (this.editItem.view as any).select();
            })
        }
        else this.editItem = null;
        if (lastEditItem) {
            lastEditItem.view.forceUpdate();
        }
    }
    async load() {
        var pageId = currentParams('/page/:id')?.id;
        if (!pageId) {
            var pid = yCache.get(CacheKey.pageId);
            if (!pid) {
                var pt = surface.workspace.find(g => g.mime == Mime.page);
                if (pt) pid = pt.id;
            }
            if (pid) {
                SyHistory.push(generatePath('/page/:id', { id: pid }));
                return false;
            }
        }
        else {
            var item = surface.workspace.find(g => g.id == pageId);
            if (item) {
                this.selectItems = [item];
                this.emit(SolutionDirective.openItem, this.selectItems[0])
            }
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
    emit(name: SolutionDirective.togglePageItem, item: PageItem);
    on(name: SolutionDirective.togglePageItem, fn: (item: PageItem) => void);
}