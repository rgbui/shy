
import { util } from "rich/util/util";
import { surface } from "../../app/store";
import { IconArguments, ResourceArguments } from "rich/extensions/icon/declare";
import { useIconPicker } from 'rich/extensions/icon/index';
import { Rect } from "rich/src/common/vector/point";
import { MenuItem, MenuItemType } from "rich/component/view/menu/declare";
import { Mime } from "../declare";
import { computed, makeObservable, observable, runInAction } from "mobx";
import { pageItemStore } from "./store/sync";
import { channel } from "rich/net/channel";
import { PageLayoutType, getPageText } from "rich/src/page/declare";
import { AtomPermission, getCommonPermission, getDenyPermission } from "rich/src/page/permission";
import { DuplicateSvg, FolderCloseSvg, FolderOpenSvg, FolderPlusSvg, LinkSvg, LogoutSvg, PlusAreaSvg, TrashSvg } from "rich/component/svgs";
import { CopyText } from "rich/component/copy";
import { ShyAlert } from "rich/component/lib/alert";
import { Confirm } from "rich/component/lib/confirm";
import { useForm } from "rich/component/view/form/dialoug";
import { getPageItemElementUrl, itemIsPermissons } from "./util";
import { Page } from "rich/src/page";
import { lst } from "rich/i18n/store";
import { useWsPicker } from "rich/extensions/ws/index";
import { useInputIconAndText } from "rich/component/view/input/iconAndText";
import { UA } from "rich/util/ua";
import { PopoverPosition } from "rich/component/popover/position";
import lodash from "lodash";

export class PageItem {
    id: string = null;
    sn?: number = null;
    icon?: IconArguments = null;
    childs?: PageItem[] = [];
    text: string = ''
    public cover: { abled: boolean, url: string, thumb: string, top: number };
    public plain: string;
    public thumb: ResourceArguments;
    spread: boolean = false;
    description: { abled: boolean, text: string } = null;
    createDate: Date = null;
    creater: string = null;
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
     * 互联网公开的权限
     */
    public netPermissions: AtomPermission[] = [];
    /**
     * 特定的用户权限
     */
    public inviteUsersPermissions: { userid: string, permissions: AtomPermission[] }[] = [];
    /**
     * 空间成员权限，
     * 可以指定角色，也可以指定具体的人
     */
    public memberPermissions: { roleId: string, permissions: AtomPermission[] }[] = [];
    public editDate: Date = null;
    public editor: string = null;
    speak?: 'more' | 'only' = 'more';
    speakDate?: Date = null;
    unreadChats: { id: string, roomId: string, seq: number }[] = [];
    public browse: { count: number, users: string[] }
    public edit: { count?: number, users: string[] }
    public like: { count?: number, users?: string[] }
    public denyPublicAccess: boolean
    public review: {
        approved: boolean,
        approvedDate: Date,
        suggestion: string,
        approvedResult: Record<string, any>,
        seq: number
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
            selectedDate: observable,
            checkedHasChilds: observable,
            willLoadSubs: observable,
            share: observable,
            netPermissions: observable,
            memberPermissions: observable,
            inviteUsersPermissions: observable,
            editDate: observable,
            editor: observable,
            unreadChats: observable,
            pageType: observable,
            subCount: observable,
            isCanEdit: computed
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
        return getPageItemElementUrl(this);
    }
    get workspace() {
        return surface.workspace
    }
    get parent(): PageItem {
        if (this.parentId)
            return this.workspace.find(g => g.id == this.parentId);
    }
    get parents() {
        var rs: PageItem[] = [];
        var pa = this.parent;
        while (pa) {
            rs.push(pa);
            pa = pa.parent;
        }
        return rs;
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
                if (data.childs.length > 0) this.checkedHasChilds = true;
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
            pageType: this.pageType,
            createDate: this.createDate,
            editDate: this.editDate
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

    async onSpread(spread?: boolean, spreadParent?: boolean) {
        var sp = typeof spread == 'boolean' ? !spread : this.spread;
        this.spread = sp == false ? true : false;
        if (this.spread == true && this.checkedHasChilds == false && this.subCount > 0) {
            if (this.checkedHasChilds == false && !(this.childs?.length > 0)) {
                var sus = await channel.get('/page/item/subs', { ws: undefined, id: this.id });
                if (sus.ok == true) {
                    this.load({ childs: sus.data.list })
                }
                this.checkedHasChilds = true;
            }
            else {
                this.checkedHasChilds = true;
            }
        }
        if (spreadParent == true) {
            this.closest(g => {
                if (g.spread == false) {
                    g.spread = true;
                }
                return false;
            })
        }
        channel.act('/page/notify/toggle', { id: this.id, visible: this.spread });
    }
    async getSubItems() {
        if (!this.checkedHasChilds) {
            var sus = await channel.get('/page/item/subs', { ws: undefined, id: this.id });
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
    async onSync(consideSelf?: boolean) {
        if (consideSelf == true) {
            var rg = await channel.get('/page/item', { id: this.id });
            if (rg.ok) {
                var s = this.spread;
                this.load(rg.data.item);
                this.spread = s;
            }
        }
        if (this.checkedHasChilds) {
            var sus = await channel.get('/page/item/subs', { id: this.id, ws: undefined });
            runInAction(() => {
                if (sus.ok == true) {
                    var rs: { id: string, spread: boolean }[] = [];
                    this.each(g => {
                        rs.push({ id: g.id, spread: g.spread })
                    })
                    this.load({ childs: sus.data.list });
                    this.each(g => {
                        var r = rs.find(c => c.id == g.id);
                        if (r) {
                            g.spread = r.spread;
                        }
                    })
                }
                this.checkedHasChilds = true;
            })
        }
    }
    async onAdd(data?: Record<string, any>) {
        if (typeof data == 'undefined') data = {};
        Object.assign(data, {
            text: '',
            mime: Mime.page,
            pageType: PageLayoutType.doc,
            spread: false,
        })
        await this.onSpread(true);
        var item = await pageItemStore.appendPageItem(this, data, this.mime == Mime.pages ? 'pre' : 'last');
        item.onOpenItem();
        return item;
    }
    async onRemove() {
        if (this.mime == Mime.pages) {
            if (await Confirm(lst('确定要删除吗该操作不可撤消', '确定要删除吗，该操作不可撤消')))
                await pageItemStore.deletePageItem(this);
        }
        else await pageItemStore.deletePageItem(this);
    }
    async onCopy() {
        await channel.post('/clone/page', {
            pageId: this.id,
            text: util.getListName(this.parent.childs,
                getPageText(this),
                g => g.text,
                (c, i) => i > 0 ? `${c}(${i})` : `${c}`
            ),
            downPageId: this.id
        })
        var nextItem = this.next
        if (nextItem) {
            nextItem.onOpenItem();
        }
    }
    async onMove(el: HTMLElement) {

        var pos: PopoverPosition;
        if (el) pos = { roundArea: Rect.fromEle(el) }
        else pos = { center: true, centerTop: 100 };
        var r = await useWsPicker(pos);
        if (r) {
            var g = await channel.post('/create/template', { config: { pageId: this.id } })
            if (g.ok) {
                var rr = await channel.post('/import/page', {
                    text: this.text,
                    templateUrl: g.data.file.url,
                    wsId: r.id
                });
                if (rr.ok) {
                    ShyAlert(lst('移动成功'))
                }
            }
        }
    }
    async getPageItemMenus() {
        var items: MenuItem<string>[] = [];
        if (this.mime == Mime.pages) {
            items = [
                {
                    name: 'rename',
                    icon: { name: "byte", code: 'write' },
                    text: lst('重命名'),
                    label: UA.isMacOs ? "⌘+Shift+R" : "Ctrl+Shift+R"
                },
                {
                    name: 'addNewPage',
                    text: lst('添加新页面'),
                    icon: PlusAreaSvg,
                },
                { type: MenuItemType.divide },
                {
                    name: 'createFolder',
                    icon: FolderPlusSvg,
                    text: lst('创建新栏目')
                },
                { type: MenuItemType.divide },
                {
                    name: 'copy',
                    icon: DuplicateSvg,
                    text: lst('拷贝副本'),
                    label: UA.isMacOs ? "⌘+D" : "Ctrl+D"
                },
                {
                    name: 'move',
                    iconSize: 18,
                    icon: { name: 'bytedance-icon', code: 'corner-up-right' },
                    text: lst('移动'),
                    label: UA.isMacOs ? "⌘+Shift+P" : "Ctrl+Shift+P"
                },
                { type: MenuItemType.divide },
                {
                    name: 'toggleFolder',
                    icon: FolderOpenSvg,
                    text: lst('展开所有'),
                    value: true,
                },
                {
                    name: 'toggleFolder',
                    icon: FolderCloseSvg,
                    text: lst('折叠所有'),
                    value: false
                },
                { type: MenuItemType.divide },
                {
                    name: 'remove',
                    icon: TrashSvg,
                    text: lst('删除'),
                    label: 'Del'
                }
            ]
            if (this.editor) {
                items.push({
                    type: MenuItemType.divide,
                });
                var r = await channel.get('/user/basic', { userid: this.editor });
                if (r?.data?.user) items.push({
                    type: MenuItemType.text,
                    text: lst('编辑人 ') + r.data.user.name
                });
                if (this.editDate) items.push({
                    type: MenuItemType.text,
                    text: lst('编辑于 ') + util.showTime(this.editDate)
                });
            }
        }
        else {
            items.push({
                name: 'openRight',
                icon: LogoutSvg,
                text: lst('在右侧边栏打开'),
                label: UA.isMacOs ? "⌥+Click" : "Alt+Click"
            });
            items.push({
                type: MenuItemType.divide,
            });
            items.push({
                name: 'link',
                icon: LinkSvg,
                text: lst('复制访问链接'),
                label: UA.isMacOs ? "⌥+Shift+L" : "Alt+Shift+L"
            });
            items.push({
                name: 'move',
                iconSize: 18,
                icon: { name: 'bytedance-icon', code: 'corner-up-right' },
                text: lst('移动'),
                label: UA.isMacOs ? "⌘+Shift+P" : "Ctrl+Shift+P"
            });
            items.push({
                type: MenuItemType.divide,
            })
            items.push({
                name: 'copy',
                icon: DuplicateSvg,
                text: lst('拷贝副本'),
                label: UA.isMacOs ? "⌘+D" : "Ctrl+D"
            });
            items.push({
                name: 'rename',
                icon: { name: "byte", code: 'write' },
                text: lst('重命名'),
                label: UA.isMacOs ? "⌘+Shift+R" : "Ctrl+Shift+R"
            });
            items.push({
                type: MenuItemType.divide,
            })
            items.push({
                name: 'remove',
                icon: TrashSvg,
                text: lst('删除'),
                label: "Del"
            });
            if (this.editor) {
                items.push({
                    type: MenuItemType.divide,
                });
                var r = await channel.get('/user/basic', { userid: this.editor });
                if (r?.data?.user) items.push({
                    type: MenuItemType.text,
                    text: lst('编辑人 ') + r.data.user.name
                });
                if (this.editDate) items.push({
                    type: MenuItemType.text,
                    text: lst('编辑于 ') + util.showTime(this.editDate)
                });
            }
        }
        return items;
    }
    async onContextmenuClickItem(menuItem: MenuItem<string>, event: MouseEvent, sourceEl: HTMLElement) {
        switch (menuItem.name) {
            case 'addNewPage':
                this.onAdd();
                break;
            case 'copy':
                this.onCopy();
                break;
            case 'remove':
                this.onRemove();
                break;
            case 'rename':
                if (this.mime == Mime.pages) {
                    var rc = await useInputIconAndText({ roundArea: Rect.fromEle(sourceEl) }, { ignoreIcon: true, text: this.text });
                    if (rc) {
                        if (rc.text)
                            rc.text = rc.text.trim();
                        if (rc.text !== this.text) {
                            this.onChange({ text: rc.text }, true);
                        }
                    }
                }
                else {
                    var rc = await useInputIconAndText({ roundArea: Rect.fromEle(sourceEl) }, { icon: this.icon, text: this.text });
                    if (rc) {
                        if (rc.text)
                            rc.text = rc.text.trim();
                        var data: Record<string, any> = {};
                        if (rc.text !== this.text) data.text = rc.text;
                        if (!lodash.isEqual(rc.icon, this.icon)) data.icon = lodash.cloneDeep(rc.icon);
                        if (Object.keys(data).length > 0) {
                            this.onChange(data, true);
                        }
                    }
                }
                break;
            case 'createFolder':
                var r = await useForm({
                    title: lst('创建分类'),
                    fields: [{ name: 'text', text: lst('分类名称'), type: 'input' }],
                    async checkModel(model) {
                        if (!model.text) return lst('分类名称不能为空')
                        if (model.text.length > 30) return lst('分类名称过长')
                        return '';
                    }
                });
                if (r?.text) {
                    surface.sln.onCreateFolder(r.text, this)
                }
                break;
            case 'toggleFolder':
                this.onSpread(menuItem.value as boolean);
                break;
            case 'link':
                CopyText(this.url);
                ShyAlert(lst('访问链接已复制'))
                break;
            case 'openRight':
                var page: Page = await channel.act('/page/slide', { elementUrl: this.elementUrl })
                if (page) {
                    await channel.act('/page/slide', { elementUrl: null });
                }
                break;
            case 'move':
                this.onMove(sourceEl)
                break;
        }
    }
    async onOpenItem() {
        await this.sln.onOpenItem(this);
    }
    onMousedownItem(event: MouseEvent) {
        this.sln.onMousedownItem(this, event);
    }
    async onContextmenu(event: MouseEvent) {
        await this.sln.onOpenItemMenu(this, event);
    }
    async onChangeIcon(event: MouseEvent) {
        var icon = await useIconPicker({ roundArea: Rect.fromEvent(event) });
        if (typeof icon != 'undefined') {
            this.onChange({ icon });
        }
    }
    async onChange(pageInfo: Record<string, any>, force?: boolean, onlyUpdateItem?: boolean) {
        if (force != true) {
            var keys = Object.keys(pageInfo);
            var json = util.pickJson(this, keys);
            if (util.valueIsEqual(json, pageInfo)) return;
        }
        if (onlyUpdateItem !== true)
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
        document.title = getPageText(this);
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
    isAllow(...ps: AtomPermission[]): boolean {
        return this.getUserPermissions()?.permissions.some(s => ps.includes(s)) ? true : false
    }
    get isCanEdit(): boolean {
        if (surface?.workspace?.isPubSite) return false;
        return this.isAllow(
            AtomPermission.pageFull,
            AtomPermission.pageEdit,
            AtomPermission.dbFull,
            AtomPermission.dbEdit
        )
    }
    find(predict: (item: PageItem) => boolean) {
        return this.childs.arrayJsonFind('childs', predict)
    }
    each(predict: (item: PageItem) => void) {
        this.childs.arrayJsonEach('childs', predict)
    }
    getUserPermissions() {
        var keys = [
            'id',
            'text',
            'parentId',
            'icon',
            'pageType',
            'share',
            'netPermissions',
            'memberPermissions',
            'inviteUsersPermissions'
        ]
        var item: PageItem = this;
        var data;
        while (true) {
            var r = itemIsPermissons(surface, lodash.pick(item, keys), false);
            if (r) {
                data = r;
                break;
            }
            else {
                item = item.parent;
                if (!item) break;
            }
        }
        if (data) return data;
        if (surface.workspace.isMember) {
            return surface.workspace.memberPermissions;
        }
        else {
            if (surface.workspace.access == 1) {
                return {
                    soruce: 'workspacePublicAccess',
                    data: { access: surface.workspace.access },
                    permissions: getCommonPermission()
                }
            }
            return {
                soruce: 'workspacePublicAccess',
                data: { access: surface.workspace.access },
                permissions: getDenyPermission()
            }
        }
    }
}




