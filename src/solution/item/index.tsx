
import { util } from "rich/src/util/util";
import { Mime } from "./mine";
import { Workarea } from "../workarea";
import { PageItemView } from "./view";
import { surface } from "../../surface";
import { PageItemBox } from "./box";
import { PageItemMenuType } from "../extensions/menu";
import trash from "rich/src/assert/svg/trash.svg";
import rename from "../../assert/svg/rename.svg";
import copy from "rich/src/assert/svg/duplicate.svg";
import { PageItemOperator } from "./operator.declare";
import { SolutionOperator } from "../operator";
export class PageItem {
    id: string;
    childs?: PageItem[];
    text: string;
    spread: boolean = false;
    view: PageItemView;
    viewChilds: PageItemBox;
    area: Workarea;
    mime: Mime;
    workareaIds: string[] = [];
    selectedDate: number;
    get solution() {
        return surface.solution;
    }
    /***
     * 用户设置的路径
     */
    uri: string;
    get path() {
        if (this.uri) return this.uri;
        else return '/' + this.id;
    }
    get url() {
        return this.workspace.url + this.path;
    }
    get workspace() {
        return this.area.workspace;
    }
    parent?: PageItem;
    load(data) {
        for (var n in data) {
            if (n == 'childs') {
                this.childs = [];
                data.childs.each(child => {
                    var item = new PageItem();
                    item.parent = this;
                    item.area = this.area;
                    item.load(child);
                    this.childs.push(item);
                });
            }
            else {
                this[n] = data[n];
            }
        }
    }
    get() {
        return {
            id: this.id,
            childs: Array.isArray(this.childs) ? this.childs.map(c => c.get()) : undefined,
            text: this.text,
            spread: this.spread,
            mime: this.mime,
            uri: this.uri,
            selectedDate: this.selectedDate
        }
    }
    onSpread(spread?: boolean) {
        var sp = typeof spread != 'undefined' ? spread : this.spread;
        this.spread = sp == false ? true : false;
        if (this.view) this.view.forceUpdate();
        else console.error('not found item view when spread');
        this.solution.emit(SolutionOperator.togglePageItem, this);
    }
    onAdd() {
        var item = new PageItem();
        item.id = util.guid();
        item.text = '新页面';
        item.mime = Mime.page;
        item.area = this.area;
        item.spread = false;
        this.spread = true;
        if (!Array.isArray(this.childs)) this.childs = [];
        this.solution.emit(SolutionOperator.addSubPageItem, item);
        this.childs.insertAt(0, item);
        if (this.view)
            this.view.forceUpdate(() => {
                item.onEdit();
            });
        else console.error('not found item view when add child')
    }
    onEdit() {
        this.solution.onEditItem(this);
    }
    onRemove() {
        if (this.solution.selectItems.exists(g => g == this)) {
            this.solution.selectItems.remove(this);
        }
        if (this.parent) {
            this.parent.childs.remove(g => g == this);
            this.parent.view.forceUpdate();
        }
        else {
            this.area.items.remove(g => g == this);
            this.area.view.forceUpdate();
        }
        this.solution.emit(SolutionOperator.removePageItem, this);
    }
    getPageItemMenus() {
        var items: PageItemMenuType[] = [];
        items.push({
            name: PageItemOperator.remove, icon: trash, text: '删除'
        });
        items.push({
            name: PageItemOperator.copy, icon: copy, text: '拷贝'
        });
        items.push({
            name: PageItemOperator.rename, icon: rename, text: '重命名'
        });
        return items;
    }
    onMenuClickItem(menuItem: PageItemMenuType, event: MouseEvent) {
        switch (menuItem.name) {
            case PageItemOperator.copy:
                break;
            case PageItemOperator.remove:
                this.onRemove();
                break;
            case PageItemOperator.rename:
                this.onEdit();
                break;
        }
    }
}

