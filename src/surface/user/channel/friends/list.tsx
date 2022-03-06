
import { observer } from "mobx-react";
import { Avatar } from "rich/component/view/avator/face";
import { channel } from "rich/net/channel";
import React from "react";
import { Input } from "rich/component/view/input";
import { Icon } from "rich/component/view/icon";
import { CommentSvg } from "rich/component/svgs";
import { userChannelStore } from "../store";
export var FrendListView = observer(function () {
    async function joinChannel(row) {
        var r = await channel.put('/user/channel/join', { userids: [row.friendId] });
        if (r.ok) {

        }
    }
    React.useEffect(() => {
        userChannelStore.loadFriends();
    }, [])
    return <div className="shy-friends">
        <div className="shy-friends-search"><Input placeholder="搜索" /></div>
        <div className="shy-friends-head"><span>好友-{userChannelStore.friends.total}</span></div>
        <div className="shy-friends-list">{userChannelStore.friends.list.map(r => {
            return <div key={r.id} className='shy-friends-user' onMouseDown={e => joinChannel(r)}>
                <Avatar size={32} showName userid={r.friendId}></Avatar>
                <div className="shy-friends-operator" >
                    <Icon wrapper icon={CommentSvg}></Icon>
                </div>
            </div>
        })}</div>

    </div>
});