import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import React from "react";
import { PlusSvg } from "rich/component/svgs";
import { Avatar } from "rich/component/view/avator/face";
import { Icon } from "rich/component/view/icon";
import { surface } from "../..";
import FriendSvg from "../../../assert/svg/friends.svg";
import { CommunicateView } from "./communicate";
import { FriendsView } from "./friends";
import { userChannelStore } from "./store";
import "./style.less";

export var UserChannel = observer(function () {
    React.useEffect(() => {
        userChannelStore.loadChannels();
    }, [])
    function renderChannels() {
        return <div className="shy-user-channels">
            <div className="shy-user-channels-head">
                <span>私信</span>
                {/*<Icon style={{ display: 'none' }} size={14} icon={PlusSvg}></Icon> */}
            </div>
            {userChannelStore.channels.map(c => {
                var room = userChannelStore.rooms.find(g => g.id == c.roomId);
                if (room.users.length == 2) {
                    var friendId = room.users.find(g => g.userid != surface.user.id)?.userid;
                    return <div key={c.id} onMouseDown={e => userChannelStore.changeRoom(c, room)} className="shy-user-channels-room">
                        <Avatar showName size={32} userid={friendId}></Avatar>
                    </div>
                }
                else if (room.users.length > 2) {
                    return <div key={c.id} className="shy-user-channels-room">

                    </div>
                }
            })}
        </div>
    }
    return <div className="shy-user-channel">
        <div className="shy-user-channel-slide">
            <div className="shy-user-channel-slide-head">
                <div className="shy-user-channel-slide-head-wrapper"><input placeholder="搜索" /></div>
            </div>
            <div className="shy-user-friends" onMouseDown={e => userChannelStore.showFriend = true}>
                <Icon icon={FriendSvg}></Icon>
                <span>好友</span>
            </div>
            {renderChannels()}
        </div>
        <div className="shy-user-channel-content">
            {userChannelStore.showFriend && <FriendsView></FriendsView>}
            {!userChannelStore.showFriend && <CommunicateView></CommunicateView>}
        </div>
    </div>
})
