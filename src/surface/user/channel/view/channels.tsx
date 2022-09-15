import { observer } from "mobx-react";
import React from "react";
import { Avatar } from "rich/component/view/avator/face";
import { surface } from "../../..";
import { userChannelStore } from "../store";
export var UserChannels = observer(function () {
    React.useEffect(() => {
        userChannelStore.loadChannels();
    }, [])
    return <div className="shy-user-channels">
        <div className="shy-user-channels-head">
            <span>私信</span>
            {/*<Icon style={{ display: 'none' }} size={14} icon={PlusSvg}></Icon> */}
        </div>
        {userChannelStore.channels.map(c => {
            var room = userChannelStore.rooms.find(g => g.id == c.roomId);
            if (room.users.length == 2) {
                var friendId = room.users.find(g =>g.userid != surface.user.id)?.userid;
                return <div key={c.id}
                    onMouseDown={e => userChannelStore.changeRoom(c, room)}
                    className={"shy-user-channels-room" + (c.roomId == userChannelStore.currentRoom?.id ? " hover" : "")}>
                    <Avatar showName size={32} userid={friendId}></Avatar>
                </div>
            }
            else if (room.users.length > 2) {
                return <div key={c.id} className="shy-user-channels-room">

                </div>
            }
        })}
    </div>
})