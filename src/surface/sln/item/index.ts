
import { util } from "rich/util/util";
import { surface } from "../..";
import trash from "rich/src/assert/svg/trash.svg";
import rename from "../../../assert/svg/rename.svg";
import copy from "rich/src/assert/svg/duplicate.svg";
import { ElementType } from "rich/net/element.type";
import cut from "../../../assert/svg/cut.svg";
import link from '../../../assert/svg/link.svg';
import { IconArguments } from "rich/extensions/icon/declare";
import { useIconPicker } from 'rich/extensions/icon/index';
import { Rect } from "rich/src/common/vector/point";
import { MenuItemType, MenuItemTypeValue } from "rich/component/view/menu/declare";
import { Mime, PageItemDirective } from "../declare";
import { makeObservable, observable } from "mobx";
import { pageItemStore } from "./store/sync";
import { Page } from "rich/src/page";
import { channel } from "rich/net/channel";

import { SnapSync } from "../../../../services/snap/sync";
import { PageLayoutType } from "rich/src/page/declare";
import { PagePermission } from "../../workspace/permission";
export class PageItem {
    id: string = null;
    sn?: number = null;
    icon?: IconArguments = null;
    childs?: PageItem[] = [];
    text: string = ''
    spread: boolean = false;
    creater: string = ''
    createDate: Date = null;
    mime: Mime = Mime.none;
    pageType: PageLayoutType = PageLayoutType.doc;
    parentIds: string[] = [];
    workspaceId: string;
    selectedDate: number = null;
    checkedHasChilds: boolean = false;
    willLoadSubs: boolean = false;
    contentView: Page;
    /**
    * 是否为公开
    * net 互联网公开
    * nas 网络存储
    * local 本地存储
    */
    share: 'net' | 'nas' | 'local' = 'nas';
    permission:PagePermission=PagePermission.canView;
    get snapSync() {
        return SnapSync.create(ElementType.PageItem, this.id);
    }
    constructor() {
        makeObservable(this, {
            id: observable,
            sn: observable,
            icon: observable,
            childs: observable,
            text: observable,
            spread: observable,
            creater: observable,
            createDate: observable,
            mime: observable,
            parentIds: observable,
            selectedDate: observable,
            checkedHasChilds: observable,
            willLoadSubs: observable,
            share: observable,
            permission:observable
        })
    }
    get sln() {
        return surface.sln;
    }
    /***
     * 用户设置的路径
     */
    uri: string;
    get path() {
        if (this.uri) return this.uri;
        else return '/page/' + this.id;
    }
    get url() {
        return this.workspace.url + this.path;
    }
    get workspace() {
        return surface.workspace
    }
    get parent(): PageItem {
        if (this.parentId)
            return this.workspace.find(g => g.id == this.parentId);
    }
    get prev() {
        var pa = this.parent;
        if (pa.childs?.length > 0) {
            var currentAt = pa.childs.findIndex(g => g == this);
            return pa.childs[currentAt - 1];
        }
    }
    get next() {
        var pa = this.parent;
        if (pa.childs?.length > 0) {
            var currentAt = pa.childs.findIndex(g => g == this);
            return pa.childs[currentAt + 1];
        }
    }
    parentId?: string;
    at: number;
    load(data) {
        for (var n in data) {
            if (n == 'childs') {
                this.childs = [];
                if (data.childs.length > 0)
                    this.checkedHasChilds = true;
                data.childs.each(child => {
                    var item = new PageItem();
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
        if (this.childs?.length > 0) this.spread = true;
    }
    closest(predict: (item: PageItem) => boolean, ignoreSelf?: boolean) {
        if (ignoreSelf != true && predict(this)) return this;
        var pa = this.parent;
        while (true) {
            if (pa) {
                if (predict(pa)) return pa;
                else pa = pa.parent;
            }
            else break;
        }
    }
    async onSpread(spread?: boolean) {
        var sp = typeof spread != 'undefined' ? spread : this.spread;
        this.spread = sp == false ? true : false;
        if (this.spread == true && this.checkedHasChilds == false) {
            if (this.checkedHasChilds == false && !(this.childs?.length > 0)) {
                var sus = await channel.get('/page/item/subs', { id: this.id });
                if (sus.ok == true) {
                    this.load({ childs: sus.data.list })
                }
                this.checkedHasChilds = true;
            }
            else {
                this.checkedHasChilds = true;
            }
        }
        channel.air('/page/notify/toggle', { id: this.id, visible: this.spread });
    }
    async onAdd(data?: Record<string, any>) {
        if (typeof data == 'undefined') data = {};
        Object.assign(data,{
            text: '',
            mime: Mime.page,
            pageType: PageLayoutType.doc,
            spread: false,
        })
        var item = await pageItemStore.appendPageItem(this, data);
        item.onMousedownItem(undefined);
        return item;
    }
    onExitEditAndSave(newText: string, oldText: string) {
        this.sln.editId = '';
        if (newText != oldText) {
            var text = newText ? newText : oldText;
            if (newText) {
                this.onChange({ text: text }, true);
            }
        }
    }
    onEdit() {
        this.sln.onEditItem(this);
    }
    async onRemove() {
        pageItemStore.deletePageItem(this);
    }
    getPageItemMenus() {
        var items: MenuItemType<PageItemDirective>[] = [];
        items.push({
            name: PageItemDirective.remove,
            icon: trash,
            text: '删除'
        });
        items.push({
            name: PageItemDirective.copy,
            icon: copy,
            text: '拷贝',
            disabled: true
        });
        items.push({
            name: PageItemDirective.rename,
            icon: rename,
            text: '重命名'
        });
        items.push({
            type: MenuItemTypeValue.divide,
        })
        items.push({
            name: PageItemDirective.link,
            icon: link,
            text: '链接',
            disabled: true
        });
        items.push({
            name: PageItemDirective.cut,
            icon: cut,
            text: '剪贴',
            disabled: true
        });
        // items.push({
        //     type: MenuItemTypeValue.divide,
        // });
        // items.push({
        //     type: MenuItemTypeValue.text,
        //     text: '编辑人kanhai'
        // });
        // items.push({
        //     type: MenuItemTypeValue.text,
        //     text: '编辑于2021.19.20'
        // });
        return items;
    }
    onContextmenuClickItem(menuItem: MenuItemType<PageItemDirective>, event: MouseEvent) {
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
        this.sln.onMousedownItem(this, event);
    }
    onContextmenu(event: MouseEvent) {
        this.sln.onOpenItemMenu(this, event);
    }
    async onChangeIcon(event: MouseEvent) {
        var icon = await useIconPicker({ roundArea: Rect.fromEvent(event) });
        if (icon) {
            this.onChange({ icon });
        }
    }
    async onChange(pageInfo: Record<string, any>, force?: boolean) {
        if (force != true) {
            var keys = Object.keys(pageInfo);
            var json = util.pickJson(this, keys);
            if (util.valueIsEqual(json, pageInfo)) return;
        }
        channel.air('/page/update/info', { id: this.id, pageInfo });
    }
    getVisibleIds() {
        var ids: string[] = [this.id];
        if (this.spread == true) {
            this.childs.each(c => {
                ids.addRange(c.getVisibleIds())
            })
        }
        return ids;
    }
    onUpdateDocument() {
        document.title = this.text || '页面';
        if (this.icon) {
            if (this.icon.name == 'emoji') {
                var canvas = document.createElement('canvas');
                var size = 30;
                canvas.width = size;
                canvas.height = size;
                var context = canvas.getContext("2d");
                context.font = "26px Arial";
                context.textBaseline = 'middle';
                context.textAlign = 'center';
                context.fillText(this.icon.code, size / 2, size / 2);
                var dataUrl = canvas.toDataURL('image/png', 1);
                var link: HTMLAnchorElement;
                for (let i = 0; i < document.head.children.length; i++) {
                    var dl = document.head.children[i] as any;
                    if (dl && dl.getAttribute('rel') == 'icon' && dl.getAttribute('type') == 'image/x-icon') {
                        link = dl as any;
                        break;
                    }
                }
                if (!link) {
                    link = document.createElement('link') as any;
                    link.setAttribute('rel', 'icon');
                    link.setAttribute('type', 'image/x-icon');
                    document.head.appendChild(link);
                }
                link.setAttribute('href', dataUrl);
                canvas.remove();
            }
        }
    }
}



