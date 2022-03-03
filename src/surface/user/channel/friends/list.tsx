import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import { Avatar } from "rich/component/view/avator/face";
import { channel } from "rich/net/channel";
import React from "react";
import { Input } from "rich/component/view/input";
import { Icon } from "rich/component/view/icon";
import { CommentSvg } from "rich/component/svgs";
export var FrendListView = observer(function () {
    var local = useLocalObservable(() => {
        return {
            page: 1,
            size: 100,
            list: [],
            total: 0
        }
    })
    async function load() {
        var r = await channel.get('/friends', { page: 1, size: 200 });
        if (r.ok) {
            runInAction(() => {
                for (let n in r.data) {
                    local[n] = r.data[n];
                }
            })
        }
    }
    async function joinChannel(row) {
        var r = await channel.put('/user/channel/join', { userids: [row.friendId] });
        if (r.ok) {

        }
    }
    React.useEffect(() => {
        load();
    }, [])
    return <div className="shy-friends">
        <div className="shy-friends-search"><Input placeholder="搜索" /></div>
        <div className="shy-friends-head"><span>好友-{local.total}</span></div>
        <div className="shy-friends-list">{local.list.map(r => {
            return <div key={r.id} className='shy-friends-user' onMouseDown={e => joinChannel(r)}>
                <Avatar circle size={40} userid={r.friendId}></Avatar>
                <div className="shy-friends-operator" >
                    <Icon wrapper icon={CommentSvg}></Icon>
                </div>
            </div>
        })}</div>

    </div>
});