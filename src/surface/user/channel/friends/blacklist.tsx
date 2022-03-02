import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { Avatar } from "rich/component/view/avator/face";
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
    return <div className="shy-blacklist">
        {
            local.list.map(r => {
                return <div key={r.id}>
                    <Avatar userid={r.otherId}></Avatar>
                    <div className="shy-blacklist-operator"></div>
                </div>
            })
        }
    </div>
});