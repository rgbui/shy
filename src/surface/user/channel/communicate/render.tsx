import lodash from "lodash";
import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { ViewChats } from "rich/extensions/chats";
import { ChannelTextType } from "rich/extensions/chats/declare";
import { EmojiCode } from "rich/extensions/emoji/store";
import { channel } from "rich/net/channel";
import { surface } from "../../..";
import { userChannelStore } from "../store";

export var RenderChatsView = observer(function (props: { replyChat(d: ChannelTextType): any }) {
    var local = useLocalObservable<{ viewChats: ViewChats }>(() => {
        return {
            viewChats: null
        }
    })
    async function delChat(d: ChannelTextType) {
        await channel.del('/user/chat/cancel', { roomId: userChannelStore.currentChannel.roomId, id: d.id })
        lodash.remove(userChannelStore.currentChannel.room.chats, x => x.id == d.id)
    }
    async function emojiChat(d: ChannelTextType, re: Partial<EmojiCode>) {

    }
    async function patchChat(d: ChannelTextType, data: { content: string }) {
        await channel.patch('/user/chat/patch', { roomId: userChannelStore.currentChannel.roomId, content: data.content, id: d.id })
        Object.assign(d, data);
    }
    async function reportChat(d: ChannelTextType) {

    }

    React.useEffect(() => {
        console.log('ggg');
        if (local.viewChats) local.viewChats.updateChats(userChannelStore.currentChannel.room.chats)
    }, [userChannelStore.currentChannel.room.chats])
    return <div className="shy-user-channel-chats">
        <ViewChats ref={e => local.viewChats = e}
            chats={userChannelStore.currentChannel.room.chats}
            user={surface.user}
            delChat={delChat}
            emojiChat={emojiChat}
            patchChat={patchChat}
            reportChat={reportChat}
            replyChat={props.replyChat}
        ></ViewChats>
    </div>
})