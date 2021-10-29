
import { util } from "rich/util/util";
import { surface } from "../..";
import trash from "rich/src/assert/svg/trash.svg";
import rename from "../../../../assert/svg/rename.svg";
import copy from "rich/src/assert/svg/duplicate.svg";
import cut from "../../../../assert/svg/cut.svg";
import link from '../../../../assert/svg/link.svg';
import { workspaceService } from "../../../../../services/workspace";
import { IconArguments } from "rich/extensions/icon/declare";
import { useIconPicker } from 'rich/extensions/icon/index';
import { Rect } from "rich/src/common/point";
import { MenuItemType, MenuItemTypeValue } from "rich/component/view/menu/declare";
import { messageChannel } from "rich/util/bus/event.bus";
import { Directive } from "rich/util/bus/directive";
import { PageStore } from "../../../../../services/page";
import { UserAction } from "rich/src/history/action";
import { Mime, SlnDirective, PageItemDirective } from "../declare";
import { makeObservable, observable, toJS } from "mobx";
import lodash from 'lodash';
export class PageItem {
    id: string = null;
    sn?: number = null;
    icon?: IconArguments = null;
    childs?: PageItem[] = null;
    text: string = ''
    spread: boolean = false;
    creater: string = ''
    createDate: Date = null;
    mime: Mime = Mime.none;
    parentIds: string[] = [];
    workspaceId: string;
    selectedDate: number = null;
    checkedHasChilds: boolean = false;
    willLoadSubs: boolean = false;
    store: PageStore;
    /**
    * 是否为公开
    * net 互联网公开
    * nas 网络存储
    * local 本地存储
    */
    share: 'net' | 'nas' | 'local' = 'nas';
    constructor() {
        this.store = new PageStore(this);
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
            share: observable
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
        else return '/' + this.id;
    }
    get url() {
        return this.workspace.url + this.path;
    }
    get workspace() {
        return surface.workspace
    }
    parent: PageItem;
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
    createItem(data, at?: number) {
        var item = new PageItem();
        item.parent = this;
        item.load(data);
        if (!Array.isArray(this.childs)) this.childs = [];
        if (typeof at == 'undefined') this.childs.push(item);
        else this.childs.insertAt(at, item);
        return item;
    }
    onUpdate(pageInfo: Record<string, any>) {
        Object.assign(this, pageInfo);
        // if (this.view)
        //     this.view.forceUpdate()
    }
    async onSpread(spread?: boolean) {
        var sp = typeof spread != 'undefined' ? spread : this.spread;
        this.spread = sp == false ? true : false;
        if (this.spread == true && this.checkedHasChilds == false) {
            var sus = await workspaceService.loadPageChilds(this.id);
            if (sus.ok == true) {
                this.load({ childs: sus.data.list })
            }
            this.checkedHasChilds = true;
        }
        this.sln.emit(SlnDirective.togglePageItem, this);
    }
    async onAdd(data?: Record<string, any>, at?: number) {
        var item = new PageItem();
        item.id = util.guid();
        item.text = '新页面';
        item.mime = Mime.page;
        item.spread = false;
        item.parentId = this.id;
        item.parent = this;
        if (data) lodash.assign(item, data);
        this.spread = true;
        if (!Array.isArray(this.childs)) this.childs = [];
        await this.sln.emitAsync(SlnDirective.addSubPageItem, item);
        if (typeof at == 'undefined') at = 0;
        this.childs.splice(at, 0, item);
        return item;
    }
    async onAddAndEdit(data?: Record<string, any>, at?: number) {
        var item = await this.onAdd();
        this.sln.editId = item.id;
    }
    onExitEditAndSave(newText: string, oldText: string) {
        this.sln.editId = '';
        if (newText != oldText) {
            this.text = newText ? newText : oldText;
            messageChannel.fire(Directive.UpdatePageItem, this.id, { text: this.text })
        }
        else if (!this.sn) messageChannel.fire(Directive.UpdatePageItem, this.id, { text: this.text })
    }
    onEdit() {
        this.sln.onEditItem(this);
    }
    async onRemove() {
        var id = this.id;
        await workspaceService.deletePage(id);
        lodash.remove(this.sln.selectIds, g => g == id);
        if (this.parent) lodash.remove(this.parent.childs, g => g.id == this.id);
        else lodash.remove(surface.workspace.childs, g => g.id == this.id);
        this.sln.emit(SlnDirective.removePageItem, this);
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
    onChange(pageInfo: Record<string, any>, force?: boolean) {
        if (force != true) {
            var keys = Object.keys(pageInfo);
            var json = util.pickJson(this, keys);
            if (util.valueIsEqual(json, pageInfo)) return;
        }
        messageChannel.fire(Directive.UpdatePageItem, this.id, pageInfo);
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
                    }
                }
                if (!link) {
                    link = document.createElement('link') as any;
                    link.setAttribute('rel', 'icon');
                    link.setAttribute('type', 'image/x-icon');
                    document.head.appendChild(link);
                }
                link.setAttribute('href', dataUrl);
            }
            //<link rel="icon" type="image/x-icon" href="https://secure.wostatic.cn/icon/rwF6bK9DDEHgFAkA5rzSWy/%E6%84%8F%E5%A4%A7%E5%88%A9%E9%A3%8E%E5%85%89%20%E5%B0%9A%C2%B7%E5%B7%B4%E8%92%82%E6%96%AF%E7%89%B9%C2%B7%E5%8D%A1%E7%B1%B3%E5%B0%94%C2%B7%E7%A7%91%E7%BD%97%EF%BC%88%E6%B3%95%E5%9B%BD%EF%BC%89.jpg?auth_key=1628690385-b5mmS9cDfRgyx5ZK8wTBap-0-bdd99d9c46f9257401450fbf47b1a890&amp;image_process=resize,w_48">
        }
    }
    onSaveUseAction(action: UserAction) {
        this.store.saveHistory(action);
    }
}

