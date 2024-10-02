import { Events } from "rich/util/events";
import { PageItem } from "./item";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Point, Rect } from "rich/src/common/vector/point";
import { PagesView } from "./item/extensions/pages";
import { PageItemView } from "./item/extensions/view";
import { makeObservable, observable } from "mobx";
import { CacheKey, yCache } from "../../../net/cache";
import { surface } from "../app/store";
import { MouseDragger } from "rich/src/common/dragger";
import { ghostView } from "rich/src/common/ghost";
import { pageItemStore } from "./item/store/sync";
import { channel } from "rich/net/channel";
import { Mime } from "./declare";
import { log } from "../../../common/log";


export class Sln extends Events {
    constructor() {
        super();
        makeObservable(this, {
            selectIds: observable,
            hover: observable,
            dragIds: observable,
            isDrag: observable
        });
    }
    el: HTMLElement;
    selectIds: string[] = [];
    dragIds: string[] = [];
    hover: { item: PageItem, direction: 'none' | 'top' | 'bottom' | 'bottom-sub' } = { item: null, direction: 'none' }
    isDrag: boolean = false;
    async onOpenItemMenu(item: PageItem, event: MouseEvent) {
        var el = event.target as HTMLElement;
        var menuItem = await useSelectMenuItem({ roundPoint: Point.from(event) }, await item.getPageItemMenus());
        if (menuItem) {
            item.onContextmenuClickItem(menuItem.item, menuItem.event, el);
        }
    }
    async onMousedownItem(item: PageItem, event: MouseEvent) {
        var self = this;
        if (item.isCanEdit) {
            MouseDragger<{ item: HTMLElement }>({
                event,
                dis: 5,
                isCross: true,
                moveStart(ev, data, crossData) {
                    data.item = (event.target as HTMLElement).closest('.shy-ws-item,.shy-ws-pages-item');
                    self.dragIds = [item.id];
                    self.isDrag = true;
                    crossData.type = 'pageItem';
                    crossData.data = surface.workspace.findAll(g => self.dragIds.some(s => s == g.id));
                    ghostView.load(data.item, { point: Point.from(ev) })
                },
                moving(ev, data, isend) {
                    if (isend) return;
                    ghostView.move(Point.from(ev));
                },
                async moveEnd(ev, isMove, data) {
                    try {
                        if (isMove) {
                            if (self.hover?.item) {
                                if (!self.dragIds.some(s => s == self.hover?.item.id)) {
                                    var dragItem = surface.workspace.find(g => self.dragIds.some(s => s == g.id));
                                    var overItem = self.hover?.item;
                                    if (!overItem.isCanEdit) return;
                                    if (self.hover.direction == 'top') {
                                        if (overItem.prev) await pageItemStore.moveToAfterPageItem(dragItem, overItem.prev);
                                        else if (overItem.parent) {
                                            await pageItemStore.movePrependPageItem(dragItem, overItem.parent);
                                            await overItem.parent.onSpread(true);
                                        }
                                        else await pageItemStore.moveToBeforePageItem(dragItem, overItem)
                                    }
                                    else if (self.hover.direction == 'bottom') {
                                        await pageItemStore.moveToAfterPageItem(dragItem, overItem);
                                    }
                                    else if (self.hover.direction == 'bottom-sub') {
                                        await pageItemStore.movePrependPageItem(dragItem, overItem);
                                        await overItem.onSpread(true);
                                    }
                                }
                            }
                        }
                        else {
                            if ([Mime.page,
                            Mime.table,
                            Mime.chatroom,
                            Mime.tableForm].includes(item.mime)) channel.act('/page/open', { item });
                        }
                    }
                    catch (ex) {
                        log.error(ex);
                    }
                    finally {
                        self.isDrag = false;
                        self.dragIds = [];
                        self.hover = { item: null, direction: 'none' };
                        ghostView.unload();
                    }
                }
            })
        }
        else {
            console.log(item.mime, item);
            if ([
                Mime.page,
                Mime.table,
                Mime.chatroom,
                Mime.tableForm
            ].includes(item.mime)) channel.act('/page/open', { item });
        }
    }
    async onOpenItem(item: PageItem) {
        await channel.act('/page/open', { item });
    }
    onFocusItem(item?: PageItem) {
        if (item && this.selectIds.length == 1 && this.selectIds[0] == item.id) {
            item.onSpread(true, true);
            return;
        }
        this.selectIds = item ? [item.id] : [];
        this.onAutoScrollFocus();
        if (item) {
            item.selectedDate = new Date().getTime();
            yCache.set(CacheKey.ws_open_page_id, item.id);
        }
    }
    onAutoScrollFocus() {
        var id = this.selectIds[0];
        if (this.el && id) {
            var ele = this.el.querySelector(`.shy-ws-item[data-id='${id}']`) as HTMLElement;
             if (ele) {
                ele.scrollIntoView({ block: 'center', behavior: 'smooth' })
            }
        }
    }
    onDeleteRefocusItem(item?: PageItem) {
        if (this.selectIds && this.selectIds.some(s => s == item.id)) {
            var r = surface.workspace.childs.arrayJsonFindMax('childs', x => x.selectedDate || 0);
            if (r) {
                channel.act('/page/open', { item: r });
            }
        }
    }
    async onNewPage() {
        if (this.selectIds.length > 0) {
            var item = surface.workspace.childs.arrayJsonFind('childs', x => this.selectIds.includes(x.id));
            if (item) {
                await item.onAdd()
            }
        }
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
    async onCreateFolder(text: string, posItem?: PageItem) {
        var newItem = await pageItemStore.createFolder(surface.workspace, {
            mime: Mime.pages,
            text
        }, posItem);
        return newItem;
    }
    globalMove(event: MouseEvent) {
        if (this.isDrag && this.el) {
            var dragItem = surface.workspace.find(g => this.dragIds.some(s => s == g.id));
            var target = event.target as HTMLElement;
            var pageItem: PageItem;
            var pageItemEl: HTMLElement;
            var direction;
            var rect = Rect.fromEle(this.el);
            if (this.scrolTime) { clearInterval(this.scrolTime); this.scrolTime = null }
            if (event.clientY < rect.top + 80) {
                this.el.scrollTop = this.el.scrollTop - 10;
                this.scrolTime = setInterval(() => {
                    this.el.scrollTop = this.el.scrollTop - 80;
                }, 300);
            }
            if (event.clientY > rect.bottom - 80) {
                this.el.scrollTop = this.el.scrollTop + 10;
                this.scrolTime = setInterval(() => {
                    this.el.scrollTop = this.el.scrollTop + 80;
                }, 300);
            }
            if (this.el.contains(target)) {
                var dataEleId = target.closest('[data-id]');
                var dataId = dataEleId?.getAttribute('data-id');
                if (dataId) {
                    pageItem = surface.workspace.find(c => c.id == dataId)
                    if (pageItem) pageItemEl = dataEleId as HTMLElement;
                }
            }
            if (!pageItem) {
                if (event.clientX > rect.left - 10 && event.clientX < rect.right + 10) {
                    if (event.clientY <= rect.top) {
                        pageItem = surface.workspace.childs.first();
                        direction = 'top'
                    }
                    else if (event.clientY >= rect.bottom) {
                        pageItem = surface.workspace.childs.last();
                        direction = 'bottom';
                    }
                }
            }
            if (pageItem) {
                if ([
                    Mime.page,
                    Mime.tableForm,
                    Mime.table,
                    Mime.chatroom
                ].includes(dragItem.mime)) {
                    if (pageItem.mime == Mime.pages) {
                        if (!direction) {
                            if (pageItem.childs.length > 0) {
                                var first = pageItem.childs.first();
                                var firstEl = this.el.querySelector(`[data-id='${first.id}']`) as HTMLElement;
                                var firstRect = Rect.fromEle(firstEl);
                                if (firstRect.containY(event.clientY) || event.clientY < firstRect.top) {
                                    pageItem = pageItem.childs.first();
                                    direction = 'top'
                                }
                                else {
                                    pageItem = pageItem.childs.last();
                                    direction = 'bottom'
                                }
                            }
                            else {
                                direction = 'bottom-sub'
                            }
                        }
                        else {
                            if (pageItem.childs.length > 0) pageItem = direction == 'top' ? pageItem.childs.first() : pageItem.childs.last()
                            else direction = 'bottom-sub'
                        }
                    }
                    else {
                        if (pageItemEl) {
                            var itemEl = pageItemEl.querySelector('.shy-ws-item-page') as HTMLElement
                            var pe = Rect.fromEle(itemEl);
                            var paddingLeft = parseFloat(getComputedStyle(itemEl).paddingLeft) + 20;
                            if (pageItem.spread == true && pageItem.childs.length > 0) {
                                if (event.clientX > pe.left + paddingLeft && event.clientY > pe.middle) {
                                    direction = 'bottom-sub'
                                }
                            }
                            else if (Array.isArray(pageItem.childs) && pageItem.childs.length == 0) {
                                if (event.clientX > pe.left + paddingLeft && event.clientY < pe.middle) {
                                    direction = 'bottom-sub'
                                }
                            }
                            if (!direction) {
                                if (event.clientY > pe.middle) {
                                    direction = 'bottom';
                                }
                                else {
                                    direction = 'top'
                                }
                            }
                        }
                    }
                }
                else if (dragItem.mime == Mime.pages) {
                    var pa = pageItem.closest(x => x.mime == Mime.pages);
                    if (pa) {
                        var pv = this.el.querySelector(`[data-id='${pa.id}']`);
                        if (pv) {
                            var pr = Rect.fromEle(pv as HTMLElement);
                            if (event.clientY < pr.top + 10) {
                                pageItem = pa;
                                direction = 'top'
                            }
                            else {
                                pageItem = pa;
                                direction = 'bottom';
                            }
                        }
                    }
                }
            }
            if (pageItem && !pageItem.isCanEdit) pageItem = null;
            if (pageItem && direction && pageItem !== dragItem) {
                var f = dragItem.find(c => c.id == pageItem?.id);
                if (f) {
                    this.hover = { item: null, direction: 'none' };
                }
                else {
                    if ([Mime.table, Mime.chatroom, Mime.tableForm].includes(pageItem.mime) && direction == 'bottom-sub') {
                        direction = 'bottom';
                    }
                    this.hover = { item: pageItem, direction };
                }
            }
            else this.hover = { item: null, direction: 'none' };
        }
        else {
            if (this.scrolTime) { clearInterval(this.scrolTime); this.scrolTime = null }
        }
    }
    scrolTime;
}
