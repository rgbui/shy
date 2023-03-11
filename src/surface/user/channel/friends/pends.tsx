import { observer } from "mobx-react";
import { Avatar } from "rich/component/view/avator/face";
import { channel } from "rich/net/channel";
import React from "react";
import { surface } from "../../../store";
import { Icon } from "rich/component/view/icon";
import { CheckSvg, CloseSvg } from "rich/component/svgs";
import { Input } from "rich/component/view/input";
import { userChannelStore } from "../store";
import { ToolTip } from "rich/component/view/tooltip";
import lodash from "lodash";

export var PendListView = observer(function () {
    var refInput = React.useRef<Input>(null);
    async function removeSend(row) {
        var r = await channel.del('/friend/delete', { id: row.id });
        if (r.ok) {
            lodash.remove(userChannelStore.pends.list, g => g.id == row.id)
            userChannelStore.pends.total -= 1;
        }
    }
    async function agree(row) {
        var r = await channel.put('/friend/agree', { id: row.id });
        if (r.ok) {
            lodash.remove(userChannelStore.pends.list, g => g.id == row.id)
            userChannelStore.pends.total -= 1;
        }
    }
    React.useEffect(() => {
        userChannelStore.loadPends();
    }, [])
    return <div className="shy-friends">
        {/* <div className="shy-friends-search"><Input ref={e => refInput.current = e} placeholder="搜索" clear /></div> */}
        <div className="shy-friends-head"><span className="f-12">待处理数-{userChannelStore.pends.total}</span></div>
        <div className="shy-friends-list">
            {userChannelStore.pends.list.map(r => {
                return <div key={r.id} className='shy-friends-user'>
                    {r.friendId != surface.user?.id && r.userid == surface.user?.id && <>
                        <div className="flex-fixed w-200 flex"><Avatar showName size={32} userid={r.friendId}></Avatar></div>
                        <span className="flex-auto text-1 f-12">已发送好友请求</span>
                        <div className="flex-fixed flex-end" style={{ paddingRight: 120 }}>
                            <ToolTip overlay={"撤消好友请求"}><span className="size-24 flex-center round item-hover cursor" onMouseDown={e => removeSend(r)}><Icon size={16} icon={CloseSvg}></Icon></span></ToolTip>
                        </div>
                    </>
                    }
                    {r.friendId == surface.user?.id && <>
                        <div className="flex-fixed w-200 flex"><Avatar showName size={32} userid={r.friendId}></Avatar></div>
                        <span className="flex-auto text-1  f-12">来自ta的好友请求</span>
                        <div className="flex-fixed flex-end" style={{ paddingRight: 120 }}>
                            <ToolTip overlay={"同意好友请求"}><span className="size-24 flex-center round item-hover cursor gap-r-10" onMouseDown={e => agree(r)}><Icon size={16} icon={CheckSvg}></Icon></span></ToolTip>
                            <ToolTip overlay={"拒绝好友请求"}><span className="size-24 flex-center round item-hover cursor" onMouseDown={e => removeSend(r)}><Icon size={16} icon={CloseSvg}></Icon></span></ToolTip>
                        </div>
                    </>}
                </div>
            })}
        </div>
    </div>
});