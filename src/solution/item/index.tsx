
import { util } from "rich/src/util/util";
import { eventBus } from "../../common/event/event.bus";
import { EventName } from "../../common/event/event.name";
import { Mime } from "./mine";
import { WorkspaceModule } from "../module/base";
import { PageItemView } from "./view";
import { surface } from "../../surface";
import { PageItemBox } from "./box";
export class PageItem {
    id: string;
    childs?: PageItem[];
    text: string;
    spread: boolean = false;
    view: PageItemView;
    viewChilds: PageItemBox;
    module: WorkspaceModule;
    mime: Mime;
    get solution() {
        return surface.solution;
    }
    /***
     * 用户设置的路径
     */
    uri: string;
    get path() {
        if (this.uri) return this.uri;
        else return '/' + this.id;
    }
    get url() {
        return this.workspace.url + this.path;
    }
    get workspace() {
        return this.module.workspace;
    }
    parent?: PageItem;
    load(data) {
        for (var n in data) {
            if (n == 'childs') {
                this.childs = [];
                data.childs.each(child => {
                    var item = new PageItem();
                    item.parent = this;
                    item.module = this.module;
                    item.load(child);
                    this.childs.push(item);
                });
            }
            else {
                this[n] = data[n];
            }
        }
    }
    get() {
        return {
            id: this.id,
            childs: Array.isArray(this.childs) ? this.childs.map(c => c.get()) : undefined,
            text: this.text,
            spread: this.spread,
            mime: this.mime,
            uri: this.uri
        }
    }
    onSpread(spread?: boolean) {
        var sp = typeof spread != 'undefined' ? spread : this.spread;
        this.spread = sp == false ? true : false;
        if (this.view)
            this.view.forceUpdate();
        else console.error('not found item view when spread')
    }
    onAdd() {
        var item = new PageItem();
        item.id = util.guid();
        item.text = '新页面';
        item.mime = Mime.page;
        item.module = this.module;
        item.spread = false;
        this.spread = true;
        if (!Array.isArray(this.childs)) this.childs = [];
        this.childs.insertAt(0, item);
        if (this.view) this.view.forceUpdate();
        else console.error('not found item view when add child')
    }
    onOpenProperty(event: MouseEvent) {
        // surface.pageItemMenuView.openItem(this, event);
    }
    onMousedown(event: MouseEvent) {
        eventBus.emit(EventName.selectPageItem, this, event);
    }
}

