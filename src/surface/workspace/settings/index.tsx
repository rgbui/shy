
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Singleton } from "rich/component/lib/Singleton";
import { Divider } from "rich/component/view/grid";
import { surface } from "../..";
import { WorkspaceMembers } from "./member";
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
    onClose() {
        this.emit('close');
    }
    open() {
        this.visible = true;
    }
    render() {
        return <div className='shy-settings'>
            <div className='shy-settings-slide'>
                <div>
                    <h4>{surface.workspace.text}</h4>
                    <a onMouseDown={e => this.setMode('ws-settings')} className={this.mode == 'ws-settings' ? "hover" : ""} ><span>基本信息</span></a>
                    <a onMouseDown={e => this.setMode('ws-members')} className={this.mode == 'ws-members' ? "hover" : ""} ><span>身份组</span></a>
                    <Divider style={{ margin: '0px 15px' }}></Divider>
                    <h4>用户管理</h4>
                    <a>成员</a>
                    <a>访客</a>
                    <a>邀请</a>
                    <Divider style={{ margin: '0px 15px' }}></Divider>
                    <a className="warn">删除空间</a>
                </div>
            </div>
            <div className='shy-settings-content'>
                <div>
                    {this.mode == 'ws-settings' && <WorkspaceSettingsView close={() => this.onClose()}></WorkspaceSettingsView>}
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