import React from "react";
import { Icon } from "rich/component/icon";
import { Workspace } from ".";
import { Avatar } from "../components/face";

export class WorkspaceProfile extends React.Component<{ workspace: Workspace }>{
    get workspace() {
        return this.props.workspace;
    }
    render() {
        return <div className='shy-ws-profile'>
            <div className='shy-ws-profile-face'>
                <Avatar circle size={30} icon={this.workspace.icon} text={this.workspace.text}></Avatar>
            </div>
            <div className='shy-ws-profile-info'>
                <span>{this.workspace.text}</span>
                <Icon icon='arrow-down:sy'></Icon>
            </div>
        </div>
    }
}