
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
            main: observable,
            slide: observable,
            dialog: observable
        })
    }
    /**
     * 主页面
     */
    main: PageViewStore = null;
    /**
     * 侧边页
     */
    slide: PageViewStore = null;
    /**
     * 对话框页面
     */
    dialog: PageViewStore = null;
    time;
    async onOpen(elementUrl: string) {
        if (elementUrl == this.main?.elementUrl) return;
        this.opening = true;
        if (this.time) { clearInterval(this.time); this.time = null; }
        try {
            var mainStore = PageViewStores.createPageViewStore(elementUrl);
            /**
             * 这里打开的elementType，但workspace没有，需要递归查找
             * 对于Schema可能需要自动创建
             */
            if (!mainStore.item && [
                ElementType.PageItem,
                ElementType.Room,
                ElementType.Schema
            ].includes(mainStore.pe.type)) await surface.workspace.onLoadElementUrl(elementUrl);
            this.main = mainStore;
            if (this.main.item) timService.enterWorkspaceView(
                this.main.item.workspace.id,
                this.main.item.id
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
        if (this.main.item)
            timService.enterWorkspaceView(
                this.main.item.workspace.id,
                this.main.item.id
            )
    }
    onOpenSlide(elementUrl: string) {
        if (elementUrl == this.slide?.elementUrl) return;
        if (!elementUrl) this.slide = null;
        else this.slide = PageViewStores.createPageViewStore(elementUrl, 'slide')
    }
    /**
     * 这里打开elementUrl
     * @param elementUrl 
     */
    async onOpenDialog(elementUrl: string, config?: PageViewStore['config']) {
        if (elementUrl && elementUrl == this.dialog?.elementUrl) return;
        if (!elementUrl) this.dialog = null;
        else this.dialog = PageViewStores.createPageViewStore(elementUrl, 'dialog');
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
        if (this.main?.page) {
            var bound = Rect.fromEle(this.main.view.pageEl);
            this.main.page.layout(bound);
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
        if (this.main?.elementUrl == elementUrl) return true;
        if (this.slide?.elementUrl == elementUrl) return true;
        if (this.dialog?.elementUrl == elementUrl) return true;
        return false;
    }
    closeDialogOrSlide() {
        if (this.dialog) this.dialog = null;
        if (this.slide) this.slide = null;
    }
}