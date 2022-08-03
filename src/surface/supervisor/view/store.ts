import { makeObservable, observable } from "mobx";
import { ElementType, parseElementUrl } from "rich/net/element.type";
import { Page } from "rich/src/page";
import { PageSupervisorView } from "./index";
import { surface } from "../..";
import { SnapStore } from "../../../../services/snap/store";
import { Events } from "rich/util/events";
export class PageViewStore extends Events {
    source: 'main' | 'slide' | 'dialog';
    date: number = Date.now();
    elementUrl: string = '';
    page: Page = null;
    view: PageSupervisorView = null;
    snapSaving: boolean = false;
    constructor(options: { elementUrl: string, source?: 'main' | 'slide' | 'dialog' }) {
        super();
        this.elementUrl = options.elementUrl;
        if (options.source) this.source = options.source;
        makeObservable(this, { snapSaving: observable });
        this.init();
    }
    private init() {
        this.snapStore.only('willSave', () => {
            this.snapSaving = true;
            console.log(this.snapSaving, 'willSave');
        });
        this.snapStore.only('saved', () => {
            this.snapSaving = false;
        });
        this.snapStore.only('saveSuccessful', () => {
            if (this.item) {
                this.item.onChange({ editDate: new Date(), editor: surface.user.id })
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
    };
    get pe() {
        if (typeof this._pe == 'undefined')
            this._pe = parseElementUrl(this.elementUrl) as any;
        return this._pe;
    }
    get item() {
        if ([ElementType.PageItem, ElementType.Room, ElementType.Schema].includes(this.pe.type)) {
            return surface.workspace?.find(g => g.id == this.pe.id);
        }
        else if ([ElementType.SchemaView, ElementType.SchemaRecordView].includes(this.pe.type)) {
            return surface.workspace.find(g => g.id == this.pe.id1)
        }
        return null;
    }
    onOpenPageProperty(e: React.MouseEvent) {
        if (this.page) this.page.onPageContextmenu(e);
    }
    onOpenPublish(e: React.MouseEvent) {
        if (this.page)
            this.page.onOpenPublish(e);
    }
    onSearch(e: React.MouseEvent) {

    }
    onMembers(e: React.MouseEvent) {

    }
}

export class PageViewStores {
    private static stores: Map<string, PageViewStore[]> = new Map();
    static createPageViewStore(elementUrl: string, source: PageViewStore['source'] = 'main') {
        var s = this.stores.get(elementUrl);
        if (Array.isArray(s) && s.length > 0) {
            var r = s.find(g => g.source == source)
            if (r) return r;
        }
        var pvs = new PageViewStore({ elementUrl, source });
        if (Array.isArray(s)) s.push(pvs)
        else this.stores.set(elementUrl, [pvs]);
        return pvs;
    }
    static getPageViewStore(elementUrl: string, source: PageViewStore['source'] = 'main') {
        var s = this.stores.get(elementUrl);
        if (Array.isArray(s) && s.length > 0) {
            if (!source) return s[0];
            var r = s.find(g => g.source == source)
            if (r) return r;
        }
    }
}