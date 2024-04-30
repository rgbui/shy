import { observer } from "mobx-react";
import { Avatar } from "rich/component/view/avator/face";
import { channel } from "rich/net/channel";
import React from "react";
import { surface } from "../../../app/store";
import { Icon } from "rich/component/view/icon";
import { CheckSvg, CloseSvg } from "rich/component/svgs";
import { Input } from "rich/component/view/input";
import { userChannelStore } from "../store";
import lodash from "lodash";
import { Tip } from "rich/component/view/tooltip/tip";
import { S } from "rich/i18n/view";
import Cat from "../../../../assert/img/a-cat.png";
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
        {userChannelStore.pends.total > 0 && <div className="shy-friends-head"><span className="f-12"><S>待处理数</S>-{userChannelStore.pends.total}</span></div>}
        <div className="shy-friends-list">
            {userChannelStore.pends.list.map(r => {
                return <div key={r.id} className='shy-friends-user'>
                    {r.friendId != surface.user?.id && r.userid == surface.user?.id && <>
                        <div className="flex-fixed w-200 flex"><Avatar showName size={32} userid={r.friendId}></Avatar></div>
                        <span className="flex-auto text-1 f-12"><S>已发送好友请求</S></span>
                        <div className="flex-fixed flex-end" style={{ paddingRight: 120 }}>
                            <Tip text={"撤消好友请求"}><span className="size-24 flex-center round item-hover cursor" onMouseDown={e => removeSend(r)}><Icon size={16} icon={CloseSvg}></Icon></span></Tip>
                        </div>
                    </>
                    }
                    {r.friendId == surface.user?.id && <>
                        <div className="flex-fixed w-200 flex"><Avatar showName size={32} userid={r.userid}></Avatar></div>
                        <span className="flex-auto text-1  f-12"><S>来自ta的好友请求</S></span>
                        <div className="flex-fixed flex-end" style={{ paddingRight: 120 }}>
                            <Tip text={"同意好友请求"}><span className="size-24 flex-center round item-hover cursor gap-r-10" onMouseDown={e => agree(r)}><Icon size={16} icon={CheckSvg}></Icon></span></Tip>
                            <Tip text={"拒绝好友请求"}><span className="size-24 flex-center round item-hover cursor" onMouseDown={e => removeSend(r)}><Icon size={16} icon={CloseSvg}></Icon></span></Tip>
                        </div>
                    </>}
                </div>
            })}
        </div>
        {userChannelStore.pends.list.length == 0 && <div className="flex-center" style={{marginTop:60}}>
            <img style={{maxWidth:'80%'}} className="object-center" src={Cat} />
        </div>}
    </div>
});