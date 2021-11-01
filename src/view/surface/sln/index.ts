import { Events } from "rich/util/events";
import { KeyboardPlate } from "rich/src/common/keys";
import { PageItem } from "./item";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Point } from "rich/src/common/point";
import { messageChannel } from "rich/util/bus/event.bus";
import { Directive } from "rich/util/bus/directive";
import { SlnDirective, Mime } from "./declare";
import { PagesView } from "./item/extensions/pages";
import { PageItemView } from "./item/extensions/view";
import { makeObservable, observable } from "mobx";
import { CacheKey, yCache } from "../../../../net/cache";
import { surface } from "..";
export class Sln extends Events<SlnDirective> {
    constructor() {
        super();
        makeObservable(this, {
            selectIds: observable,
            editId: observable
        })
    }
    selectIds: string[] = [];
    editId: string = '';
    keyboardPlate = new KeyboardPlate();
    async onOpenItemMenu(item: PageItem, event: MouseEvent) {
        var menuItem = await useSelectMenuItem({ roundPoint: Point.from(event) }, item.getPageItemMenus());
        if (menuItem) {
            item.onContextmenuClickItem(menuItem.item, menuItem.event);
        }
    }
    onMousedownItem(item: PageItem, event?: MouseEvent) {
        messageChannel.fire(Directive.OpenPageItem, item);
    }
    onFocusItem(item: PageItem) {
        this.selectIds = [item.id];
        item.selectedDate = new Date().getTime();
        yCache.set(yCache.resolve(CacheKey.workspace_open_page_id, surface.workspace.id), item.id);
    }
    onEditItem(item: PageItem) {
        this.editId = item?.id || '';
    }
    getMimeViewComponent(mime: Mime): (props: {
        item: PageItem;
        deep?: number;
    }) => JSX.Element {
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