import { Observer, observer, useLocalObservable } from "mobx-react";
import React from "react";
import { SettingsSvg } from "rich/component/svgs";
import { Avatar } from "rich/component/view/avator/face";
import { Icon } from "rich/component/view/icon";
import { useSelectMenuItem } from "rich/component/view/menu";
import { MenuItemType } from "rich/component/view/menu/declare";
import { channel } from "rich/net/channel";
import { Rect } from "rich/src/common/vector/point";
import { UserStatus } from "rich/types/user";
import { surface } from "../..";
import { userNativeStore } from "../../../../native/store/user";
import { useOpenUserSettings } from "../settings";
import './style.less';

export var UserProfile = observer(function () {
    if (!surface.user.isSign) return <></>
    var local = useLocalObservable<{ avatar: Avatar }>(() => {
        return {
            avatar: null
        }
    })
    async function setUserStatus(event: React.MouseEvent) {
        var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(event) }, [
            { checkLabel: surface.user.status == UserStatus.online, name: 'online', text: '在线' },
            { type: MenuItemType.divide },
            { checkLabel: surface.user.status == UserStatus.idle, name: 'idle', text: '闲置' },
            { checkLabel: surface.user.status == UserStatus.busy, name: 'busy', text: '请勿打扰' },
            { checkLabel: surface.user.status == UserStatus.hidden, name: 'hidden', text: '隐身' }
        ]);
        if (r) {
            var status = UserStatus[r.item.name]
            var g = await channel.patch('/user/patch/status', { status });
            if (g.ok) {
                userNativeStore.put({ id: surface.user.id, status })
                surface.user.status = status;
                if (local.avatar) local.avatar.load(true)
            }
        }
    }
    async function Mousedown(event: React.MouseEvent) {
        useOpenUserSettings()
    }
    return <div className="shy-user-profile">
        {surface.user && <div className="flex round item-hover-1 cursor padding-5 padding-r-20" onMouseDown={e => setUserStatus(e)}>
            <Avatar ref={e => local.avatar = e} size={32} userid={surface.user.id}></Avatar>
            <div className="gap-l-5">
                <div className="bold text f-14 l-14 text-overflow w-80" title={surface.user.name}>{surface.user.name}</div>
                <div className="text-1 f-14 l-14">#{surface.user.sn}</div>
            </div>
        </div>}
        <div className="shy-user-profile-operators">
            <span className="size-32 round flex-center cursor item-hover-1" onMouseDown={e => Mousedown(e)}>
                <Icon size={16} icon={SettingsSvg}></Icon>
            </span>
        </div>
    </div>
});