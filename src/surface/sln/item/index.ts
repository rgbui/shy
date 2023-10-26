
import { util } from "rich/util/util";
import { surface } from "../../store";
import { IconArguments, ResourceArguments } from "rich/extensions/icon/declare";
import { useIconPicker } from 'rich/extensions/icon/index';
import { Rect } from "rich/src/common/vector/point";
import { MenuItem, MenuItemType } from "rich/component/view/menu/declare";
import { Mime } from "../declare";
import { computed, makeObservable, observable, runInAction } from "mobx";
import { pageItemStore } from "./store/sync";
import { channel } from "rich/net/channel";
import { PageLayoutType, getPageText } from "rich/src/page/declare";
import { AtomPermission, getCommonPerssions } from "rich/src/page/permission";
import lodash from "lodash";
import { DuplicateSvg, FolderCloseSvg, FolderOpenSvg, FolderPlusSvg, LinkSvg, LogoutSvg, MoveToSvg, RenameSvg, SeoFolderSvg, TrashSvg } from "rich/component/svgs";
import { CopyText } from "rich/component/copy";
import { ShyAlert } from "rich/component/lib/alert";
import { Confirm } from "rich/component/lib/confirm";
import { useForm } from "rich/component/view/form/dialoug";
import { getPageItemElementUrl } from "./util";
import { Page } from "rich/src/page";
import { lst } from "rich/i18n/store";
import { useWsPicker } from "rich/extensions/ws/index";

export class PageItem {
    id: string = null;
    sn?: number = null;
    fav?: boolean = false;
    fat?: number;
    icon?: IconArguments = null;
    childs?: PageItem[] = [];
    text: string = ''
    public cover: { abled: boolean, url: string, thumb: string, top: number };
    public plain: string;
    public thumb: ResourceArguments;
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
    public editDate: Date = null;
    public editor: string = null;
    speak?: 'more' | 'only' = 'more';
    speakDate?: Date = null;
    textChannelMode?: 'chat' | 'weibo' | 'ask' | 'tieba' = 'chat';
    unreadChats: { id: string, roomId: string, seq: number }[] = [];
    public browse: { count: number, users: string[] }
    public edit: { count?: number, users: string[] }
    public like: { count?: number, users?: string[] }
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
            description: observable,
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
        channel.air('/page/notify/toggle', { id: this.id, visible: this.spread });
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
        if (this.mime == Mime.pages) {
            if (await Confirm(lst('确定要删除吗，该操作不可撤消')))
                pageItemStore.deletePageItem(this);
        }
        else pageItemStore.deletePageItem(this);
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
    async onFav(fav: boolean) {
        if (fav) await pageItemStore.addFav(this);
        else await pageItemStore.removeFav(this);
    }
    async onMove(el: HTMLElement) {
        var r = await useWsPicker({ roundArea: Rect.fromEle(el) });
        if (r) {
            console.log('ggg', r, surface.workspace);
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
                    icon: RenameSvg,
                    text: lst('编辑分类')
                },
                {
                    name: 'createFolder',
                    icon: FolderPlusSvg,
                    text: lst('创建分类')
                },
                { type: MenuItemType.divide },
                {
                    name: 'toggleFolder',
                    icon: this.spread ? FolderCloseSvg : FolderOpenSvg,
                    text: this.spread ? lst("折叠分类") : lst('展开分类')
                },
                {
                    name: 'unAllFolders',
                    icon: SeoFolderSvg,
                    text: lst('折叠所有分类')
                },
                { type: MenuItemType.divide },
                {
                    name: 'remove',
                    icon: TrashSvg,
                    text: lst('删除')
                }
            ]
        }
        else {
            items.push({
                name: 'openRight',
                icon: LogoutSvg,
                text: lst('在右侧边栏打开')
            });
            // items.push({
            //     name: 'fav',
            //     icon: { name: 'bytedance-icon', code: 'star' },
            //     text: this.fav ? lst('取消收藏') : lst('收藏'),
            // });
            items.push({
                type: MenuItemType.divide,
            });
            items.push({
                name: 'link',
                icon: LinkSvg,
                text: lst('复制访问链接')
            });
            items.push({
                name: 'move',
                iconSize: 18,
                icon: { name: 'bytedance-icon', code: 'corner-up-right' },
                text: lst('移动')
            });
            items.push({
                type: MenuItemType.divide,
            })
            if (this.pageType == PageLayoutType.doc) {
                items.push({
                    name: 'copy',
                    icon: DuplicateSvg,
                    text: lst('拷贝副本')
                });
            }
            items.push({
                name: 'rename',
                icon: RenameSvg,
                text: lst('重命名')
            });
            items.push({
                type: MenuItemType.divide,
            })
            items.push({
                name: 'remove',
                icon: TrashSvg,
                text: lst('删除')
            });
            if (this.editor) {
                items.push({
                    type: MenuItemType.divide,
                });
                if (this.editDate) items.push({
                    type: MenuItemType.text,
                    text: lst('编辑于 ') + util.showTime(this.editDate)
                });
                var r = await channel.get('/user/basic', { userid: this.editor });
                if (r?.data?.user) items.push({
                    type: MenuItemType.text,
                    text: lst('编辑人 ') + r.data.user.name
                });
            }
        }
        return items;
    }
    async onContextmenuClickItem(menuItem: MenuItem<string>, event: MouseEvent, sourceEl: HTMLElement) {
        switch (menuItem.name) {
            case 'copy':
                this.onCopy();
                break;
            case 'remove':
                this.onRemove();
                break;
            case 'rename':
                if (this.mime == Mime.pages) {
                    var r = await useForm({
                        title: lst('修改分类名称'),
                        head: false,
                        fields: [
                            { name: 'title', type: 'input', text: lst('分类名称') }
                        ],
                        model: { title: this.text },
                        async checkModel(model) {
                            if (!model.text) return lst('分类名称不能为空')
                            if (model.text.length > 30) return lst('分类名称过长')
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
                this.onSpread();
                break;
            case 'unAllFolders':
                runInAction(() => {
                    surface.workspace.childs.each(g => {
                        g.spread = false;
                    })
                })
                break;
            case 'link':
                CopyText(this.url);
                ShyAlert(lst('访问链接已复制'))
                break;
            case 'openRight':
                var page: Page = await channel.air('/page/slide', { elementUrl: this.elementUrl })
                if (page) {
                    await channel.air('/page/slide', { elementUrl: null });
                }
                break;
            case 'fav':
                this.onFav(this.fav ? false : true);
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
    onContextmenu(event: MouseEvent) {
        this.sln.onOpenItemMenu(this, event);
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
    isAllow(...ps: AtomPermission[]) {
        if (!this.workspace) return false;
        if (this.workspace.isOwner) return true;
        if (this.workspace?.access == 1) {
            //表示是公开的
            return getCommonPerssions().some(s => ps.includes(s))
        }
        if (this.share == 'net' && this.netPermissions?.some(s => ps.includes(s))) return true;
        if (this.workspace?.isMember) {
            // 如果是成员，那么就看成员权限
            var me = this.workspace.member;
            var rs = (this.memberPermissions || []).filter(g => g.userid && g.userid == me.id || g.userid && g.userid == 'all' || g.roleId && me.roleIds.includes(g.roleId));
            if (rs.length == 0) {
                var c = this.workspace.isAllow(...ps);
                if (c) return c;
                else {
                    var pa = this.closest(g => g.isAllow(...ps), true);
                    if (pa) return true;
                    else return false;
                }
            }
            var g = rs.some(s => s.permissions.some(p => ps.includes(p)))
            return g;
        }
        else {
            if (surface.user.isSign) {
                // 如果是登录用户，那么就看登录用户的权限
                var rg = this.inviteUsersPermissions.find(g => g.userid == surface.user.id);
                if (rg) {
                    var d = rg.permissions.some(s => ps.includes(s))
                    if (!d) {
                        if (this.share == 'net' && this.netPermissions) return this.netPermissions.some(s => ps.includes(s))
                        return false;
                    }
                    else return d;
                }
                else return false;
            }
            else {
                if (this.share == 'net' && this.netPermissions) return this.netPermissions.some(s => ps.includes(s))
                return false;
            }
        }
    }
    get isCanEdit() {
        if (surface.isPubSite) return false;
        return this.isAllow(
            AtomPermission.all,
            AtomPermission.docEdit,
            AtomPermission.channelEdit,
            AtomPermission.dbEdit,
            AtomPermission.wsEdit
        )
    }
    find(predict: (item: PageItem) => boolean) {
        return this.childs.arrayJsonFind('childs', predict)
    }
    each(predict: (item: PageItem) => void) {
        this.childs.arrayJsonEach('childs', predict)
    }
}




