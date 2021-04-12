import React from "react";
import { Icon } from "rich/src/component/icon";
import { PageItem } from "./item";

import { WorkspaceModule, WorkspaceModuleView } from "./module";
import { WorkSpacesView } from "./surface";


export class Workspace {
    id: string;
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
                this.modules = [];
                data.modules.each(module => {

                    var mo = new WorkspaceModule();
                    mo.workspace = this;
                    mo.load(module);
                    this.modules.push(mo);
                })
            }
            else {
                this[n] = data[n];
            }
        }
        console.log(this);
    }
    get pagesModule() {
        return this.modules.find(g => g.name == 'pages');
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
}


export class WorkspaceView extends React.Component<{ workspace: Workspace, workspacesView: WorkSpacesView }> {
    constructor(props) {
        super(props);
        this.props.workspace.view = this;
    }
    get workspace() {
        return this.props.workspace;
    }
    get workspacesView() {
        return this.props.workspacesView;
    }
    renderPages() {
        var self = this;
        var module = this.workspace.pagesModule;
        if (!module) {
            return <div>not found workspace pages</div>
        }
        return <WorkspaceModuleView module={module}></WorkspaceModuleView>
    }
    render() {
        return <div className='sy-ws'>
            <div className='sy-ws-profile'>
                <div className='sy-ws-profile-face'>
                    <img src={this.workspace.profile_photo} />
                </div>
                <div className='sy-ws-profile-info'>
                    <span>{this.workspace.title}</span>
                    <Icon icon='arrow-down:sy'></Icon>
                </div>
            </div>
            <div className='sy-ws-modules'>
                {this.renderPages()}
            </div>
        </div>
    }
}