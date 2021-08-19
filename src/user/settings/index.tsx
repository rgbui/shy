import React from 'react';
import { PopoverSingleton } from 'rich/extensions/popover/popover';
import { WorkspaceSettingsView } from '../../workspace/settings/settings';
import { UserSettingsView } from './settings';
import "./style.less";
class UserSettings extends React.Component {
    mode: 'ws-settings' | 'user-settings' = 'ws-settings';
    setMode(mode: UserSettings['mode']) {
        this.mode = mode;
        this.forceUpdate()
    }
    render() {
        return <div className='shy-settings'>
            <div className='shy-settings-slide'>
                <h4>用户中心</h4>
                <a onMouseDown={e => this.setMode('user-settings')} className={this.mode == 'user-settings' ? "hover" : ""} ><span>基本信息</span></a>
                <a><span>账户钱包</span></a>
                <h4>空间</h4>
                <a onMouseDown={e => this.setMode('ws-settings')} className={this.mode == 'ws-settings' ? "hover" : ""} ><span>设置</span></a>
                <a><span>成员</span></a>
                <a><span>帐单</span></a>
            </div>
            <div className='shy-settings-content'>
                {this.mode == 'ws-settings' && <WorkspaceSettingsView></WorkspaceSettingsView>}
                {this.mode == 'user-settings' && <UserSettingsView></UserSettingsView>}
            </div>
        </div>
    }
}

export async function useOpenUserSettings() {
    var popover = await PopoverSingleton(UserSettings, { mask: true, shadow: true });
    await popover.open({ center: true });
}