import React from 'react';
import { PopoverSingleton } from 'rich/extensions/popover/popover';
import { EventsComponent } from 'rich/component/lib/events.component';
import { UserSettingsView } from './settings';
import "./style.less";
import { Button } from 'rich/component/view/button';
import { SyHistory } from '../../../history';
import { observer } from 'mobx-react';
import { makeObservable, observable } from 'mobx';

@observer
class UserSettings extends EventsComponent {
    constructor(props) {
        super(props);
        makeObservable(this, { mode: observable })
    }
    mode: 'user-settings' = 'user-settings';
    setMode(mode: UserSettings['mode']) {
        this.mode = mode;
    }
    onClose() {
        this.emit('close');
    }
    render() {
        var self = this;
        function singout() {
            SyHistory.push('/sign/out');
            self.onClose()
        }
        return <div className='shy-settings'>
            <div className='shy-settings-slide'>
                <h4>用户中心</h4>
                <a onMouseDown={e => this.setMode('user-settings')} className={this.mode == 'user-settings' ? "hover" : ""} ><span>基本信息</span></a>
                {/*<a><span>账户钱包</span></a> */}
                <div style={{ textAlign: 'center', marginTop: 360 }}>
                    <Button ghost onClick={e => singout()}>退出登录</Button>
                </div>
            </div>
            <div className='shy-settings-content'>
                {this.mode == 'user-settings' && <UserSettingsView close={() => this.onClose()}></UserSettingsView>}
            </div>
        </div>
    }
}

export async function useOpenUserSettings() {
    var popover = await PopoverSingleton(UserSettings, { mask: true, shadow: true });
    var us = await popover.open({ center: true });
    us.only('close', () => {
        popover.onClose()
    })
}