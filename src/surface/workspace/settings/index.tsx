
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Singleton } from "rich/component/lib/Singleton";
import { Divider } from "rich/component/view/grid";
import { surface } from "../..";
import { WorkspaceMembers } from "./member";
import { WorkspaceRoles } from "./roles";
import { WorkspaceSettingsView } from "./settings";

@observer
class WsSettings extends EventsComponent {
    mode: string = 'ws-settings';
    visible: boolean = false;
    constructor(props) {
        super(props);
        makeObservable(this, {
            visible: observable,
            mode: observable
        });
    }
    setMode(mode: WsSettings['mode']) {
        this.mode = mode;
    }
    close() {
        this.visible = false;
        this.emit('close');
    }
    open() {
        this.visible = true;
    }
    render() {
        if (this.visible == false) return <div style={{ display: 'none' }}></div>
        return <div className='shy-settings'>
            <div className='shy-settings-slide'>
                <div>
                    <h4>{surface.workspace.text}</h4>
                    <a onMouseDown={e => this.setMode('ws-settings')} className={this.mode == 'ws-settings' ? "hover" : ""} ><span>基本信息</span></a>
                    <a onMouseDown={e => this.setMode('ws-roles')} className={this.mode == 'ws-roles' ? "hover" : ""}><span>身份组</span></a>
                    <Divider style={{ margin: '0px 15px' }}></Divider>
                    <h4>用户管理</h4>
                    <a onMouseDown={e => this.setMode('ws-members')} className={this.mode == 'ws-members' ? "hover" : ""} >成员</a>
                    {/*<a>访客</a> */}
                    <a>邀请</a>
                    <Divider style={{ margin: '0px 15px' }}></Divider>
                    <a className="warn">删除空间</a>
                </div>
            </div>
            <div className='shy-settings-content'>
                <div className='shy-settings-content-wrapper'>
                    <div className='shy-settings-operators'>
                        <a onMouseDown={e => this.close()}>
                            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path
                                fill="hsl(218, calc(var(--saturation-factor, 1) * 4.6%), 46.9%)"
                                d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
                        </a>
                    </div>
                    {this.mode == 'ws-roles' && <WorkspaceRoles></WorkspaceRoles>}
                    {this.mode == 'ws-settings' && <WorkspaceSettingsView ></WorkspaceSettingsView>}
                    {this.mode == 'ws-members' && <WorkspaceMembers></WorkspaceMembers>}
                </div>
            </div>
        </div>
    }
}

export async function useOpenWorkspaceSettings() {
    var popover = await Singleton(WsSettings);
    popover.open();
}