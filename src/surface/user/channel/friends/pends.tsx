import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import { Avatar } from "rich/component/view/avator/face";
import { channel } from "rich/net/channel";
import React from "react";
import { surface } from "../../..";
import { Icon } from "rich/component/view/icon";
import { CheckSvg, CloseTickSvg } from "rich/component/svgs";
import { Input } from "rich/component/view/input";

export var PendListView = observer(function () {
    var local = useLocalObservable(() => {
        return {
            page: 1,
            size: 100,
            list: [],
            total: 0
        }
    })
    async function removeSend(row) {
        var r = await channel.del('/friend/delete', { id: row.id });
        if (r.ok) {
            local.list.remove(g => g.id == row.id);
            local.list = local.list;
        }
    }
    async function agree(row) {
        var r = await channel.put('/friend/agree', { id: row.id });
        if (r.ok) {
            local.list.remove(g => g.id == row.id);
            local.list = local.list;
        }
    }
    async function load() {
        var r = await channel.get('/friends/pending', { page: local.page, size: local.size });
        if (r.ok) {
            runInAction(() => {
                for (let n in r.data) {
                    local[n] = r.data[n];
                }
            })
        }
    }
    React.useEffect(() => {
        load();
    }, [])
    return <div className="shy-pendlist">
        <div className="shy-pendlist-search"><Input placeholder="搜索" /></div>
        <div className="shy-pendlist-head"><span>待处理数{local.total}</span></div>
        <div className="shy-pendlist-list">
            {local.list.map(r => {
                return <div key={r.id} className='shy-pendlist-user'>
                    {r.userid == surface.user?.id && <><Avatar circle size={40} userid={r.friendId}></Avatar>
                        <span>已发送好友请求</span>
                        <div className="shy-pendlist-user-operator">
                            <Icon size={24} wrapper icon={CloseTickSvg} click={e => removeSend(r)}></Icon>
                        </div>
                    </>
                    }
                    {r.friendId == surface.user?.id && <><Avatar circle size={40} userid={r.friendId}></Avatar>
                        <span>来自ta的好友请求</span>
                        <div className="shy-pendlist-user-operator">
                            <Icon size={24}  wrapper  icon={CheckSvg} click={e => agree(r)}></Icon>
                        </div>
                    </>}
                </div>
            })}
        </div>

    </div>
});