import { Events } from "rich/util/events";
import { KeyboardPlate } from "rich/src/common/keys";
import { PageItem } from "./item";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Point } from "rich/src/common/vector/point";
import { PagesView } from "./item/extensions/pages";
import { PageItemView } from "./item/extensions/view";
import { makeObservable, observable } from "mobx";
import { CacheKey, yCache } from "../../../net/cache";
import { surface } from "..";
import { MouseDragger } from "rich/src/common/dragger";
import { ghostView } from "rich/src/common/ghost";
import { pageItemStore } from "./item/store/sync";
import { channel } from "rich/net/channel";
import { AtomPermission } from "rich/src/page/permission";
import { Mime } from "./declare";

export class Sln extends Events {
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
        var menuItem = await useSelectMenuItem({ roundPoint: Point.from(event) }, await item.getPageItemMenus());
        if (menuItem) {
            item.onContextmenuClickItem(menuItem.item, menuItem.event);
        }
    }
    async onMousedownItem(item: PageItem, event: MouseEvent) {
        var self = this;
        if (surface.workspace?.isAllow(AtomPermission.docEdit)) {
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
                        channel.air('/page/open', { item });
                    }
                    self.isDrag = false;
                    self.dragIds = [];
                    ghostView.unload();
                }
            })
        }
        else {
            channel.air('/page/open', { item });
        }
    }
    async onOpenItem(item: PageItem) {
        await channel.air('/page/open', { item });
    }
    onFocusItem(item?: PageItem) {
        this.selectIds = item ? [item.id] : [];
        if (item) {
            item.selectedDate = new Date().getTime();
            yCache.set(CacheKey.ws_open_page_id, item.id);
        }
    }
    onDeleteRefocusItem(item?: PageItem) {
        if (this.selectIds && this.selectIds.some(s => s == item.id)) {
            var r = surface.workspace.childs.arrayJsonFindMax('childs', x => x.selectedDate || 0);
            if (r) {
                channel.air('/page/open', { item: r });
            }
        }
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
