import { util } from "rich/src/util/util";
import { PageItem } from "../item";
import { Workarea } from "../workarea";
import { WorkareaType } from "../workarea/enum";
import { PagesViewModule } from "../workarea/ms/pages";
import { WorkspaceView } from "./view";
export class Workspace {
    id: string;
    date: number;
    text: string;
    icon: { url: string };
    areas: Workarea[] = [];
    view?: WorkspaceView;
    domain: string;
    get url() {
        return this.domain + '.sy.live';
    }
    load(data) {
        for (var n in data) {
            if (n == 'modules') {
                data.modules.each(module => {
                    this.areas.push(this.createModule(module));
                });
            }
            else {
                this[n] = data[n];
            }
        }
        if (typeof this.id == 'undefined') this.id = util.guid();
        if (typeof this.date == undefined) this.date = Date.now();
    }
    createModule(module: Record<string, any>) {
        var type: WorkareaType = typeof module.type == 'string' ? WorkareaType[module.type] : module.type;
        var mo: Workarea
        switch (type) {
            case WorkareaType.pages:
                mo = new PagesViewModule(this);
                mo.load(module);
                break;
        }
        return mo;
    }
    find(predict: (item: PageItem) => boolean) {
        for (let i = 0; i < this.areas.length; i++) {
            var item = this.areas[i].items.arrayJsonFind('childs', predict);
            if (item) return item;
        }
    }
    remove(predict: (item: PageItem) => boolean) {
        var item = this.find(predict);
        if (item) {
            item.module.items.arrayJsonRemove('childs', g => g == item);
            item.module.view.forceUpdate();
        }
    }
}