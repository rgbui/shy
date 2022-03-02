
import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { Button } from "rich/component/view/button";
import { Icon } from "rich/component/view/icon";
import { Rect } from "rich/src/common/vector/point";
import FriendSvg from "../../../../assert/svg/friends.svg";
import { useJoinFriend } from "../../../../component/join";
import { BlackListView } from "./blacklist";
import { FrendListView } from "./list";
import { PendListView } from "./pends";
export var FriendsView = observer(function () {
    var local = useLocalObservable(() => {
        return {
            mode: 'online'
        }
    })
    function setMode(mode: string) {

    }
    async function joinFriend(event: React.MouseEvent) {
        await useJoinFriend({ roundArea: Rect.fromEvent(event) })
    }
    return <div className="shy-user-channel-friends">
        <div className="shy-user-channel-friends-head">
            <div>
                <Icon icon={FriendSvg}></Icon>
                <span>好友</span>
                <a onMouseDown={e => setMode('online')} className={local.mode == 'online' ? "hover" : ""}>在线</a>
                <a onMouseDown={e => setMode('all')} className={local.mode == 'all' ? "hover" : ""}>全部</a>
                <a onMouseDown={e => setMode('pending')} className={local.mode == 'pending' ? "hover" : ""}>待定</a>
                <a onMouseDown={e => setMode('shield')} className={local.mode == "shield" ? "hover" : ""}>屏蔽</a>
                <Button onClick={e => joinFriend(e)}>添加好友</Button>
            </div>
            <div>
                <Icon size={40} fontSize={30} icon={"help:sy"}></Icon>
            </div>
        </div>
        <div className="shy-user-channel-friends-content">
            {(this.mode == 'online' || this.mode == 'all') && <FrendListView></FrendListView>}
            {this.mode == 'pending' && <PendListView></PendListView>}
            {this.mode == 'shield' && <BlackListView></BlackListView>}
        </div>
    </div>
})