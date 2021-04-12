import React from "react";
import { Icon } from "rich/src/component/icon";
import { util } from "rich/src/util/util";
import { PageItem, WorkspaceItemBox } from "./item";
import { Workspace } from "./workspace";

export class WorkspaceModule {
    name: string;
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
    view?: WorkspaceModuleView;
    onAddItem() {
        var item = new PageItem();
        item.id = util.guid();
        item.text = '新页面';
        item.module = this;
        item.spread = false;
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

export class WorkspaceModuleView extends React.Component<{ module: WorkspaceModule }> {
    constructor(props) {
        super(props);
        this.props.module.view = this;
    }
    render() {
        var module = this.props.module;
        return <div className='sy-ws-module' key={module.name}>
            <div className='sy-ws-module-head'>
                <span onMouseDown={e => module.onSpread()}>{module.text || "我的页面"}</span>
            </div>
            <div className='sy-ws-module-operators'>
                <Icon icon='add:sy' mousedown={e => module.onAddItem()}></Icon>
            </div>
            <WorkspaceItemBox items={module.items}></WorkspaceItemBox>
        </div>
    }
}