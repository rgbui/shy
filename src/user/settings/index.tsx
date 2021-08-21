import React from 'react';
import { PopoverSingleton } from 'rich/extensions/popover/popover';
import { EventsComponent } from 'rich/component/events.component';
import { WorkspaceSettingsView } from '../../workspace/settings/settings';
import { WorkspaceMembers } from '../../workspace/settings/member';
import { UserSettingsView } from './settings';
import "./style.less";
class UserSettings extends EventsComponent {
    mode: 'ws-settings' | 'user-settings' | 'ws-members' = 'ws-settings';
    setMode(mode: UserSettings['mode']) {
        this.mode = mode;
        this.forceUpdate()
    }
    onClose() {
        this.emit('close');
    }
    render() {
        return <div className='shy-settings'>
            <div className='shy-settings-slide'>
                <h4>用户中心</h4>
                <a onMouseDown={e => this.setMode('user-settings')} className={this.mode == 'user-settings' ? "hover" : ""} ><span>基本信息</span></a>
                {/* <a><span>账户钱包</span></a> */}
                <h4>空间</h4>
                <a onMouseDown={e => this.setMode('ws-settings')} className={this.mode == 'ws-settings' ? "hover" : ""} ><span>设置</span></a>
                <a onMouseDown={e => this.setMode('ws-members')} className={this.mode == 'ws-members' ? "hover" : ""} ><span>成员</span></a>
                {/* <a><span>帐单</span></a> */}
            </div>
            <div className='shy-settings-content'>
                {this.mode == 'ws-settings' && <WorkspaceSettingsView close={() => this.onClose()}></WorkspaceSettingsView>}
                {this.mode == 'user-settings' && <UserSettingsView close={() => this.onClose()}></UserSettingsView>}
                {this.mode == 'ws-members' && <WorkspaceMembers></WorkspaceMembers>}
            </div>
        </div>
    }
}

export async function useOpenUserSettings() {
    var popover = await PopoverSingleton(UserSettings, { mask: true, shadow: true });
    var us = await popover.open<UserSettings>({ center: true });
    us.only('close', () => {
        popover.onClose()
    })
}