
import { Events } from "rich/util/events";
import { Rect } from "rich/src/common/vector/point";
import { makeObservable, observable } from "mobx";
import { PageViewStore, PageViewStores } from "./view/store";
import { timService } from "../../../net/primus";
import { ElementType } from "rich/net/element.type";
import { surface } from "..";

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
    time;
    async onOpen(elementUrl: string, config?: PageViewStore['config']) {
        if (elementUrl == this.page?.elementUrl) return;
        this.opening = true;
        if (this.time) { clearInterval(this.time); this.time = null; }
        try {
            var mainStore = PageViewStores.createPageViewStore(elementUrl, 'page', config);
            /**
             * 这里打开的elementType，但workspace没有，需要递归查找
             * 对于Schema可能需要自动创建
             */
            if (!mainStore.item && [
                ElementType.PageItem,
                ElementType.Room,
                ElementType.Schema
            ].includes(mainStore.pe.type)) await surface.workspace.onLoadElementUrl(elementUrl);
            this.page = mainStore;
            if (this.page.item) timService.enterWorkspaceView(
                this.page.item.workspace.id,
                this.page.item.id
            )
            /**
             * 3小时主动同步一次，服务器缓存用户所在的视图在线状态过期时间是6小时
             */
            this.time = setInterval(() => this.syncWorkspaceView(), 1000 * 60 * 60 * 3);
        }
        catch (ex) {
            console.error(ex);
        }
        finally {
            this.opening = false;
        }
    }
    async syncWorkspaceView() {
        if (this.page.item)
            timService.enterWorkspaceView(
                this.page.item.workspace.id,
                this.page.item.id
            )
    }
    async onOpenSlide(elementUrl: string, config?: PageViewStore['config']) {
        if (elementUrl == this.slide?.elementUrl) return;
        if (!elementUrl) this.slide = null;
        else this.slide = PageViewStores.createPageViewStore(elementUrl, 'slide', config)
        if (this.slide) {
            return new Promise((resolve, reject) => {
                this.slide.only('close', () => {
                    resolve(this.slide.page);
                })
            })
        }
    }
    /**
     * 这里打开elementUrl
     * @param elementUrl 
     */
    async onOpenDialog(elementUrl: string, config?: PageViewStore['config']) {
        if (elementUrl && elementUrl == this.dialog?.elementUrl) return;
        if (!elementUrl) this.dialog = null;
        else this.dialog = PageViewStores.createPageViewStore(elementUrl, 'dialog', config);
        if (this.dialog) {
            return new Promise((resolve, reject) => {
                this.dialog.only('close', () => {
                    resolve(this.dialog.page);
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