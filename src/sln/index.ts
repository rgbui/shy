import { Events } from "rich/util/events";
import { KeyboardPlate } from "rich/src/common/keys";
import { PageItem } from "./item";
import { SlnDirective } from "./operator";
import { SlnView } from "./view";
import { currentParams, SyHistory } from "../history";
import { CacheKey, yCache } from "../service/cache";
import { generatePath } from "react-router";
import { surface } from "../surface";
import { Mime } from "./item/mime";
import { useSelectMenuItem } from "rich/component/menu";
import { Point } from "rich/src/common/point";
export class Sln extends Events<SlnDirective> {
    constructor() {
        super();
        this.init()
    }
    /**
     * 当前选择的
     */
    selectItems: PageItem[] = [];
    /**
     * 当前正在编辑名称的pageItem
     */
    editItem: PageItem;
    view: SlnView;
    keyboardPlate = new KeyboardPlate();
    private init() {

    }
    async onOpenItemMenu(item: PageItem, event: MouseEvent) {
        await useSelectMenuItem({ roundPoint: Point.from(event) }, item.getPageItemMenus());
    }
    onMousedownItem(item: PageItem, event: MouseEvent) {
        if (!this.selectItems.exists(g => g === item)) {
            item.selectedDate = new Date().getTime();
            var lastItems = this.selectItems.map(o => o);
            this.selectItems = [item];
            lastItems.each(item => item?.view?.forceUpdate())
            if (item.view)
                item.view.forceUpdate();
            this.emit(SlnDirective.openItem, this.selectItems[0]);
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
                this.emit(SlnDirective.openItem, this.selectItems[0])
            }
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