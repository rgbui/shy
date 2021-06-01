import { util } from "rich/src/util/util";
import { PageItem } from "../item";
import { WorkspaceModule } from "../module/base";
import { WorkspaceModuleType } from "../module/enum";
import { PagesViewModule } from "../module/ms/pages";
import { WorkspaceView } from "./view";
export class Workspace {
    id: string;
    date: number;
    title: string;
    profile_photo: string;
    modules: WorkspaceModule[] = [];
    view?: WorkspaceView;
    domain: string;
    get url() {
        return this.domain + '.sy.live';
    }
    load(data) {
        for (var n in data) {
            if (n == 'modules') {
                data.modules.each(module => {
                    this.modules.push(this.createModule(module));
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
        var type: WorkspaceModuleType = typeof module.type == 'string' ? WorkspaceModuleType[module.type] : module.type;
        var mo: WorkspaceModule
        switch (type) {
            case WorkspaceModuleType.pages:
                mo = new PagesViewModule(this);
                mo.load(module);
                break;
        }
        return mo;
    }
    find(predict: (item: PageItem) => boolean) {
        for (let i = 0; i < this.modules.length; i++) {
            var item = this.modules[i].items.arrayJsonFind('childs', predict);
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
    async get() {
        var json: Record<string, any> = {
            id: this.id,
            title: this.title,
            profile_photo: this.profile_photo,
            modules: this.modules.map(g => g.get()),
            domain: this.domain
        };
        return json;
    }
}