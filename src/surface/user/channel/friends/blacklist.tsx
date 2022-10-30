import { observer } from "mobx-react";
import React from "react";
import { CloseSvg } from "rich/component/svgs";
import { Avatar } from "rich/component/view/avator/face";
import { Icon } from "rich/component/view/icon";
import { Input } from "rich/component/view/input";
import { ToolTip } from "rich/component/view/tooltip";
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
        {/* <div className="shy-friends-search"><Input ref={e => refInput.current = e} placeholder="搜索" clear /></div> */}
        <div className="shy-friends-head"><span className="f-12">屏蔽-{userChannelStore.blacklist.total}</span></div>
        <div className="shy-friends-list">{
            userChannelStore.blacklist.list.map(r => {
                return <div className='shy-friends-user' key={r.id}>
                    <div className="flex-fixed w-200 flex"> <Avatar showName size={32} userid={r.otherId}></Avatar></div>
                    <div className="flex-auto flex-end" style={{ paddingRight: 120 }}>
                        <ToolTip overlay={"取消黒名单"}><span className="size-24 flex-center round item-hover cursor" onMouseDown={e => removeBlackList(r)}><Icon size={16} icon={CloseSvg}></Icon></span></ToolTip>
                    </div>
                </div>
            })
        }</div>
    </div>
});