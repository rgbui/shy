
import React from 'react';
import { Icon } from 'rich/component/icon';
import WsSettings from "../../assert/svg/WsSettings.svg";
import MemberSvg from "../../assert/svg/member.svg";
import BillingSvg from "../../assert/svg/billing.svg";
import { EventsComponent } from 'rich/extensions/events.component';
import { PopoverSingleton } from 'rich/extensions/popover/popover';
import "./style.less";
class WorkspaceSettings extends EventsComponent {
    render() {
        return <div className='shy-ws-settings'>
            <div className='shy-ws-settings-slide'>
                <h4>空间</h4>
                <a><Icon icon={WsSettings}></Icon><span>设置</span></a>
                <a><Icon icon={MemberSvg}></Icon><span>成员</span></a>
                <a><Icon icon={BillingSvg}></Icon><span>帐单</span></a>
            </div>
            <div className='shy-ws-settings-content'></div>
        </div>
    }
}

export async function useOpenWorkspaceSettings() {
    var popover = await PopoverSingleton(WorkspaceSettings, { mask: true, shadow: true });
    await popover.open({ center: true });
}