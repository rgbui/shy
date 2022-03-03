import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { Avatar } from "rich/component/view/avator/face";
import { Input } from "rich/component/view/input";
import { channel } from "rich/net/channel";
export var BlackListView = observer(function () {
    var local = useLocalObservable(() => {
        return {
            page: 1,
            size: 100,
            list: [],
            total: 0
        }
    })
    async function load() {
        var r = await channel.get('/user/blacklist', { page: 1, size: 200 });
        if (r.ok) {
            runInAction(() => {
                Object.assign(local, r.data);
            })
        }
    }
    React.useEffect(() => {
        load();
    }, [])
    return <div className="shy-friends">
        <div className="shy-friends-search"><Input placeholder="搜索" /></div>
        <div className="shy-friends-head"><span>好友-{local.total}</span></div>
        <div className="shy-friends-list"> {
            local.list.map(r => {
                return <div className='shy-friends-user' key={r.id}>
                    <Avatar circle size={40} userid={r.otherId}></Avatar>
                    <div className="shy-blacklist-operator"></div>
                </div>
            })
        }</div>
    </div>
});