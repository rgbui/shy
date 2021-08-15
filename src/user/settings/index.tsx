import React from 'react';
import { PopoverSingleton } from '../../../../rich/extensions/popover/popover';

class UserSettings extends React.Component {
    render() {
        return <div className='shy-user-settings'>
            <div className='shy-user-settings-slide'>
                <h4>用户中心</h4>
                <a><span>基本信息</span></a>
                <a><span>账户钱包</span></a>
                <a><span>偏好设置</span></a>
            </div>
            <div className='shy-user-settings-content'>

            </div>
        </div>
    }
}

export async function useOpenUserSettings() {
    var popover = await PopoverSingleton(UserSettings, { mask: true, shadow: true });
    await popover.open({ center: true });
}