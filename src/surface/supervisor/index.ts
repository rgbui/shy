
import { PageItem } from "../sln/item";
import { Events } from "rich/util/events";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Rect } from "rich/src/common/vector/point";
import { workspaceService } from "../../../services/workspace";
import { usePagePublish } from "./publish";
import { MenuItemType, MenuItemTypeValue } from "rich/component/view/menu/declare";
import { computed, makeObservable, observable } from "mobx";
import { surface } from "..";
import { createPageContent } from "./page";
import SvgLink from "../../assert/svg/link.svg";
import SvgLock from "../../assert/svg/lock.svg";
import SvgVersion from "../../assert/svg/versionHistory.svg";
import SvgUndo from "../../assert/svg/undo.svg";
import CustomizePage from "../../assert/svg/customizePage.svg";
import SvgExport from "../../assert/svg/file.svg";
import Upload from "../../assert/svg/import.svg";
import SvgTrash from 'rich/src/assert/svg/trash.svg';
import MoveTo from "rich/src/assert/svg/moveTo.svg";

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
            { name: 'fullWidth', text: '宽版', type: MenuItemTypeValue.switch },
            { type: MenuItemTypeValue.divide },
            { name: 'layout', text: '版面', icon: CustomizePage, disabled: true },
            { name: 'lock', text: '编辑保护', icon: SvgLock, disabled: true },
            { type: MenuItemTypeValue.divide },
            { name: 'favourite', icon: 'favorite:sy', text: '添加至收藏', disabled: true },
            { name: 'history', icon: SvgVersion, text: '页面历史', disabled: true },
            { name: 'copylink', icon: SvgLink, text: '复制链接', disabled: true },
            { type: MenuItemTypeValue.divide },
            { name: 'undo', text: '撤消', icon: SvgUndo, disabled: true },
            { name: 'redo', text: '重做', icon: SvgUndo, disabled: true },
            { name: 'delete', icon: SvgTrash, text: '删除', disabled: true },
            { type: MenuItemTypeValue.divide },
            { name: 'import', icon: Upload, text: '导入', disabled: true },
            { name: 'export', text: '导出', icon: SvgExport, disabled: true, remark: '导出PDF,HTML,Markdown' },
            { type: MenuItemTypeValue.divide },
            { name: 'move', text: '移动', icon: MoveTo, disabled: true },
        ];
        while (true) {
            var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(event) }, items,{overflow:'visible'});
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