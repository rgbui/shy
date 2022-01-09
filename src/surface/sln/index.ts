import { Events } from "rich/util/events";
import { KeyboardPlate } from "rich/src/common/keys";
import { PageItem } from "./item";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Point } from "rich/src/common/vector/point";
import { messageChannel } from "rich/util/bus/event.bus";
import { Directive } from "rich/util/bus/directive";
import { SlnDirective, Mime } from "./declare";
import { PagesView } from "./item/extensions/pages";
import { PageItemView } from "./item/extensions/view";
import { makeObservable, observable } from "mobx";
import { CacheKey, yCache } from "../../../net/cache";
import { surface } from "..";
import { MouseDragger } from "rich/src/common/dragger";
import { ghostView } from "rich/src/common/ghost";
import { pageItemStore } from "../../../services/page.item";

export class Sln extends Events<SlnDirective> {
    constructor() {
        super();
        makeObservable(this, {
            selectIds: observable,
            editId: observable,
            hoverId: observable,
            dragIds: observable,
            isDrag: observable
        });
    }
    selectIds: string[] = [];
    editId: string = '';
    hoverId: string = '';
    dragIds: string[] = [];
    isDrag: boolean = false;
    keyboardPlate = new KeyboardPlate();
    async onOpenItemMenu(item: PageItem, event: MouseEvent) {
        var menuItem = await useSelectMenuItem({ roundPoint: Point.from(event) }, item.getPageItemMenus());
        if (menuItem) {
            item.onContextmenuClickItem(menuItem.item, menuItem.event);
        }
    }
    onMousedownItem(item: PageItem, event?: MouseEvent) {
        if (!item) return;
        var self = this;
        if (!event) messageChannel.fire(Directive.OpenPageItem, item);
        else
            MouseDragger<{ item: HTMLElement }>({
                event,
                dis: 5,
                isCross: true,
                moveStart(ev, data, crossData) {
                    data.item = (event.target as HTMLElement).closest('.shy-ws-item');
                    self.dragIds = [item.id];
                    self.isDrag = true;
                    crossData.type = 'pageItem';
                    crossData.data = surface.workspace.findAll(g => self.dragIds.some(s => s == g.id));
                    ghostView.load(data.item, { point: Point.from(ev) })
                },
                moving(ev, data, isend) {
                    ghostView.move(Point.from(ev));
                },
                moveEnd(ev, isMove, data) {
                    if (isMove) {
                        if (self.hoverId) {
                            if (!self.dragIds.some(s => s == self.hoverId)) {
                                var dragItem = surface.workspace.find(g => self.dragIds.some(s => s == g.id));
                                var overItem = surface.workspace.find(g => g.id == self.hoverId);
                                pageItemStore.moveToPageItem(dragItem, overItem);
                            }
                        }
                    }
                    else {
                        messageChannel.fire(Directive.OpenPageItem, item);
                    }
                    self.isDrag = false;
                    self.dragIds = [];
                    ghostView.unload();
                }
            })
    }
    onFocusItem(item: PageItem) {
        this.selectIds = [item.id];
        item.selectedDate = new Date().getTime();
        yCache.set(yCache.resolve(CacheKey[CacheKey.ws_open_page_id], surface.workspace.id), item.id);
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
