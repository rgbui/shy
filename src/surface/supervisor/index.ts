
import { Events } from "rich/util/events";
import { Rect } from "rich/src/common/vector/point";
import { makeObservable, observable } from "mobx";
import { PageViewStore, PageViewStores } from "./view/store";
import { ElementType } from "rich/net/element.type";
import { surface } from "../store";
import { isMobileOnly } from "react-device-detect";

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
            var mainStore = PageViewStores.createPageViewStore(elementUrl, 'page', config);
            /**
             * 这里打开的elementType，但workspace没有，需要递归查找
             * 对于Schema可能需要自动创建
             */
            if (mainStore.elementUrl && !mainStore.item && [
                ElementType.PageItem,
                ElementType.Room,
                ElementType.Schema
            ].includes(mainStore.pe.type)) {
                await surface.workspace.onLoadElementUrl(elementUrl);
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
        if (!elementUrl) this.slide = null;
        else this.slide = PageViewStores.createPageViewStore(elementUrl, 'slide', config)
        if (this.slide) {
            if (config?.wait === false) return;
            return new Promise((resolve, reject) => {
                this.only('closeSlide', () => {
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
        if (!elementUrl) this.dialog = null;
        else this.dialog = PageViewStores.createPageViewStore(elementUrl, 'dialog', config);
        if (this.dialog) {
            if (config?.wait === false) return;
            return new Promise((resolve, reject) => {
                this.only('closeDialog', () => {
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
    isShowElementUrl(elementUrl: string) {
        if (this.page?.elementUrl == elementUrl) return true;
        if (this.slide?.elementUrl == elementUrl) return true;
        if (this.dialog?.elementUrl == elementUrl) return true;
        return false;
    }
    closeDialogOrSlide() {
        if (this.dialog) this.dialog = null;
        if (this.slide) this.slide = null;
    }
}