import { util } from "rich/src/util/util";
import { PageItem } from "../item";
import { Workarea } from "../workarea";
import { WorkareaType } from "../workarea/enum";
import { PagesViewArea } from "../workarea/ms/pages";
import { WorkspaceView } from "./view";
export class Workspace {
    id: string;
    date: number;
    inc: number;
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
            if (n == 'areas') {
                data.areas.each(area => {
                    this.areas.push(this.createArea(area));
                });
            }
            else {
                this[n] = data[n];
            }
        }
        if (typeof this.id == 'undefined') this.id = util.guid();
        if (typeof this.date == undefined) this.date = Date.now();
    }
    createArea(area: Record<string, any>) {
        var type: WorkareaType = typeof area.type == 'string' ? WorkareaType[area.type] : area.type;
        var mo: Workarea
        switch (type) {
            case WorkareaType.pages:
                mo = new PagesViewArea(this);
                mo.load(area);
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
            item.area.items.arrayJsonRemove('childs', g => g == item);
            item.area.view.forceUpdate();
        }
    }
}