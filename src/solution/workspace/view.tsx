import React from "react";
import { Workspace } from ".";
import { Workarea } from "../workarea";
import { WorkareaType } from "../workarea/enum";
import { PagesViewArea, PagesViewModuleView } from "../workarea/ms/pages";
import { WorkspaceProfile } from "./profile";

export class WorkspaceView extends React.Component<{ workspace: Workspace }> {
    constructor(props) {
        super(props);
        this.props.workspace.view = this;
    }
    get workspace() {
        return this.props.workspace;
    }
    renderArea(area: Workarea) {
        var key = area.type + area.text;
        switch (area.type) {
            case WorkareaType.pages:
                return <PagesViewModuleView key={key} module={area as PagesViewArea}></PagesViewModuleView>
        }
    }
    render() {
        return <div className='sy-ws'>
            <WorkspaceProfile workspace={this.workspace}></WorkspaceProfile>
            <div className='sy-ws-modules'>
                {this.workspace.areas.map(g => this.renderArea(g))}
            </div>
        </div>
    }
}