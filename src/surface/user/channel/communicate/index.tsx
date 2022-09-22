import React from "react";
import { RichTextInput } from "rich/component/view/rich.input/index";
import { channel } from "rich/net/channel";
import { surface } from "../../..";
import { userChannelStore } from "../store";
import "./style.less";
import { UserBox } from "rich/component/view/avator/user";
import { RenderChatsView } from "./render";
import { ChannelTextType } from "rich/extensions/chats/declare";
import { util } from "rich/util/util";
import { UserChannel } from "../declare";
import { Avatar } from "rich/component/view/avator/face";

export class CommunicateView extends React.Component<{ userChannel: UserChannel }>{
    popOpen = (cs: { char: string, span: HTMLElement }) => {

    }
    componentDidMount(): void {
        this.props.userChannel.communicateView = this;
        this.loadChats();
    }
    componentWillUnmount(): void {
        this.props.userChannel.communicateView = null;
    }
    onInput = async (data: {
        files?: File[];
        content?: string;
        reply?: {
            replyId: string;
        }
    }) => {
        if (data.content) {
            var room = this.props.userChannel.room;
            var toUsers = room.users.map(c => c.userid);
            var re = await channel.put('/user/chat/send', {
                tos: toUsers,
                roomId: room.id,
                content: data.content,
                replyId: data.reply?.replyId || undefined
            })
            if (re.data) {
                var chat: ChannelTextType = {
                    id: re.data.id,
                    userid: surface.user.id,
                    createDate: re.data.createDate || new Date(),
                    content: data.content,
                    roomId: room.id,
                    seq: re.data.seq,
                    replyId: data.reply?.replyId || undefined
                };
                if (chat.replyId) {
                    chat.reply = room.chats.find(b => b.id == chat.replyId);
                }
                room.chats.push(chat);
                await userChannelStore.readRoomChat(this.props.userChannel);
                this.notifyNewChat();
            }
        }
        else if (data.files) {
            for (let i = 0; i < data.files.length; i++) {
                var id = util.guid();
                var file = data.files[i];
                var fr = { id, text: file.name, speed: `${file.name}-读取中...` };
                room.uploadFileds.push(fr);
                this.notifyNewUploadFile();
                var d = await channel.post('/user/upload/file', {
                    file,
                    uploadProgress: (event) => {
                        if (event.lengthComputable) {
                            fr.speed = `${file.name}-${util.byteToString(event.total)}(${(100 * event.loaded / event.total).toFixed(2)}%)`;
                            this.notifyNewUploadFile();
                        }
                    }
                });
                if (d) {
                    fr.speed = `${file.name}-上传完成`;
                    this.notifyNewUploadFile();
                    var re = await channel.put('/user/chat/send', {
                        tos: toUsers,
                        roomId: room.id,
                        file: d.data.file,
                    });
                    if (re.data) {
                        room.uploadFileds.remove(g => g.id == fr.id);
                        room.chats.push({
                            id: re.data.id,
                            userid: surface.user.id,
                            createDate: re.data.createDate || new Date(),
                            file: d.data.file as any,
                            roomId: room.id,
                            seq: re.data.seq
                        });
                        this.notifyNewUploadFile();
                        await userChannelStore.readRoomChat(this.props.userChannel);
                    }
                }
                await util.delay(20)
            }
        }
    }
    loadChats = async () => {
        if (this.props.userChannel.room.isLoadChat !== true) {
            var ch = this.props.userChannel;
            var r = await channel.get('/user/chat/list', { roomId: ch.room.id });
            if (!Array.isArray(ch.room.chats)) ch.room.chats = [];
            if (r.ok) {
                var list = r.data.list || [];
                list.each(l => {
                    if (!ch.room.chats.some(s => s.id == l.id)) {
                        ch.room.chats.push(l);
                    }
                })
            }
            this.props.userChannel.room.isLoadChat = true;
            await userChannelStore.readRoomChat(ch);
            this.forceUpdate(() => {
                this.updateScroll()
            })
        }
    }
    richInput: RichTextInput;
    replyChat = async (d: ChannelTextType) => {
        if (this.richInput) {
            var use = await channel.get('/user/basic', { userid: d.userid });
            this.richInput.openReply({ text: `回复${use.data.user.name}:${d.content}`, replyId: d.id })
        }
    }
    reditChat = (d: ChannelTextType) => {
        this.richInput.onReplaceInsert(d.content);
    }
    render(): React.ReactNode {
        var props = this.props;
        if (userChannelStore.currentChannelId == this.props.userChannel.id) {
            return <div className="shy-user-channel-communicate">
                {<UserBox userid={surface.user.id == props.userChannel.room.creater ? props.userChannel.room.other : props.userChannel.room.creater}>{(user) => {
                    return <><div className="shy-user-channel-communicate-head">
                        <span>@{user?.name}</span>
                    </div>
                        <div className="shy-user-channel-communicate-content" ref={e => this.scrollEl = e}>
                            <div className="gap-w-20">
                                <Avatar user={user} size={80}></Avatar>
                                <div className="h3">{user.name}</div>
                                <div className="remark f-12">这是您与<span className="bold text-1">@{user.name}</span>私信记录的开头。</div>
                            </div>
                            {props.userChannel.room.isLoadChat && <RenderChatsView userChannel={props.userChannel} reditChat={this.reditChat} replyChat={this.replyChat}></RenderChatsView>}
                        </div>
                        <div className="shy-user-channel-communicate-input">
                            <RichTextInput placeholder={'@' + user?.name} ref={e => this.richInput = e} popOpen={this.popOpen} onInput={this.onInput}></RichTextInput>
                        </div></>
                }}</UserBox>}
            </div>
        } else return <></>
    }
    async notifyNewChat() {
        var room = this.props.userChannel.room
        if (room) {
            await room.viewChats.updateChats(room.chats);
            this.updateScroll();
        }
    }
    notifyNewUploadFile() {
        var room = this.props.userChannel.room
        if (room) {
            if (room.viewChats)
                room.viewChats.forceUpdate(() => {
                    this.updateScroll();
                })
        }
    }
    scrollEl: HTMLElement;
    updateScroll() {
        if (this.scrollEl) {
            this.scrollEl.scrollTop = this.scrollEl.scrollHeight + 100;
            setTimeout(() => {
                this.scrollEl.scrollTop = this.scrollEl.scrollHeight + 100;
            }, 300);
        }
    }
}


