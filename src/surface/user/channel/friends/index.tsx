
import { observer } from "mobx-react";
import React from "react";
import { Button } from "rich/component/view/button";
import { Icon } from "rich/component/view/icon";
import { Rect } from "rich/src/common/vector/point";
import FriendSvg from "../../../../assert/svg/friends.svg";
import { useJoinFriend } from "../../../../component/join";
import { userChannelStore } from "../store";
import { BlackListView } from "./blacklist";
import { FrendListView } from "./list";
import { PendListView } from "./pends";
import { S } from "rich/i18n/view";
import "./style.less";

export var FriendsView = observer(function () {
    function setMode(mode: string) {
        userChannelStore.mode = mode as any;
    }
    async function joinFriend(event: React.MouseEvent) {
        var g = await useJoinFriend({ roundArea: Rect.fromEvent(event) });
        if (g) {
            if (userChannelStore.mode == 'pending') {
                await userChannelStore.loadPends();
            } else
                userChannelStore.mode = 'pending';
        }
    }
    return <div className="shy-user-channel-friends flex flex-col flex-full">
        <div className="shy-user-channel-friends-head flex desk-drag">
            <div className="shy-user-channel-friends-head-tabs flex-auto flex">
                <Icon className={'desk-no-drag'} icon={FriendSvg}></Icon>
                <span className="desk-no-drag"><S>好友</S></span>
                <div className="line desk-no-drag"></div>
                <a onMouseDown={e => setMode('online')} className={' desk-no-drag '+(userChannelStore.mode == 'online' ? "hover" : "")}><S>在线</S></a>
                <a onMouseDown={e => setMode('all')} className={' desk-no-drag '+(userChannelStore.mode == 'all' ? "hover" : "")}><S>全部</S></a>
                <a onMouseDown={e => setMode('pending')} className={' desk-no-drag '+(userChannelStore.mode == 'pending' ? "hover" : "")}><S>待定</S></a>
                <a onMouseDown={e => setMode('shield')} className={' desk-no-drag '+(userChannelStore.mode == "shield" ? "hover" : "")}><S>屏蔽</S></a>
                <Button tag="button" size="small" ghost  className="gap-l-10 desk-no-drag" onClick={e => joinFriend(e)}><S>添加好友</S></Button>
            </div>
            <div className="shy-user-channel-friends-head-btns flex-fixed flex-end gap-r-10" style={{ width: 80 }}>
                <a href={window.shyConfig?.isUS?"https://help.shy.red/page/79#m1v1ZYU21RorGFND6xYn5h":"https://help.shy.live/page/2042#87JuKJBeQ7hjVfSQKvzJML"} target="_blank">
                    <span className='round item-hover cursor size-24 flex-center'><Icon size={18} icon={{name:'byte',code:'help'}}></Icon></span>
                </a>
            </div>
        </div><div className="shy-user-channel-friends-content">
            {(userChannelStore.mode == 'online' || userChannelStore.mode == 'all') && <FrendListView></FrendListView>}
            {userChannelStore.mode == 'pending' && <PendListView></PendListView>}
            {userChannelStore.mode == 'shield' && <BlackListView></BlackListView>}
        </div>
    </div>
})