import React from "react";
import { Icon } from "rich/component/icon";
import { Workspace } from ".";
import { Rect } from "rich/src/common/point";
import { Avatar } from "../components/face";
import { surface } from "../surface";
import { useSwitchWorkspace } from "./switch";
import ExpandSvg from "../assert/svg/expand.svg";
import DoubleArrow from "../assert/svg/doubleRight.svg";

export class WorkspaceProfile extends React.Component<{ workspace: Workspace }>{
    get workspace() {
        return this.props.workspace;
    }
    async mousedown(event: React.MouseEvent) {
        var r = await useSwitchWorkspace({ roundArea: Rect.fromEvent(event) });
        if (r) {
            surface.onChangeWorkspace(r);
        }
    }
    render() {
        return <div className='shy-ws-profile' onMouseDown={e => this.mousedown(e)}>
            <div className='shy-ws-profile-face'>
                <Avatar circle size={30} icon={this.workspace.icon} text={this.workspace.text}></Avatar>
            </div>
            <div className='shy-ws-profile-info'>
                <span>{this.workspace.text}</span>
                <Icon size={12} icon={ExpandSvg}></Icon>
            </div>
            <div className='shy-ws-profile-operators'>
                <a onMouseDown={e => { e.stopPropagation(); surface.workspace.onOpenWorkspaceSettings(e) }}><Icon icon='elipsis:sy'></Icon></a>
                {surface.isShowSln && <a onMouseDown={e => { e.stopPropagation(); surface.onToggleSln(false) }}>
                    <Icon size={12} icon={DoubleArrow} style={{ transform: 'scale(-1,1)' }}></Icon>
                </a>}
            </div>
        </div>
    }
}