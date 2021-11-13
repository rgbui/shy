import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import { WorkspaceMembers } from "./member";
import { WorkspaceSettingsView } from "./settings";
class WsSettings extends EventsComponent {
    mode: 'ws-settings' | 'ws-members' = 'ws-settings';
    setMode(mode: WsSettings['mode']) {
        this.mode = mode;
        this.forceUpdate()
    }
    onClose() {
        this.emit('close');
    }
    render() {
        return <div className='shy-settings'>
            <div className='shy-settings-slide'>
                <h4>空间</h4>
                <a onMouseDown={e => this.setMode('ws-settings')} className={this.mode == 'ws-settings' ? "hover" : ""} ><span>设置</span></a>
                {/* <a onMouseDown={e => this.setMode('ws-members')} className={this.mode == 'ws-members' ? "hover" : ""} ><span>成员</span></a> */}
                {/* <a><span>帐单</span></a> */}
            </div>
            <div className='shy-settings-content'>
                {this.mode == 'ws-settings' && <WorkspaceSettingsView close={() => this.onClose()}></WorkspaceSettingsView>}
                {this.mode == 'ws-members' && <WorkspaceMembers></WorkspaceMembers>}
            </div>
        </div>
    }
}

export async function useOpenWorkspaceSettings() {
    var popover = await PopoverSingleton(WsSettings, { mask: true, shadow: true });
    var us = await popover.open({ center: true });
    us.only('close', () => {
        popover.onClose()
    })
}