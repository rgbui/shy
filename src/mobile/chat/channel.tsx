import { Observer, observer } from "mobx-react"
import React from "react";
import { userChannelStore } from "../../surface/user/channel/store";
import { surface } from "../../surface/store";
import { UserBox } from "rich/component/view/avator/user";
import { Avatar } from "rich/component/view/avator/face";
import { DotNumber } from "rich/component/view/dot";
export var ChannelView = observer(function () {
    return <div>
        {userChannelStore.channels.list.map(c => {
            if (c.room?.single) {
                var friendId = c.room.other;
                if (friendId == surface.user.id) friendId = c.room.creater;
                return <div key={c.id}
                    onMouseDown={e => userChannelStore.changeRoom(c)}
                    className={"shy-user-channels-room" + (c.id == userChannelStore.currentChannelId ? " hover" : "")}>
                    <UserBox userid={friendId}>{(user) => {
                        return <div className="flex">
                            <Observer>{() => {
                                return <><div className="flex-fixed size-32 relative"><Avatar size={32} user={user}></Avatar>  {c.unreadCount > 0 && <DotNumber count={c.unreadCount}></DotNumber>}</div>
                                    <div className="flex-auto gap-l-5" style={{ width: 'calc(100% - 40px)' }}>
                                        <div className="f-14 bold">{user.name}</div>
                                        <div className="remark text-over f-12">{c.room.currentContent}</div>
                                    </div></>
                            }}</Observer>
                        </div>
                    }}</UserBox>

                </div>
            }
            else {
                return <div key={c.id} className="shy-user-channels-room">
                </div>
            }
        })}
    </div>
})
