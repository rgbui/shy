
import { util } from "rich/util/util";
import { surface } from "../..";
import { ElementType } from "rich/net/element.type";
import { IconArguments } from "rich/extensions/icon/declare";
import { useIconPicker } from 'rich/extensions/icon/index';
import { Rect } from "rich/src/common/vector/point";
import { MenuItem, MenuItemType } from "rich/component/view/menu/declare";
import { Mime, PageItemDirective } from "../declare";
import { makeObservable, observable } from "mobx";
import { pageItemStore } from "./store/sync";
import { Page } from "rich/src/page";
import { channel } from "rich/net/channel";
import { SnapStore } from "../../../../services/snap/store";
import { PageLayoutType } from "rich/src/page/declare";
import { PagePermission } from "rich/src/page/permission";
import lodash from "lodash";
import { DuplicateSvg, LinkSvg, RenameSvg, TrashSvg } from "rich/component/svgs";
import { CopyText } from "rich/component/copy";
import { ShyAlert } from "rich/component/lib/alert";

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
    permission: PagePermission = PagePermission.canView;
    locker: { userid: string, lockDate: number } = null;
    public editDate: Date = null;
    public editor: string = null;
    get snapStore() {
        return SnapStore.create(ElementType.PageItem, this.id);
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
            permission: observable,
            locker: observable,
            snapSaving: observable,
            editDate: observable,
            editor: observable
        });

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
        else return '/page/' + this.sn;
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
    snapSaving: boolean = false;
    get index() {
        if (this.parent) return this.parent?.childs.findIndex(g => g === this);
        return null;
    }
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
        this.bindEvents();
    }
    bindEvents() {
        if (this.id) {
            this.snapStore.only('willSave', () => {
                this.snapSaving = true;
                console.log(this.snapSaving, 'willSave');
            });
            this.snapStore.only('saved', () => {
                this.snapSaving = false;
            });
            this.snapStore.only('saveSuccessful', () => {
                this.onChange({ editDate: new Date(), editor: surface.user.id })
            });
        }
    }
    get() {
        return {
            id: this.id,
            url: this.url,
            text: this.text, sn: this.sn,
            icon: this.icon,
            pageType: this.pageType
        }
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
        var sp = typeof spread == 'boolean' ? !spread : this.spread;
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
        Object.assign(data, {
            text: '',
            mime: Mime.page,
            pageType: PageLayoutType.doc,
            spread: false,
        })
        var item = await pageItemStore.appendPageItem(this, data);
        item.onOpenItem();
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
    async onCopy() {
        var data = {
            icon: lodash.cloneDeep(this.icon),
            text: util.getListName(this.parent.childs,
                this.text,
                g => g.text,
                (c, i) => i > 0 ? `${c}(${i})` : `${c}`
            ),
            mime: Mime.page,
            pageType: PageLayoutType.doc,
            spread: false,
        };
        var item = await pageItemStore.insertAfterPageItem(this, data);
        await item.onOpenItem();
        if (!item.contentView) {
            await util.delay(200);
        }
        if (this.contentView) {
            var content = await this.contentView.get();
            await item.contentView.onReplace(this.id, content);
        }
        else {
            var pd = await this.snapStore.querySnap();
            await item.contentView.onReplace(this.id, pd.content, pd.operates);
        }
        item.contentView.onSave();
        item.contentView.forceUpdate()
    }
    async getPageItemMenus() {
        var items: MenuItem<PageItemDirective>[] = [];
        items.push({
            name: PageItemDirective.remove,
            icon: TrashSvg,
            text: '删除'
        });
        if (this.pageType == PageLayoutType.doc) {
            items.push({
                name: PageItemDirective.copy,
                icon: DuplicateSvg,
                text: '拷贝'
            });
        }
        items.push({
            name: PageItemDirective.rename,
            icon: RenameSvg,
            text: '重命名'
        });
        items.push({
            type: MenuItemType.divide,
        })
        items.push({
            name: PageItemDirective.link,
            icon: LinkSvg,
            text: '复制访问链接'
        });
        if (this.editor) {
            items.push({
                type: MenuItemType.divide,
            });
            var r = await channel.get('/user/basic', { userid: this.editor });
            if (r?.data?.user) items.push({
                type: MenuItemType.text,
                text: '编辑人' + r.data.user.name
            });
            if (this.editDate) items.push({
                type: MenuItemType.text,
                text: '编辑于' + util.showTime(this.editDate)
            });
        }
        return items;
    }
    onContextmenuClickItem(menuItem: MenuItem<PageItemDirective>, event: MouseEvent) {
        switch (menuItem.name) {
            case PageItemDirective.copy:
                this.onCopy();
                break;
            case PageItemDirective.remove:
                this.onRemove();
                break;
            case PageItemDirective.rename:
                this.onEdit();
                break;
            case PageItemDirective.link:
                CopyText(this.url);
                ShyAlert('访问链接已复制')
                break;
        }
    }
    async onOpenItem() {
        await this.sln.onOpenItem(this);
    }
    onMousedownItem(event: MouseEvent) {
        this.sln.onMousedownItem(this, event);
    }
    onContextmenu(event: MouseEvent) {
        this.sln.onOpenItemMenu(this, event);
    }
    async onChangeIcon(event: MouseEvent) {
        var icon = await useIconPicker({ roundArea: Rect.fromEvent(event) });
        if (typeof icon != 'undefined') {
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



