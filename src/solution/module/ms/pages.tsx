import React from "react";
import { Icon } from "rich/src/component/icon";
import { util } from "rich/src/util/util";
import { PageItem } from "../../item";
import { PageItemBox } from "../../item/box";
import { Mime } from "../../item/mine";
import { Workspace } from "../../workspace";
import { WorkspaceModule } from "../base";
import { WorkspaceModuleType } from "../enum";

export class PagesViewModule extends WorkspaceModule {
    type: WorkspaceModuleType;
    text: string;
    items: PageItem[];
    spread?: boolean;
    workspace: Workspace;
    load(data) {
        for (var n in data) {
            if (n == 'items') {
                this.items = [];
                data.items.each(child => {
                    var item = new PageItem();
                    item.module = this;
                    item.load(child);
                    this.items.push(item);
                });
            }
            else {
                this[n] = data[n];
            }
        }
    }
    get() {
        return {
            name: this.type,
            text: this.text,
            items: this.items.map(item => {
                return item.get()
            }),
            spread: this.spread
        }
    }
    view: PagesViewModuleView;
    onAddItem() {
        var item = new PageItem();
        item.id = util.guid();
        item.text = '新页面';
        item.module = this;
        item.spread = false;
        item.mime = Mime.page;
        this.spread = true;
        this.items.insertAt(0, item);
        this.view.forceUpdate();
    }
    onSpread(spread?: boolean) {
        var sp = typeof spread != 'undefined' ? spread : this.spread;
        this.spread = sp == false ? true : false;
        this.view.forceUpdate();
    }
}
export class PagesViewModuleView extends React.Component<{ module: PagesViewModule }> {
    constructor(props) {
        super(props);
        this.props.module.view = this;
    }
    get module() {
        return this.props.module;
    }
    render() {
        return <div className='sy-ws-module' key={this.module.id}>
            <div className='sy-ws-module-head'>
                <span onMouseDown={e => this.module.onSpread()}>{this.module.text || "我的页面"}</span>
            </div>
            <div className='sy-ws-module-operators'>
                <Icon icon='add:sy' mousedown={e => this.module.onAddItem()}></Icon>
            </div>
            <PageItemBox items={this.module.items}></PageItemBox>
        </div>
    }
}