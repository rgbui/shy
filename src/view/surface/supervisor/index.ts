
import { PageItem } from "../sln/item";
import { Events } from "rich/util/events";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Rect } from "rich/src/common/point";
import { workspaceService } from "../../../../services/workspace";
import { usePagePublish } from "./publish";
import { MenuItemType, MenuItemTypeValue } from "rich/component/view/menu/declare";
import { computed, makeObservable, observable } from "mobx";
import { surface } from "..";
import { createPageContent } from "./page";
export class Supervisor extends Events {
    itemIds: string[] = [];
    pagesEl: HTMLElement;
    loading: boolean = false;
    constructor() {
        super()
        makeObservable(this, {
            itemIds: observable,
            item: computed,
            items: computed,
            loading: observable
        })
    }
    get item() {
        var id = this.itemIds[0];
        return surface.workspace.find(g => g.id == id);
    }
    get items() {
        if (this.item)
            return [this.item]
        else return [];
    }
    async onOpenItem(...items: PageItem[]) {
        var oldItem = this.item;
        this.itemIds = items.map(i => i.id);
        var newItem = this.item;
        if (newItem.id !== oldItem?.id) {
            this.loading = true;
            try {
                if (oldItem && oldItem.contentView) {
                    oldItem.contentView.cacheFragment();
                }
                await createPageContent(newItem);
            }
            catch (ex) {

            }
            finally {
                this.loading = false;
            }
        }
    }
    onFavourite(event: React.MouseEvent) {
        workspaceService.toggleFavourcePage(this.item)
    }
    async onOpenPublish(event: React.MouseEvent) {
        await usePagePublish({ roundArea: Rect.fromEvent(event) }, this.item)
    }
    async onOpenPageProperty(event: React.MouseEvent) {
        var items: MenuItemType<string>[] = [
            { name: 'smallText', text: '小字号', type: MenuItemTypeValue.switch },
            { name: 'fullWidth', text: '宽版', type: MenuItemTypeValue.switch }
        ];
        while (true) {
            var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(event) }, items);
            if (r?.item) {
                if (r.item.name == 'smallText') {
                    // console.log(r.item.checked);
                }
                else if (r.item.name == 'fullWidth') {
                    // console.log(r.item.checked);
                }
            }
            else break;
        }
    }
    async getView(): Promise<HTMLElement> {
        if (this.pagesEl) return this.pagesEl;
        return new Promise((resolve, reject) => {
            this.on('mounted', function () {
                if (this.pagesEl) resolve(this.pagesEl);
            })
        })
    }
}