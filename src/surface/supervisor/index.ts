
import { Events } from "rich/util/events";
import { Rect } from "rich/src/common/vector/point";
import { makeObservable, observable } from "mobx";
import { PageViewStore, PageViewStores } from "./view/store";
export class Supervisor extends Events {
    constructor() {
        super()
        makeObservable(this, {
            opening: observable,
            main: observable,
            slide: observable
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
    onOpen(elementUrl: string) {
        if (elementUrl == this.main?.elementUrl) return;
        this.opening = true;
        try {
          
            this.main = PageViewStores.createPageViewStore(elementUrl);
        }
        catch (ex) {
            console.error(ex);
        }
        finally {
            this.opening = false;
        }
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
    async onOpenDialog(elementUrl: string) {
        if (elementUrl == this.dialog?.elementUrl) return;
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
            this.slide.page.layout(bound);
        }
    }
    isShowElementUrl(elementUrl: string) {
        if (this.main?.elementUrl == elementUrl) return true;
        if (this.slide?.elementUrl == elementUrl) return true;
        if (this.dialog?.elementUrl == elementUrl) return true;
        return false;
    }
}