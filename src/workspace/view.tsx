import React from "react";
import { Workspace } from ".";
import { getMimeViewComponent } from "../solution/item/mime";
import { WorkspaceProfile } from "./profile";
import { PageView } from "../solution/item/view";
export class WorkspaceView extends React.Component<{ workspace: Workspace }> {
    constructor(props) {
        super(props);
        this.props.workspace.view = this;
    }
    get workspace() {
        return this.props.workspace;
    }
    render() {
        return <div className='sy-ws'>
            <WorkspaceProfile workspace={this.workspace}></WorkspaceProfile>
            <div className='sy-ws-items'>
                {this.workspace.childs.map(ws => {
                    var View: typeof PageView = getMimeViewComponent(ws.mime);
                    return <View key={ws.id} item={ws} deep={0} ></View>
                })}
            </div>
        </div>
    }
}