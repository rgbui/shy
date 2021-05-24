import React from "react";
import { Workspace } from ".";
import { WorkspaceModule } from "../module/base";
import { WorkspaceModuleType } from "../module/enum";
import { PagesViewModule, PagesViewModuleView } from "../module/ms/pages";
import { WorkspaceProfile } from "./profile";

export class WorkspaceView extends React.Component<{ workspace: Workspace }> {
    constructor(props) {
        super(props);
        this.props.workspace.view = this;
    }
    get workspace() {
        return this.props.workspace;
    }
    renderModule(module: WorkspaceModule) {
        var key = module.type + module.text;
        console.log(module);
        switch (module.type) {
            case WorkspaceModuleType.pages:
                return <PagesViewModuleView key={key} module={module as PagesViewModule}></PagesViewModuleView>
        }
    }
    render() {
        return <div className='sy-ws'>
            <WorkspaceProfile workspace={this.workspace}></WorkspaceProfile>
            <div className='sy-ws-modules'>
                {this.workspace.modules.map(g => this.renderModule(g))}
            </div>
        </div>
    }
}