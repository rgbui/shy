
import { observer } from "mobx-react";
import { Avatar } from "rich/component/view/avator/face";
import React from "react";
import { Input } from "rich/component/view/input";
import { Icon } from "rich/component/view/icon";
import { CommentSvg, DotsSvg } from "rich/component/svgs";
import { userChannelStore } from "../store";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Rect } from "rich/src/common/vector/point";
import { channel } from "rich/net/channel";
import { ToolTip } from "rich/component/view/tooltip";

export var FrendListView = observer(function () {
    var refInput = React.useRef<Input>(null);
    async function joinChannel(row) {
        await userChannelStore.openUserChannel({ id: row.friendId } as any)
    }
    async function open(event: React.MouseEvent, row) {
        event.stopPropagation();
        if (row) {
            var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(event) }, [
                { name: 'delete', text: '解除好友关系' }
            ]);
            if (r) {
                if (r.item.name == 'delete') {
                    await channel.del('/friend/delete', { id: row.id });
                    userChannelStore.friends.list.remove(g => g.id == row.id);
                }
            }
        }
    }
    React.useEffect(() => {
        userChannelStore.loadFriends();
    }, [])
    return <div className="shy-friends">
        <div className="shy-friends-search"><Input ref={e => refInput.current = e} placeholder="搜索" clear /></div>
        <div className="shy-friends-head"><span>好友-{userChannelStore.friends.total}</span></div>
        <div className="shy-friends-list">{userChannelStore.friends.list.map(r => {
            return <div key={r.id} className='shy-friends-user' onMouseDown={e => joinChannel(r)}>

                <div className="flex-fixed w-200 flex"><Avatar size={32} showName userid={r.friendId}></Avatar></div>
                <div className="flex-auto flex-end" style={{ paddingRight: 120 }}>
                    <ToolTip overlay={"消息"}><span className="size-24 flex-center round item-hover cursor gap-r-10" onMouseDown={e => joinChannel(r)}><Icon size={16} icon={CommentSvg}></Icon></span></ToolTip>
                    <ToolTip overlay={"操作"}><span className="size-24 flex-center round item-hover cursor gap-r-10" onMouseDown={e => open(e, r)}><Icon size={16} icon={DotsSvg}></Icon></span></ToolTip>
                </div>
            </div>
        })}</div>

    </div>
});