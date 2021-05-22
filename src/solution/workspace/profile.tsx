import React from "react";
import { Icon } from "rich/src/component/icon";
import { Workspace } from ".";



export class WorkspaceProfile extends React.Component<{ workspace: Workspace }>{
    get workspace() {
        return this.props.workspace;
    }
    render() {
        return <div className='sy-ws-profile'>
            <div className='sy-ws-profile-face'>
                <img src={this.workspace.profile_photo} />
            </div>
            <div className='sy-ws-profile-info'>
                <span>{this.workspace.title}</span>
                <Icon icon='arrow-down:sy'></Icon>
            </div>
        </div>
    }
}