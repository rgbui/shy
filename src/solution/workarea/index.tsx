import React from "react";
import { util } from "rich/src/util/util";
import { PageItem } from "../item";
import { Workspace } from "../../workspace";
import { WorkareaType } from "./enum";

export class Workarea {
    constructor(workspace: Workspace) {
        this.workspace = workspace;
    }
    id: string;
    date: number;
    type: WorkareaType;
    text: string;
    items: PageItem[] = [];
    spread: boolean;
    workspace: Workspace;
    load(data) {
        this.items = [];
        for (var n in data) {
            if (n == 'items') {
                data.items.each(child => {
                    var item = new PageItem();
                    item.area = this;
                    item.load(child);
                    this.items.push(item);
                });
            }
            else if (n == 'type') {
                if (typeof data[n] == 'string') {
                    this.type = WorkareaType[data[n]] as any;
                }
                else {
                    this[n] = data[n];
                }
            }
            else {
                this[n] = data[n];
            }
        }
        if (typeof this.id == 'undefined') this.id = util.guid();
        if (typeof this.date == 'undefined') this.date = Date.now();
    }
    get() {
        return {
            type: this.type,
            text: this.text,
            items: this.items.map(item => {
                return item.get()
            }),
            spread: this.spread
        }
    }
    view: React.Component;
    onSpread(spread?: boolean) {
        var sp = typeof spread != 'undefined' ? spread : this.spread;
        this.spread = sp == false ? true : false;
        this.view.forceUpdate();
    }
}

