import { makeObservable, observable } from "mobx";
import { ElementType, getElementUrl, parseElementUrl } from "rich/net/element.type";
import { Page } from "rich/src/page";
import { PageSupervisorView } from "./index";
import { surface } from "../..";
import { SnapStore } from "../../../../services/snap/store";
import { Events } from "rich/util/events";
import { useSearchBox } from "rich/extensions/search/index";
import lodash from "lodash";
import { PageLayoutType } from "rich/src/page/declare";
import { PageSupervisorDialog } from "./dialoug";
import { TableSchema } from "rich/blocks/data-grid/schema/meta";
import { PageItem } from "../../sln/item";

export class PageViewStore extends Events {
    source: 'main' | 'slide' | 'dialog';
    date: number = Date.now();
    elementUrl: string = '';
    page: Page = null;
    view: PageSupervisorView | PageSupervisorDialog = null;
    snapSaving: boolean = false;
    config?: { type?: PageLayoutType } = {};
    constructor(options: { elementUrl: string, source?: 'main' | 'slide' | 'dialog', config?: PageViewStore['config'] }) {
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
        var url = this.elementUrl;
        if (this.pe.type == ElementType.SchemaRecordViewData) {
            url = getElementUrl(ElementType.SchemaRecordView, this.pe.id, this.pe.id1)
        }
        return SnapStore.createSnap(url);
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
        if ([ElementType.PageItem, ElementType.Room, ElementType.Schema].includes(this.pe.type)) {
            return surface.workspace?.find(g => g.id == this.pe.id);
        }
        else if ([ElementType.SchemaView, ElementType.SchemaRecordView].includes(this.pe.type)) {
            return surface.workspace.find(g => g.id == this.pe.id1)
        }
        else if ([ElementType.SchemaFieldBlogData].includes(this.pe.type)) {

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
    onOpenFieldProperty(e: React.MouseEvent) {
        if (this.page)
            this.page.onOpenFieldProperty(e);
    }
    async onSearch(e: React.MouseEvent) {
        await useSearchBox({ isNav: true })
    }
    onMembers(e: React.MouseEvent) {
        if (this.page)
            this.page.openMember(e);
    }
    async loadConfig(config?: PageViewStore['config']) {
        if (config) this.config = lodash.cloneDeep(config);
        else this.config = {}
    }
    async getSchema() {
        if ([ElementType.SchemaView,

        ElementType.SchemaFieldBlogData,
        ElementType.SchemaFieldData,
        ElementType.SchemaFieldNameData,

        ElementType.SchemaRecordView,
        ElementType.SchemaRecordViewData,

        ElementType.Schema].includes(this.pe.type)) {
            return await TableSchema.loadTableSchema(this.pe.id)
        }
    }
    async getSchemaRow() {
        if ([
            ElementType.SchemaFieldBlogData,
            ElementType.SchemaFieldData,
            ElementType.SchemaFieldNameData,
            ElementType.SchemaRecordViewData
        ].includes(this.pe.type)) {
            var schema = await this.getSchema()
            var row = await schema.rowGet(this.pe.id2);
            if (row) return row.data.data;
        }
    }
    async getSchemaRowField() {
        if ([
            ElementType.SchemaFieldBlogData,
            ElementType.SchemaFieldData,
            ElementType.SchemaFieldNameData
        ].includes(this.pe.type)) {
            var row = await this.getSchemaRow();
            if (row) {
                var schema = await this.getSchema();
                var field = schema.fields.find(g => g.id == this.pe.id1 || g.name == this.pe.id1);
                return field.getValue(row)
            }
        }
    }
    async storeRowFieldContent(data: Record<string, any>) {
        var schema = await this.getSchema();
        var row = await this.getSchemaRow();
        var field = schema.fields.find(g => g.id == this.pe.id1 || g.name == this.pe.id1);
        await schema.rowUpdateFieldObject({ rowId: row.id, fieldName: field.name, data })
    }
}

export class PageViewStores {
    private static stores: Map<string, PageViewStore[]> = new Map();
    static createPageViewStore(elementUrl: string, source: PageViewStore['source'] = 'main', config?: PageViewStore['config']) {
        var s = this.stores.get(elementUrl);
        if (Array.isArray(s) && s.length > 0) {
            var r = s.find(g => g.source == source)
            if (r) {
                if (config) r.loadConfig(config);
                return r;
            }
        }
        var pvs = new PageViewStore({ elementUrl, source, config });
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

