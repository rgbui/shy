
import { Events } from "rich/util/events";
import { Rect } from "rich/src/common/vector/point";
import { makeObservable, observable } from "mobx";
import { PageViewStore, PageViewStores } from "./view/store";
import { ElementType, getElementUrl, parseElementUrl } from "rich/net/element.type";
import { surface } from "../app/store";
import { isMobileOnly } from "react-device-detect";
import { TableSchema } from "rich/blocks/data-grid/schema/meta";

export class Supervisor extends Events {
    constructor() {
        super()
        makeObservable(this, {
            opening: observable,
            page: observable,
            slide: observable,
            dialog: observable,
            slide_pos: observable
        })
    }
    slide_pos: number = 50
    /**
     * 主页面
     */
    page: PageViewStore = null;
    /**
     * 侧边页
     */
    slide: PageViewStore = null;
    /**
     * 对话框页面
     */
    dialog: PageViewStore = null;
    elementUrls: { date: Date, elementUrl: string, source: PageViewStore['source'] }[] = [];
    async onOpen(elementUrl: string, config?: PageViewStore['config']) {
        if (window.shyConfig.isDev)
            console.log('open', elementUrl, config);
        if (isMobileOnly) {
            surface.mobileSlnSpread = false;
        }
        if (!elementUrl) {
            console.trace(elementUrl);
            return;
        }
        if (elementUrl == this.page?.elementUrl && config?.force !== true) return;
        this.elementUrls.push({ date: new Date(), elementUrl, source: 'page' })
        if (this.elementUrls.length > 20) this.elementUrls = this.elementUrls.slice(-20)
        this.opening = true;
        try {
            var pe = parseElementUrl(elementUrl)
            var schemaViewRecordTemplateUrl;
            if (pe.type == ElementType.SchemaRecordViewData) {
                var schema = await TableSchema.loadTableSchema(pe.id, surface.workspace);
                if (schema) {
                    var view = schema.views.find(x => x.id == pe.id1);
                    if (view && view.formType == 'doc-detail') {
                        schemaViewRecordTemplateUrl = getElementUrl(ElementType.SchemaRecordView, schema.id, view.id);
                        if (!config) config = {}
                        config.force = true;
                    }
                }
            }
            var mainStore = PageViewStores.createPageViewStore(schemaViewRecordTemplateUrl ? schemaViewRecordTemplateUrl : elementUrl, 'page', config);
            if (schemaViewRecordTemplateUrl) mainStore.customElementUrl = elementUrl;
            /**
             * 这里打开的elementType，但workspace没有，需要递归查找
             * 对于Schema可能需要自动创建
             */
            if (mainStore.elementUrl && !mainStore.item && [
                ElementType.PageItem,
                ElementType.Room,
                ElementType.Schema,
                ElementType.SchemaRecordView
            ].includes(mainStore.pe.type)) {
                if (mainStore.pe.type == ElementType.SchemaRecordView) {
                    if (config?.createItemForm)
                        await surface.workspace.onLoadElementUrl(elementUrl, typeof config?.createItemForm == 'string' ? config?.createItemForm : undefined);
                }
                else await surface.workspace.onLoadElementUrl(elementUrl);
            }
            this.page = mainStore;
        }
        catch (ex) {
            console.error(ex);
        }
        finally {
            this.opening = false;
        }
    }
    async onOpenSlide(elementUrl: string, config?: PageViewStore['config']) {
        if (elementUrl == this.slide?.elementUrl && config?.force !== true) return;
        if (!elementUrl) { PageViewStores.clearPageViewStore(this.slide); this.slide = null; }
        else {
            var pe = parseElementUrl(elementUrl)
            var schemaViewRecordTemplateUrl;
            if (pe.type == ElementType.SchemaRecordViewData) {
                var schema = await TableSchema.loadTableSchema(pe.id, surface.workspace);
                if (schema) {
                    var view = schema.views.find(x => x.id == pe.id1);
                    if (view && view.formType == 'doc-detail') {
                        schemaViewRecordTemplateUrl = getElementUrl(ElementType.SchemaRecordView, schema.id, view.id);
                        if (!config) config = {}
                        config.force = true;
                    }
                }
            }
            var slide = PageViewStores.createPageViewStore(schemaViewRecordTemplateUrl || elementUrl, 'slide', config)
            if (schemaViewRecordTemplateUrl) slide.customElementUrl = elementUrl;
            this.slide=slide;
        }
        if (this.slide) {
            if (config?.wait === false) return;
            return new Promise((resolve, reject) => {
                this.only('closeSlide', () => {
                    PageViewStores.clearPageViewStore(this.slide);
                    this.slide = null;
                    resolve(true)
                })
            })
        }
    }
    /**
     * 这里打开elementUrl
     * @param elementUrl 
     */
    async onOpenDialog(elementUrl: string, config?: PageViewStore['config']) {
        if (elementUrl && elementUrl == this.dialog?.elementUrl && config?.force !== true) return;
        if (!elementUrl) { PageViewStores.clearPageViewStore(this.dialog); this.dialog = null; }
        else {
            var pe = parseElementUrl(elementUrl)
            var schemaViewRecordTemplateUrl;
            if (pe.type == ElementType.SchemaRecordViewData) {
                var schema = await TableSchema.loadTableSchema(pe.id, surface.workspace);
                if (schema) {
                    var view = schema.views.find(x => x.id == pe.id1);
                    if (view && view.formType == 'doc-detail') {
                        schemaViewRecordTemplateUrl = getElementUrl(ElementType.SchemaRecordView, schema.id, view.id);
                        if (!config) config = {}
                        config.force = true;
                    }
                }
            }
            var dialog = PageViewStores.createPageViewStore(schemaViewRecordTemplateUrl || elementUrl, 'dialog', config);
             if (schemaViewRecordTemplateUrl) dialog.customElementUrl = elementUrl;
             this.dialog=dialog;
        }
        if (this.dialog) {
            if (config?.wait === false) return;
            return new Promise((resolve, reject) => {
                this.only('closeDialog', () => {
                    PageViewStores.clearPageViewStore(this.dialog);
                    this.dialog = null;
                    resolve(true)
                })
            })
        }
    }
    opening: boolean = false;
    async autoLayout() {
        if (this.page?.page) {
            var bound = Rect.fromEle(this.page.view.pageEl);
            this.page.page.layout(bound);
        }
        if (this.slide?.page) {
            var bound = Rect.fromEle(this.slide.view.pageEl);
            this.slide.page.layout(bound);
        }
        if (this.dialog?.page) {
            var bound = Rect.fromEle(this.dialog.view.pageEl);
            this.dialog?.page.layout(bound);
        }
    }
    closeDialogOrSlide() {
        if (this.dialog) { PageViewStores.clearPageViewStore(this.dialog); this.dialog = null; }
        if (this.slide) { PageViewStores.clearPageViewStore(this.slide); this.slide = null; }
    }
    openDialogOrSlideToPage() {
        var ele = this.dialog ? this.dialog.elementUrl : undefined;
        if (!ele && this.slide) ele = this.slide.elementUrl;
        if (ele) {
            this.closeDialogOrSlide();
            this.onOpen(ele);
        }
    }
    async changeSlideOrDialogToPage() {
        var ele = this.dialog ? this.dialog.elementUrl : undefined;
        if (!ele && this.slide) ele = this.slide.elementUrl;
        var pe = this.page?.elementUrl;
        if (ele && pe) {
            await this.onOpen(ele);
            if (this.dialog) await this.onOpenDialog(pe)
            else if (this.slide) await this.onOpenSlide(pe)
        }
    }
}