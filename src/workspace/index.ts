import { util } from "rich/util/util";
import { IconArguments } from "../../../rich/extensions/icon/declare";
import { PageItem } from "../sln/item";
export class Workspace {
    id: string;
    date: number;
    sn: number;
    text: string;
    icon: IconArguments;
    childs: PageItem[] = [];
    domain: string;
    get url() {
        return this.domain + '.sy.live';
    }
    load(data) {
        for (var n in data) {
            if (n == 'childs') {
                data[n].each(it => {
                    var pt = new PageItem();
                    pt.load(it);
                    this.childs.push(pt);
                })
            }
            else {
                this[n] = data[n];
            }
        }
        if (typeof this.id == 'undefined') this.id = util.guid();
        if (typeof this.date == undefined) this.date = Date.now();
    }
    find(predict: (item: PageItem) => boolean) {
        return this.childs.arrayJsonFind('childs', predict)
    }
}