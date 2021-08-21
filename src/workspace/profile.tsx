import React from "react";
import { Icon } from "rich/component/view/icon";
import { Workspace } from ".";
import { Rect } from "rich/src/common/point";
import { Avatar } from "../components/face";
import { surface } from "../surface";
import { useSwitchWorkspace } from "./switch";
import ExpandSvg from "../assert/svg/expand.svg";
import DoubleArrow from "../assert/svg/doubleRight.svg";
import { AppTip } from "../../i18n/tip";
import { AppLang } from "../../i18n/enum";

export class WorkspaceProfile extends React.Component<{ workspace: Workspace }>{
    get workspace() {
        return this.props.workspace;
    }
    async mousedown(event: React.MouseEvent) {
        var rect = Rect.from(this.el.getBoundingClientRect());
        var r = await useSwitchWorkspace({ fixPoint: rect.leftBottom.add(30, 0) });
        if (r) {
            surface.onChangeWorkspace(r);
        }
    }
    el: HTMLElement;
    render() {
        return <div className='shy-ws-profile' ref={e => this.el = e} onMouseDown={e => this.mousedown(e)}>
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
                    <AppTip id={AppLang.ShrinkSlide} placement={'bottom'}><Icon size={12} icon={DoubleArrow} style={{ transform: 'scale(-1,1)' }}></Icon></AppTip>
                </a>}
            </div>
        </div>
    }
}