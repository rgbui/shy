import { observer } from "mobx-react";
import React from "react";
import { ViewChats } from "rich/extensions/chats";
import { ChannelTextType } from "rich/extensions/chats/declare";
import { EmojiCode } from "rich/extensions/emoji/store";
import { surface } from "../../..";
import { userChannelStore } from "../store";

export var RenderChatsView = observer(function () {
    async function delChat(d: ChannelTextType) {

    }
    async function emojiChat(d: ChannelTextType, re: Partial<EmojiCode>) {

    }
    async function patchChat(d: ChannelTextType, data: { content: string }) {

    }
    async function reportChat(d: ChannelTextType) {

    }
    async function replyChat(d: ChannelTextType) {

    }
    return <div className="shy-user-channel-chats">
        <ViewChats
            chats={userChannelStore.currentChannel.room.chats}
            user={surface.user}
            delChat={delChat}
            emojiChat={emojiChat}
            patchChat={patchChat}
            reportChat={reportChat}
            replyChat={replyChat}
        ></ViewChats>
    </div>
})