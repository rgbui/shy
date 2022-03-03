import { observer, useLocalObservable } from "mobx-react-lite";
import React from "react";
import { PlusSvg } from "rich/component/svgs";
import { Avatar } from "rich/component/view/avator/face";
import { Icon } from "rich/component/view/icon";
import { channel } from "rich/net/channel";
import { surface } from "../..";
import FriendSvg from "../../../assert/svg/friends.svg";
import { CommunicateView } from "./communicate/communicate";
import { FriendsView } from "./friends";
import "./style.less";

export var UserChannel = observer(function () {
    var local = useLocalObservable<{ showFriend: boolean, channels: any[], rooms: any[] }>(() => {
        return {
            showFriend: false,
            channels: [],
            rooms: []
        }
    })
    async function load() {
        var r = await channel.get('/user/channels', { page: 1, size: 200 });
        if (r.ok) {
            local.rooms = r.data.rooms;
            local.channels = r.data.list;
        }
    }
    React.useEffect(() => {
        load();
    }, [])
    function renderCommunicate() {
        return <div className="shy-user-channel-communicate">
            <div className="shy-user-channel-communicate-head"><span>私信</span><Icon style={{display:'none'}} size={14} icon={PlusSvg}></Icon></div>
            {local.channels.map(c => {
                var room = local.rooms.find(g => g.id == c.roomId);
                if (room.users.length == 2) {
                    var friendId = room.users.find(g => g.userid != surface.user.id)?.userid;
                    return <div key={c.id} className="shy-user-channel-communicate-room">
                        <Avatar circle size={40} userid={friendId}></Avatar>
                    </div>
                }
                else if (room.users.length > 2) {
                    return <div key={c.id} className="shy-user-channel-communicate-room">

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
            <div className="shy-user-friends" onMouseDown={e => local.showFriend = true}>
                <Icon icon={FriendSvg}></Icon>
                <span>好友</span>
            </div>
            {renderCommunicate()}
        </div>
        <div className="shy-user-channel-content">
            {local.showFriend && <FriendsView></FriendsView>}
            {!local.showFriend && <CommunicateView></CommunicateView>}
        </div>
    </div>
})
