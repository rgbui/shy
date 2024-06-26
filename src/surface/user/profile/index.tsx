import { observe } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { SettingsSvg } from "rich/component/svgs";
import { Avatar } from "rich/component/view/avator/face";
import { Icon } from "rich/component/view/icon";
import { useSelectMenuItem } from "rich/component/view/menu";
import { MenuItemType } from "rich/component/view/menu/declare";
import { channel } from "rich/net/channel";
import { Rect } from "rich/src/common/vector/point";
import { UserStatus } from "rich/types/user";
import { surface } from "../../app/store";
import { userCacheStore } from "../../../../services/cache/user";
import './style.less';
import { isMobileOnly } from "react-device-detect";
import { lst } from "rich/i18n/store";
import { useOpenUserSettings } from "../settings/lazy";
import { getAvatorStatusSvg } from "rich/component/view/avator/status";

export var UserProfile = observer(function () {
    if (!surface.user.isSign) return <></>
    var local = useLocalObservable<{ avatar: Avatar }>(() => {
        return {
            avatar: null
        }
    })
    async function setUserStatus(event: React.MouseEvent) {
        var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(event) }, [
            {
                checkLabel: surface.user.status == UserStatus.online, name: 'online', text: lst('在线'), renderIcon: () => {
                    return getAvatorStatusSvg(UserStatus.online, { marginTop: -9, marginLeft: -9 })
                }
            },
            { type: MenuItemType.divide },
            {
                checkLabel: surface.user.status == UserStatus.idle, name: 'idle', text: lst('闲置'), renderIcon: () => {
                    return getAvatorStatusSvg(UserStatus.idle, { marginTop: -9, marginLeft: -9 })
                }
            },
            {
                checkLabel: surface.user.status == UserStatus.busy, name: 'busy', text: lst('请勿打扰'), renderIcon: () => {
                    return getAvatorStatusSvg(UserStatus.busy, { marginTop: -9, marginLeft: -9 })
                }
            },
            {
                checkLabel: surface.user.status == UserStatus.hidden, name: 'hidden', text: lst('隐身'), renderIcon: () => {
                    return getAvatorStatusSvg(UserStatus.hidden, { marginTop: -9, marginLeft: -9 })
                }
            }
        ]);
        if (r) {
            var status = UserStatus[r.item.name]
            var g = await channel.patch('/user/patch/status', { status });
            if (g.ok) {
                surface.user.status = status;
                await userCacheStore.notifyUpdate(surface.user.id, { status })
                if (local.avatar) local.avatar.load(true)
            }
        }
    }
    async function Mousedown(event: React.MouseEvent) {
        useOpenUserSettings()
    }
    React.useEffect(() => {
        observe(surface.user, () => {
            if (surface.user) {
                if (local.avatar) local.avatar.forceUpdate()
            }
        })
    }, [])
    return <div className="shy-user-profile">
        {surface.user && <div className="flex round item-hover cursor padding-5 padding-r-20" onMouseDown={e => setUserStatus(e)}>
            <Avatar ref={e => local.avatar = e} size={32} user={surface.user}></Avatar>
            <div className="gap-l-5">
                <div className="bold text f-14 l-14 text-overflow w-80" title={surface.user.name}>{surface.user.name}</div>
                <div className="text-1 f-14 l-14">#{surface.user.sn}</div>
            </div>
        </div>}
        <div className="shy-user-profile-operators">
            {!isMobileOnly && <span className="size-24 round flex-center cursor item-hover" onMouseDown={e => Mousedown(e)}>
                <Icon size={16} icon={SettingsSvg}></Icon>
            </span>}
        </div>
    </div>
});