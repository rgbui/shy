import { observer } from "mobx-react";
import React from "react";
import { Avatar } from "rich/component/view/avator/face";
import { Input } from "rich/component/view/input";
import { userChannelStore } from "../store";
export var BlackListView = observer(function () {
    React.useEffect(() => {
        userChannelStore.loadBlacklist();
    }, [])
    return <div className="shy-friends">
        <div className="shy-friends-search"><Input placeholder="搜索" /></div>
        <div className="shy-friends-head"><span>好友-{userChannelStore.blacklist.total}</span></div>
        <div className="shy-friends-list"> {
            userChannelStore.blacklist.list.map(r => {
                return <div className='shy-friends-user' key={r.id}>
                    <Avatar  size={32} userid={r.otherId}></Avatar>
                    <div className="shy-blacklist-operator"></div>
                </div>
            })
        }</div>
    </div>
});