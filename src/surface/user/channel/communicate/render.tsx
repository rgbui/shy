import React from "react";
import { ViewChats } from "rich/extensions/chats";
import { ChannelTextType } from "rich/extensions/chats/declare";
import { EmojiCode } from "rich/extensions/emoji/store";
import { channel } from "rich/net/channel";
import { surface } from "../../../store";
import { UserChannel } from "../declare";
export class RenderChatsView extends React.Component<{
    userChannel: UserChannel,
    reditChat(d: ChannelTextType): any,
    replyChat(d: ChannelTextType): any
}>{
    delChat = async (d: ChannelTextType) => {
        return await channel.del('/user/chat/cancel', { roomId: this.props.userChannel.roomId, id: d.id })
    }
    emojiChat = async (d: ChannelTextType, re: Partial<EmojiCode>) => {
        var result = await channel.put('/user/chat/emoji', {
            id: d.id,
            roomId: this.props.userChannel.roomId,
            emoji: {
                emojiId: re.code,
                code: re.code
            }
        })
        return result;
    }
    patchChat = async (d: ChannelTextType, data: { content: string }) => {
        return await channel.patch('/user/chat/patch', {
            roomId: this.props.userChannel.roomId,
            content: data.content, id: d.id
        })
    }
    reportChat = async (d: ChannelTextType) => {

    }
    reditChat = async (d: ChannelTextType) => {
        this.props.reditChat(d);
    }
    render() {
        var props = this.props;
        return <div className="shy-user-channel-chats">
            <ViewChats ref={e => props.userChannel.room.viewChats = e}
                chats={props.userChannel.room.chats}
                user={surface.user}
                redit={this.reditChat}
                delChat={this.delChat}
                emojiChat={this.emojiChat}
                patchChat={this.patchChat}
                reportChat={this.reportChat}
                replyChat={props.replyChat}
            ></ViewChats>
        </div>
    }
}


