
import { observer, useLocalObservable } from "mobx-react";
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
export var FriendsView = observer(function () {
  
    function setMode(mode: string) {
        userChannelStore.mode = mode as any;
    }
    async function joinFriend(event: React.MouseEvent) {
        await useJoinFriend({ roundArea: Rect.fromEvent(event) })
    }
    return <div className="shy-user-channel-friends">
        <div className="shy-user-channel-friends-head flex-auto-fix">
            <div className="shy-user-channel-friends-head-tabs">
                <Icon icon={FriendSvg}></Icon>
                <span>好友</span>
                <div className="line"></div>
                <a onMouseDown={e => setMode('online')} className={userChannelStore.mode == 'online' ? "hover" : ""}>在线</a>
                <a onMouseDown={e => setMode('all')} className={userChannelStore.mode == 'all' ? "hover" : ""}>全部</a>
                <a onMouseDown={e => setMode('pending')} className={userChannelStore.mode == 'pending' ? "hover" : ""}>待定</a>
                <a onMouseDown={e => setMode('shield')} className={userChannelStore.mode == "shield" ? "hover" : ""}>屏蔽</a>
                <Button size="small" onClick={e => joinFriend(e)}>添加好友</Button>
            </div>
            <div className="shy-user-channel-friends-head-btns" style={{ width: 80 }}>
                <Icon size={40} fontSize={30} icon={"help:sy"}></Icon>
            </div>
        </div>
        <div className="shy-user-channel-friends-content">
            {(userChannelStore.mode == 'online' || userChannelStore.mode == 'all') && <FrendListView></FrendListView>}
            {userChannelStore.mode == 'pending' && <PendListView></PendListView>}
            {userChannelStore.mode == 'shield' && <BlackListView></BlackListView>}
        </div>
    </div>
})