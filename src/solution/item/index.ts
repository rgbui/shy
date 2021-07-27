
import { util } from "rich/util/util";
import { Mime } from "./mime";
import { PageItemView } from "./views/view";
import { surface } from "../../surface";
import { PageItemBox } from "./views/box";
import { PageItemMenuType } from "../extensions/menu";
import trash from "rich/src/assert/svg/trash.svg";
import rename from "../../assert/svg/rename.svg";
import copy from "rich/src/assert/svg/duplicate.svg";
import cut from "../../assert/svg/cut.svg";
import link from '../../assert/svg/link.svg';

import { PageItemDirective } from "./operator";
import { SolutionDirective } from "../operator";
import { workspaceService } from "../../workspace/service";
import { PageView } from "./view";
export class PageItem {
    id: string;
    sn?: number;
    childs?: PageItem[];
    text: string;
    spread: boolean = false;
    view: PageView;
    creater: string;
    createDate: Date;
    viewChilds: PageItemBox;
    mime: Mime;
    parentIds: string[] = [];
    workspaceId: string;
    selectedDate: number;
    checkedHasChilds: boolean = false;
    willLoadSubs: boolean = false;
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
        return surface.workspace
    }
    parent?: PageItem;
    parentId?: string;
    load(data) {
        for (var n in data) {
            if (n == 'childs') {
                this.childs = [];
                data.childs.each(child => {
                    var item = new PageItem();
                    item.parent = this;
                    item.load(child);
                    this.childs.push(item);
                });
            }
            else {
                if (n == 'mime') {
                    var name = 'mime';
                    if (typeof data[n] == 'number') this[name] = data[n];
                    else this[name] = Mime[data[n]] as any;
                }
                else this[n] = data[n];
            }
        }
    }
    createItem(data, at?: number) {
        var item = new PageItem();
        item.parent = this;
        item.load(data);
        if (!Array.isArray(this.childs)) this.childs = [];
        if (typeof at == 'undefined') this.childs.push(item);
        else this.childs.insertAt(at, item);
        return item;
    }
    async onSpread(spread?: boolean) {
        var sp = typeof spread != 'undefined' ? spread : this.spread;
        this.spread = sp == false ? true : false;
        if (this.view) this.view.forceUpdate();
        if (this.spread == true && this.checkedHasChilds == false) {
            var sus = await workspaceService.loadPageChilds(this.id);
            if (sus.ok == true) {
                this.load({ childs: sus.data.list })
            }
            this.checkedHasChilds = true;
            if (this.view) this.view.forceUpdate();
        }
        this.solution.emit(SolutionDirective.togglePageItem, this);
    }
    onAdd() {
        var item = new PageItem();
        item.id = util.guid();
        item.text = '新页面';
        item.mime = Mime.page;
        item.spread = false;
        item.parentId = this.id;
        item.parent = this;
        this.spread = true;
        if (!Array.isArray(this.childs)) this.childs = [];
        this.solution.emit(SolutionDirective.addSubPageItem, item);
        this.childs.insertAt(0, item);
        if (this.view) this.view.forceUpdate(() => {
            item.onEdit();
        });
        else console.error('not found item view when add child')
    }
    onEdit() {
        this.solution.onEditItem(this);
    }
    onExitEdit() {
        this.solution.onEditItem(null);
    }
    async onRemove() {
        var id = this.id;
        await workspaceService.deletePage(id);
        if (this.solution.selectItems.exists(g => g == this)) {
            this.solution.selectItems.remove(this);
        }
        if (this.parent) {
            this.parent.childs.remove(g => g == this);
            this.parent.view.forceUpdate();
        }
        else {
            surface.workspace.childs.remove(g => g === this);
        }
        this.solution.emit(SolutionDirective.removePageItem, this);
    }
    getPageItemMenus() {
        var items: PageItemMenuType[] = [];
        items.push({
            name: PageItemDirective.remove,
            icon: trash,
            text: '删除'
        });
        items.push({
            name: PageItemDirective.copy,
            icon: copy,
            text: '拷贝'
        });
        items.push({
            name: PageItemDirective.rename,
            icon: rename,
            text: '重命名'
        });
        items.push({
            type: 'devide'
        })
        items.push({
            name: PageItemDirective.link,
            icon: link,
            text: '链接'
        });
        items.push({
            name: PageItemDirective.cut,
            icon: cut,
            text: '剪贴'
        });
        items.push({
            type: 'devide'
        });
        items.push({
            type: 'text',
            text: '编辑人kanhai'
        });
        items.push({
            type: 'text',
            text: '编辑于2021.19.20'
        });
        return items;
    }
    onMenuClickItem(menuItem: PageItemMenuType, event: MouseEvent) {
        switch (menuItem.name) {
            case PageItemDirective.copy:
                break;
            case PageItemDirective.remove:
                this.onRemove();
                break;
            case PageItemDirective.rename:
                this.onEdit();
                break;
        }
    }
    onMousedownItem(event: MouseEvent) {
        this.solution.onMousedownItem(this, event);
    }
    onContextmenu(event: MouseEvent) {
        this.solution.onOpenItemMenu(this, event);
    }
    async onUpdate(data: Record<string, any>) {
        Object.assign(this, data);
        await workspaceService.updatePage(this);
        this.solution.emit(SolutionDirective.updatePageItem, this);
    }
    get isInEdit() {
        return this.solution.editItem === this;
    }
    get isSelected() {
        return this.solution.selectItems.exists(this);
    }
}

