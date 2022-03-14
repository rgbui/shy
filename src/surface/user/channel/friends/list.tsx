
import { observer } from "mobx-react";
import { Avatar } from "rich/component/view/avator/face";
import React from "react";
import { Input } from "rich/component/view/input";
import { IconButton } from "rich/component/view/icon";
import { CommentSvg } from "rich/component/svgs";
import { userChannelStore } from "../store";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Rect } from "rich/src/common/vector/point";
import { channel } from "rich/net/channel";
export var FrendListView = observer(function () {
    var refInput = React.useRef<Input>(null);
    async function joinChannel(row) {
        await userChannelStore.openUserChannel({ id: row.friendId } as any)
    }
    async function open(event: React.MouseEvent, row) {
        event.stopPropagation();
        if (row) {
            var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(event) }, [{ name: 'delete', text: '删除好友' }]);
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
                <Avatar size={32} showName userid={r.friendId}></Avatar>
                <div className="shy-friends-operator" >
                    <IconButton
                        wrapper
                        icon={CommentSvg}
                        size={14}
                        width={32}
                        onMouseDown={e => open(e, r)}></IconButton>
                </div>
            </div>
        })}</div>

    </div>
});