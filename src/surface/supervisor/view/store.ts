import { makeObservable, observable } from "mobx";
import { ElementType, parseElementUrl } from "rich/net/element.type";
import { Page } from "rich/src/page";
import { PageSupervisorView } from "./index";
import { surface } from "../../store";
import { SnapStore } from "../../../../services/snap/store";
import { Events } from "rich/util/events";
import lodash from "lodash";
import { PageLayoutType } from "rich/src/page/declare";
import { PageSupervisorDialog } from "./dialoug";
import { PageItem } from "../../sln/item";
import { PageDirective } from "rich/src/page/directive";

export class PageViewStore extends Events {
    source: 'page' | 'slide' | 'dialog' | 'popup';
    createDate: number = Date.now();
    openDate: number = Date.now();
    elementUrl: string = '';
    page: Page = null;
    view: PageSupervisorView | PageSupervisorDialog = null;
    snapSaving: boolean = false;
    config?: {
        force?: boolean,
        type?: PageLayoutType,
        isTemplate?: boolean,
        blockId?: string,
        initData?: Record<string, any>,
        isCanEdit?: boolean,
        wait?: boolean
    } = {};
    constructor(options: { elementUrl: string, source?: PageViewStore['source'], config?: PageViewStore['config'] }) {
        super();
        this.elementUrl = options.elementUrl;
        if (options.source) this.source = options.source;
        if (options.config) this.config = lodash.cloneDeep(options.config);
        else this.config = {}
        makeObservable(this, { snapSaving: observable });
        this.init();
    }
    private init() {
        this.snapStore.only('willSave', () => {
            this.snapSaving = true;
            if (this.page) this.page.emit(PageDirective.willSave)
        });
        this.snapStore.only('saved', () => {
            this.snapSaving = false;
            if (this.page) this.page.emit(PageDirective.saved)
        });
        this.snapStore.only('saveSuccessful', () => {
            if (this.item) {
                this.item.onChange({ editDate: new Date(), editor: surface.user.id }, undefined, true)
            }
        });
    }
    get snapStore() {
        return SnapStore.createSnap(this.elementUrl);
    }
    private _pe: {
        type: ElementType;
        id: string;
        id1: string;
        id2: string;
    }
    get pe() {
        if (typeof this._pe == 'undefined')
            this._pe = parseElementUrl(this.elementUrl) as any;
        return this._pe;
    }
    cachePageItem: PageItem;
    get item() {
        if (this.cachePageItem) return this.cachePageItem;
        if (this.elementUrl && [ElementType.PageItem, ElementType.Room, ElementType.Schema].includes(this.pe.type)) {
            return surface.workspace?.find(g => g.id == this.pe.id);
        }
        else if (this.elementUrl && [ElementType.SchemaView, ElementType.SchemaRecordView].includes(this.pe.type)) {
            return surface.workspace.find(g => g.id == this.pe.id1)
        }
        return null;
    }
    async loadConfig(config?: PageViewStore['config']) {
        if (config) this.config = lodash.cloneDeep(config);
        else this.config = {}
    }
    updateElementUrl(elementUrl: string) {
        if (elementUrl != this.elementUrl) {
            var pvs = PageViewStores.stores.get(this.elementUrl);
            if (Array.isArray(pvs)) {
                lodash.remove(pvs, c => c == this)
            }
            this.elementUrl = elementUrl;
            PageViewStores.createPageViewStore(this.elementUrl, this.source, this.config);
        }
    }
    async clear() {

    }
    onDestroy() {

    }
}

export class PageViewStores {
    static stores: Map<string, PageViewStore[]> = new Map();
    static createPageViewStore(elementUrl: string, source: PageViewStore['source'] = 'page', config?: PageViewStore['config']) {
        var s = this.stores.get(elementUrl);
        if (Array.isArray(s) && s.length > 0) {
            if (config?.force == true) {
                var c = s.find(g => g.source == source);
                if (c) {
                    c.onDestroy();
                    lodash.remove(s, g => g.source == source);
                }
            }
            else {
                var r = s.find(g => g.source == source);
                if (r) {
                    if (r.openDate < Date.now() - 1000 * 60 * 5) {
                        r.onDestroy();
                        lodash.remove(s, g => g === r);
                        r = null;
                    }
                    else r.openDate = Date.now();
                    if (r) {
                        r.loadConfig(config);
                        return r;
                    }
                }
            }
        }
        var pv = new PageViewStore({ elementUrl, source, config });
        pv.loadConfig(config);
        if (Array.isArray(s)) s.push(pv)
        else this.stores.set(elementUrl, [pv]);
        return pv;
    }
    static getPageViewStore(elementUrl: string, source: PageViewStore['source'] = 'page') {
        var s = this.stores.get(elementUrl);
        if (Array.isArray(s) && s.length > 0) {
            if (!source) return s[0];
            var r = s.find(g => g.source == source)
            if (r) return r;
        }
    }
    static async clearPageViewStore() {
        for (var [k, v] of this.stores) {
            await v.clear()
        }
        this.stores.clear();
    }
}

