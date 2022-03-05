import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import { Avatar } from "rich/component/view/avator/face";
import { channel } from "rich/net/channel";
import React from "react";
import { surface } from "../../..";
import { Icon } from "rich/component/view/icon";
import { CheckSvg, CloseTickSvg } from "rich/component/svgs";
import { Input } from "rich/component/view/input";
import { userChannelStore } from "../store";

export var PendListView = observer(function () {

    async function removeSend(row) {
        var r = await channel.del('/friend/delete', { id: row.id });
        if (r.ok) {
            userChannelStore.pends.list.remove(g => g.id == row.id);
            userChannelStore.pends.list = userChannelStore.pends.list;
        }
    }
    async function agree(row) {
        var r = await channel.put('/friend/agree', { id: row.id });
        if (r.ok) {
            userChannelStore.pends.list.remove(g => g.id == row.id);
            userChannelStore.pends.list = userChannelStore.pends.list;
        }
    }
    React.useEffect(() => {
        userChannelStore.loadPends();
    }, [])
    return <div className="shy-friends">
        <div className="shy-friends-search"><Input placeholder="搜索" /></div>
        <div className="shy-friends-head"><span>待处理数-{userChannelStore.pends.total}</span></div>
        <div className="shy-friends-list">
            {userChannelStore.pends.list.map(r => {
                return <div key={r.id} className='shy-friends-user'>
                    {r.userid == surface.user?.id && <><Avatar size={32} userid={r.friendId}></Avatar>
                        <span>已发送好友请求</span>
                        <div className="shy-friends-user-operator">
                            <Icon size={24} wrapper icon={CloseTickSvg} click={e => removeSend(r)}></Icon>
                        </div>
                    </>
                    }
                    {r.friendId == surface.user?.id && <><Avatar size={32} userid={r.friendId}></Avatar>
                        <span>来自ta的好友请求</span>
                        <div className="shy-friends-user-operator">
                            <Icon size={24} wrapper icon={CheckSvg} click={e => agree(r)}></Icon>
                        </div>
                    </>}
                </div>
            })}
        </div>
    </div>
});