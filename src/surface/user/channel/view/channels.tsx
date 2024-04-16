import { Observer, observer } from "mobx-react";
import React from "react";
import { Avatar } from "rich/component/view/avator/face";
import { UserBox } from "rich/component/view/avator/user";
import { DotNumber } from "rich/component/view/dot";
import { surface } from "../../../app/store";
import { userChannelStore } from "../store";
import { S } from "rich/i18n/view";

export var UserChannels = observer(function () {
    React.useEffect(() => {
        userChannelStore.loadChannels();
    }, [])
    return <div className="shy-user-channels">
        <div className="shy-user-channels-head">
            <span><S>私信</S></span>
            {/*<Icon style={{display:'none'}} size={14} icon={PlusSvg}></Icon> */}
        </div>
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