import { observer } from "mobx-react";
import { Avatar } from "rich/component/view/avator/face";
import { channel } from "rich/net/channel";
import React from "react";
import { surface } from "../../..";
import { IconButton } from "rich/component/view/icon";
import { CheckSvg, CloseTickSvg } from "rich/component/svgs";
import { Input } from "rich/component/view/input";
import { userChannelStore } from "../store";

export var PendListView = observer(function () {
    var refInput = React.useRef<Input>(null);
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
        <div className="shy-friends-search"><Input ref={e => refInput.current = e} placeholder="搜索"  clear /></div>
        <div className="shy-friends-head"><span>待处理数-{userChannelStore.pends.total}</span></div>
        <div className="shy-friends-list">
            {userChannelStore.pends.list.map(r => {
                return <div key={r.id} className='shy-friends-user'>
                    {r.userid == surface.user?.id && <><Avatar showName size={32} userid={r.friendId}></Avatar>
                        <span>已发送好友请求</span>
                        <div className="shy-friends-user-operator">
                            <IconButton width={24} size={14} wrapper icon={CloseTickSvg} onMouseDown={e => removeSend(r)}></IconButton>
                        </div>
                    </>
                    }
                    {r.friendId == surface.user?.id && <><Avatar size={32} userid={r.friendId}></Avatar>
                        <span>来自ta的好友请求</span>
                        <div className="shy-friends-user-operator">
                            <IconButton width={24} size={14} wrapper icon={CheckSvg} onMouseDown={e => agree(r)}></IconButton>
                        </div>
                    </>}
                </div>
            })}
        </div>
    </div>
});