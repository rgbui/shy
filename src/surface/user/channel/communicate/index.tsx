import { observer } from "mobx-react";
import React from "react";
import { Avatar } from "rich/component/view/avator/face";
import { RichTextInput } from "rich/component/view/rich.input/index";
import { channel } from "rich/net/channel";
import { surface } from "../../..";
import { userChannelStore } from "../store";
export var CommunicateView = observer(function () {
    var cm = userChannelStore.currentRoom ? userChannelStore.channelMaps.get(userChannelStore.currentRoom.id) : undefined;
    var currentUser = cm ? cm.users.find(g => g.id != cm.channel.userid) : undefined;
    function popOpen(cs: { char: string, span: HTMLElement }) {

    }
    async function onInput(data: { files?: File[], content?: string }) {
        if (data.content) {
            var re = await channel.put('/user/chat/send', { roomId: cm.room.id, content: data.content });
            if (re.data) {
                cm.chats.push({
                    id: re.data.id,
                    userid: surface.user.id,
                    createDate: re.data.createDate || new Date(),
                    content: data.content,
                    seq: re.data.seq
                })
            }
        }
    }
    function renderChats() {
        if (!cm) return <></>
        return cm.chats.map(c => {
            return <div key={c.id}>
                <Avatar userid={c.userid}></Avatar>
                <div>{c.content}</div>
            </div>
        })
    }
    return <div className="shy-user-channel-communicate">
        <div className="shy-user-channel-communicate-head"><span>@{currentUser?.name}</span></div>
        <div className="shy-user-channel-communicate-content">{renderChats()}</div>
        <div className="shy-user-channel-communicate-input">
            <RichTextInput popOpen={popOpen} onInput={onInput}></RichTextInput>
        </div>
    </div>
})