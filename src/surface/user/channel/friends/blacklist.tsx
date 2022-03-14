import { observer } from "mobx-react";
import React from "react";
import { CloseTickSvg } from "rich/component/svgs";
import { Avatar } from "rich/component/view/avator/face";
import { IconButton } from "rich/component/view/icon";
import { Input } from "rich/component/view/input";
import { channel } from "rich/net/channel";
import { userChannelStore } from "../store";
export var BlackListView = observer(function () {
    var refInput = React.useRef<Input>(null);
    React.useEffect(() => {
        userChannelStore.loadBlacklist();
    }, [])
    async function removeBlackList(black) {
        var r = await channel.del('/user/blacklist/delete', { id: black.id });
        if (r.ok) {
            userChannelStore.blacklist.list.remove(g => g.id == black.id);
        }
    }
    return <div className="shy-friends">
        <div className="shy-friends-search"><Input ref={e => refInput.current = e} placeholder="搜索"  clear  /></div>
        <div className="shy-friends-head"><span>屏蔽-{userChannelStore.blacklist.total}</span></div>
        <div className="shy-friends-list">{
            userChannelStore.blacklist.list.map(r => {
                return <div className='shy-friends-user' key={r.id}>
                    <Avatar showName size={32} userid={r.otherId}></Avatar>
                    <div className="shy-blacklist-operator">
                        <IconButton width={24} size={14} wrapper icon={CloseTickSvg} click={e => removeBlackList(r)}></IconButton>
                    </div>
                </div>
            })
        }</div>
    </div>
});