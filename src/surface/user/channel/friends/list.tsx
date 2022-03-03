import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import { Avatar } from "rich/component/view/avator/face";
import { channel } from "rich/net/channel";
import React from "react";
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
                Object.assign(local, r.data);
            })
        }
    }
    React.useEffect(() => {
        load();
    }, [])
    return <div className="shy-blacklist">
        {local.list.map(r => {
            return <div key={r.id}>
                <Avatar userid={r.friendId}></Avatar>
                <div className="shy-blacklist-operator"></div>
            </div>
        })}
    </div>
});