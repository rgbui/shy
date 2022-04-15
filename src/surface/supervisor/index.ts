
import { PageItem } from "../sln/item";
import { Events } from "rich/util/events";
import { Rect } from "rich/src/common/vector/point";
import { usePagePublish } from "./publish";
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
        if (this.item) return [this.item]
        else return [];
    }
    async onOpenItem(...items: PageItem[]) {
        var oldItem = this.item;
        this.itemIds = items.map(i => i.id);
        var newItem = items.first();
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
        // workspaceService.toggleFavourcePage(this.item)
    }
    async onOpenPublish(event: React.MouseEvent) {
        await usePagePublish({ roundArea: Rect.fromEvent(event) }, this.item)
    }
    async onOpenPageProperty(event: React.MouseEvent) {
        if (this.item.contentView) {
            await this.item.contentView.onPageContextmenu(event);
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