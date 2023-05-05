
import { util } from "rich/util/util";
import { surface } from "../../store";
import { ElementType, getElementUrl } from "rich/net/element.type";
import { IconArguments } from "rich/extensions/icon/declare";
import { useIconPicker } from 'rich/extensions/icon/index';
import { Rect } from "rich/src/common/vector/point";
import { MenuItem, MenuItemType } from "rich/component/view/menu/declare";
import { Mime } from "../declare";
import { makeObservable, observable, runInAction } from "mobx";
import { pageItemStore } from "./store/sync";
import { channel } from "rich/net/channel";
import { SnapStore } from "../../../../services/snap/store";
import { PageLayoutType } from "rich/src/page/declare";
import { AtomPermission } from "rich/src/page/permission";
import lodash from "lodash";
import { DuplicateSvg, FolderCloseSvg, FolderOpenSvg, FolderPlusSvg, LinkSvg, RenameSvg, SeoFolderSvg, TrashSvg } from "rich/component/svgs";
import { CopyText } from "rich/component/copy";
import { ShyAlert } from "rich/component/lib/alert";
import { PageViewStores } from "../../supervisor/view/store";
import { Confirm } from "rich/component/lib/confirm";
import { useForm } from "rich/component/view/form/dialoug";

export class PageItem {
    id: string = null;
    sn?: number = null;
    icon?: IconArguments = null;
    childs?: PageItem[] = [];
    text: string = ''
    spread: boolean = false;
    creater: string = '';
    description: string = '';
    createDate: Date = null;
    mime: Mime = Mime.none;
    pageType: PageLayoutType = PageLayoutType.doc;
    workspaceId: string;
    selectedDate: number = null;
    checkedHasChilds: boolean = false;
    willLoadSubs: boolean = false;
    subCount: number = null;
    /**
    * 是否为公开
    * net 互联网公开
    * nas 网络存储
    * local 本地存储
    */
    share: 'net' | 'nas' | 'local' = 'nas';

    /**
     * 互联网是否公开，如果公开的权限是什么
     */
    public netPermissions: AtomPermission[] = [];
    /**
     * 外部邀请的用户权限
     */
    public inviteUsersPermissions: { userid: string, permissions: AtomPermission[] }[] = [];
    /**
     * 空间成员权限，
     * 可以指定角色，也可以指定具体的人
     */
    public memberPermissions: { roleId: string, userid: string, permissions: AtomPermission[] }[] = [];
    locker: {
        lock: boolean,
        date: number,
        userid: string
    } = null;
    public editDate: Date = null;
    public editor: string = null;
    speak?: 'more' | 'only' = 'more';
    speakDate?: Date = null;
    textChannelMode?: 'chat' | 'weibo' | 'ask' | 'tieba' = 'chat';
    unreadChats: { id: string, roomId: string, seq: number }[] = [];
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
            selectedDate: observable,
            checkedHasChilds: observable,
            willLoadSubs: observable,
            share: observable,
            netPermissions: observable,
            memberPermissions: observable,
            inviteUsersPermissions: observable,
            locker: observable,
            editDate: observable,
            editor: observable,
            description: observable,
            unreadChats: observable,
            pageType: observable,
            subCount: observable
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
    get elementUrl() {
        if (this.pageType == PageLayoutType.db || this.pageType == PageLayoutType.docCard) {
            return getElementUrl(ElementType.Schema, this.id);
        }
        else if (this.pageType == PageLayoutType.doc || this.pageType == PageLayoutType.board) {
            return getElementUrl(ElementType.PageItem, this.id);
        }
        else if (this.pageType == PageLayoutType.dbView) {
            return getElementUrl(ElementType.SchemaView, this.parent.id, this.id);
        }
        else if (this.pageType == PageLayoutType.dbForm) {
            return getElementUrl(ElementType.SchemaRecordView, this.parent.id, this.id);
        }
        else if (this.pageType == PageLayoutType.textChannel) {
            return getElementUrl(ElementType.Room, this.id);
        }
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
        if (pa?.childs?.length > 0) {
            var currentAt = pa.childs.findIndex(g => g == this);
            return pa.childs[currentAt - 1];
        }
        else {
            var currentAt = this.workspace.childs.findIndex(g => g === this);
            return this.workspace.childs[currentAt - 1]
        }
    }
    get next() {
        var pa = this.parent;
        if (pa?.childs?.length > 0) {
            var currentAt = pa.childs.findIndex(g => g == this);
            return pa.childs[currentAt + 1];
        }
        else {
            var currentAt = this.workspace.childs.findIndex(g => g == this);
            return this.workspace.childs[currentAt + 1]
        }
    }
    parentId?: string;
    at: number;
    get index() {
        if (this.parent) return this.parent?.childs.findIndex(g => g === this);
        return this.workspace.childs.findIndex(g => g === this);
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
    }
    get() {
        return {
            id: this.id,
            url: this.url,
            text: this.text,
            sn: this.sn,
            icon: this.icon,
            pageType: this.pageType
        }
    }
    getItem() {
        return {
            id: this.id,
            text: this.text,
            sn: this.sn,
            icon: this.icon,
            pageType: this.pageType,
            parentId: this.parent?.id || null,
            workspaceId: this.workspace.id,
            mime: this.mime,
            share: this.share,
            netPermissions: lodash.cloneDeep(this.netPermissions),
            inviteUsersPermissions: lodash.cloneDeep(this.inviteUsersPermissions),
            memberPermissions: lodash.cloneDeep(this.memberPermissions),
            locker: this.locker,
            description: this.description
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
    async getSubItems() {
        if (!this.checkedHasChilds) {
            var sus = await channel.get('/page/item/subs', { id: this.id });
            runInAction(() => {
                if (sus.ok == true) {
                    this.load({ childs: sus.data.list })
                    this.spread = false;
                }
                this.checkedHasChilds = true;
            })
        }
        return this.childs.map(c => c);

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
        if (this.mime == Mime.pages && await Confirm('确定要删除吗，该操作不可撤消'))
            pageItemStore.deletePageItem(this);
        else pageItemStore.deletePageItem(this);
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
            pageType: this.pageType,
            spread: false,
        };
        var item = await pageItemStore.insertAfterPageItem(this, data);
        await item.onOpenItem();
        var itemS = surface.supervisor.page;
        var ps = PageViewStores.getPageViewStore(this.elementUrl);
        if (ps?.page) {
            var content = await ps?.page.get();
            await itemS.page.onReplace(this.id, content);
        }
        else {
            var pd = await (SnapStore.createSnap(this.elementUrl)).querySnap();
            await itemS.page.onReplace(this.id, pd.content, pd.operates);
        }
        itemS.page.onSave();
        itemS.page.forceUpdate();
    }
    async getPageItemMenus() {
        var items: MenuItem<string>[] = [];
        if (this.mime == Mime.pages) {
            items = [

                {
                    name: 'rename',
                    icon: RenameSvg,
                    text: '编辑分类'
                },
                {
                    name: 'createFolder',
                    icon: FolderPlusSvg,
                    text: '创建分类'
                },
                { type: MenuItemType.divide },
                {
                    name: 'toggleFolder',
                    icon: this.spread ? FolderCloseSvg : FolderOpenSvg,
                    text: this.spread ? "折叠分类" : '展开分类'
                },
                {
                    name: 'unAllFolders',
                    icon: SeoFolderSvg,
                    text: '折叠所有分类'
                },
                { type: MenuItemType.divide },
                {
                    name: 'remove',
                    icon: TrashSvg,
                    text: '删除'
                }
            ]
        }
        else {
            items.push({
                name: 'remove',
                icon: TrashSvg,
                text: '删除'
            });
            items.push({
                type: MenuItemType.divide,
            })
            if (this.pageType == PageLayoutType.doc) {
                items.push({
                    name: 'copy',
                    icon: DuplicateSvg,
                    text: '拷贝'
                });
            }
            items.push({
                name: 'rename',
                icon: RenameSvg,
                text: '重命名'
            });
            items.push({
                type: MenuItemType.divide,
            })
            items.push({
                name: 'link',
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
                    text: '编辑人 ' + r.data.user.name
                });
                if (this.editDate) items.push({
                    type: MenuItemType.text,
                    text: '编辑于 ' + util.showTime(this.editDate)
                });
            }
        }
        return items;
    }
    async onContextmenuClickItem(menuItem: MenuItem<string>, event: MouseEvent) {
        switch (menuItem.name) {
            case 'copy':
                this.onCopy();
                break;
            case 'remove':
                this.onRemove();
                break;
            case 'rename':
                if (this.mime == Mime.page) {
                    var r = await useForm({
                        title: '修改分类名称', fields: [
                            { name: 'title', type: 'input', text: '分类名称' }
                        ],
                        model: { title: this.text },
                        async checkModel(model) {
                            if (!model.text) return '分类名称不能为空'
                            if (model.text.length > 30) return '分类名称过长'
                            return '';
                        }
                    });
                    if (r) {
                        this.onChange({ text: r.title }, true);
                    }
                }
                else {
                    this.onEdit();
                }
                break;
            case 'link':
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
    isAllow(...ps: AtomPermission[]) {
        return true
    }
    getPagePermissions() {
        return []
        // var ps = surface.workspace.memberPermissions;
        // if (surface.workspace.member) {
        //     return ps;
        // } else {
        //     if (this.permission == PagePermission.canEdit) {
        //         return getEditPerssions()
        //     }
        //     else if (this.permission == PagePermission.canInteraction) {
        //         return getCommonPerssions()
        //     }
        //     else {
        //         return []
        //     }
        // }
    }
    find(predict: (item: PageItem) => boolean) {
        return this.childs.arrayJsonFind('childs', predict)
    }
    each(predict: (item: PageItem) => void) {
        this.childs.arrayJsonEach('childs', predict)
    }
}



