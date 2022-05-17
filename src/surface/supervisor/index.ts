
import { PageItem } from "../sln/item";
import { Events } from "rich/util/events";
import { Rect } from "rich/src/common/vector/point";
import { usePagePublish } from "./publish";
import { computed, makeObservable, observable } from "mobx";
import { surface } from "..";
import { createPageContent } from "./page";
import { timService } from "../../../net/primus";

export class Supervisor extends Events {
    itemId: string = null;
    pagesEl: HTMLElement;
    loading: boolean = false;
    constructor() {
        super()
        makeObservable(this, {
            itemId: observable,
            item: computed,
            loading: observable
        })
    }
    get item() {
        return surface.workspace.find(g => g.id == this.itemId);
    }
    async onOpenItem(item?: PageItem) {
        var oldItem = this.item;
        if (item) {
            if (item.id == this.itemId) return;
            else this.itemId = item.id;
            this.loading = true;
            await timService.enterWorkspaceView(surface.workspace.id, surface.workspace.member ? true : false, item.id);
            try {
                if (oldItem && oldItem.contentView) {
                    oldItem.contentView.cacheFragment();
                }
                await createPageContent(item);
            }
            catch (ex) {

            }
            finally {
                this.loading = false;
            }
        }
        else {
            await timService.enterWorkspaceView(surface.workspace.id, surface.workspace.member ? true : false, undefined);
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
    async autoLayout() {
        if (this?.item?.contentView) {
            var view = await this.getView();
            var bound = Rect.fromEle(view);
            this.item.contentView.layout({ width: bound.width, height: bound.height })
        }
    }
}