import React from "react";
import { Icon } from "rich/src/component/icon";
import { util } from "rich/src/util/util";
import { surface } from "../../../surface";
import { PageItem } from "../../item";
import { PageItemBox } from "../../item/box";
import { Mime } from "../../item/mine";
import { SolutionOperator } from "../../operator";
import { Workspace } from "../../workspace";
import { WorkspaceModule } from "../base";
import { WorkspaceModuleType } from "../enum";
export class PagesViewModule extends WorkspaceModule {
    type: WorkspaceModuleType;
    text: string;
    items: PageItem[];
    spread: boolean = true;
    workspace: Workspace;
    view: PagesViewModuleView;
    get solution() {
        return surface.solution;
    }
    onAddItem() {
        var item = new PageItem();
        item.id = util.guid();
        item.text = '新页面';
        item.module = this;
        item.spread = false;
        item.mime = Mime.page;
        if (this.spread != true) {
            this.spread = true;
            this.solution.emit(SolutionOperator.toggleModule, this);
        }
        this.items.insertAt(0, item);
        this.view.forceUpdate(() => {
            item.onEdit();
        });
        this.solution.emit(SolutionOperator.addSubPageItem, item);
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
            {this.module.spread == true && <PageItemBox items={this.module.items}></PageItemBox>}
        </div>
    }
}