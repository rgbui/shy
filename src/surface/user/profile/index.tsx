import { observer } from "mobx-react";
import React from "react";
import { SettingsSvg } from "rich/component/svgs";
import { Avatar } from "rich/component/view/avator/face";
import { IconButton } from "rich/component/view/icon";
import { useSelectMenuItem } from "rich/component/view/menu";
import { MenuItemTypeValue } from "rich/component/view/menu/declare";
import { channel } from "rich/net/channel";
import { Rect } from "rich/src/common/vector/point";
import { UserStatus } from "rich/types/user";
import { surface } from "../..";
import { userNativeStore } from "../../../../native/store/user";
import { useOpenUserSettings } from "../settings";
import './style.less';

export var UserProfile = observer(function () {
    async function setUserStatus(event: React.MouseEvent) {
        var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(event) }, [
            { checkLabel: surface.user.status == UserStatus.online, name: 'online', text: '在线' },
            { type: MenuItemTypeValue.divide },
            { checkLabel: surface.user.status == UserStatus.idle, name: 'idle', text: '闲置' },
            { checkLabel: surface.user.status == UserStatus.busy, name: 'busy', text: '请勿打扰' },
            { checkLabel: surface.user.status == UserStatus.hidden, name: 'hidden', text: '隐身' }
        ]);
        if (r) {
            var status = UserStatus[r.item.name]
            var g = await channel.patch('/user/patch/status', { status });
            if (g.ok) {
                surface.user.status = status;
                userNativeStore.put({ id: surface.user.id, status })
            }
        }
    }
    async function Mousedown(event: React.MouseEvent) {
        useOpenUserSettings()
    }
    return <div className="shy-user-profile">
        {surface.user && <div onMouseDown={e => setUserStatus(e)}><Avatar size={32} userid={surface.user.id}></Avatar></div>}
        <div className="shy-user-profile-operators">
            <IconButton icon={SettingsSvg} wrapper onMouseDown={e => Mousedown(e)} width={32} size={16}></IconButton>
        </div>
    </div>
});