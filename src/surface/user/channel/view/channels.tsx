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
        {userChannelStore.channels.list.map(c => {
            if (c.room?.single) {
                var friendId = c.room.other;
                if (friendId == surface.user.id) friendId = c.room.creater;
                return <div key={c.id}
                    onMouseDown={e => userChannelStore.changeRoom(c)}
                    className={"shy-user-channels-room" + (c.id == userChannelStore.currentChannel.id ? " hover" : "")}>
                    <Avatar showName size={32} userid={friendId}></Avatar>
                </div>
            }
            else {
                return <div key={c.id} className="shy-user-channels-room">

                </div>
            }
        })}
    </div>
})