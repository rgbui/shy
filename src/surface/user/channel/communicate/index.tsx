import React from "react";
import { channel } from "rich/net/channel";
import { surface } from "../../../app/store";
import { userChannelStore } from "../store";
import { UserBox } from "rich/component/view/avator/user";
import { RenderChatsView } from "./render";
import { ChannelTextType } from "rich/extensions/chats/declare";
import { UserChannel } from "../declare";
import { Avatar } from "rich/component/view/avator/face";
import { InputChatBox } from "rich/component/view/input.chat/box";
import { ResourceArguments } from "rich/extensions/icon/declare";
import { lst } from "rich/i18n/store";
import { S, Sp } from "rich/i18n/view";
import { Icon } from "rich/component/view/icon";
import { CheckSvg } from "rich/component/svgs";
import { observer } from "mobx-react";
import "./style.less";


@observer
export class CommunicateView extends React.Component<{ userChannel: UserChannel }>{
    componentDidMount(): void {
        this.props.userChannel.communicateView = this;
        this.loadChats();
    }
    componentWillUnmount(): void {
        this.props.userChannel.communicateView = null;
    }
    onInput = async (data: {
        files?: ResourceArguments[];
        content?: string;
        replyId: string
    }) => {
        var room = this.props.userChannel.room;
        var toUsers = room.users.map(c => c.userid);
        var re = await channel.put('/user/chat/send', {
            tos: toUsers,
            roomId: room.id,
            content: data.content,
            replyId: data.replyId || undefined,
            files: data.files
        })
        if (re.data) {
            var chat: ChannelTextType = {
                id: re.data.id,
                userid: surface.user.id,
                createDate: re.data.createDate || new Date(),
                content: data.content,
                roomId: room.id,
                seq: re.data.seq,
                files: data.files,
                replyId: data?.replyId || undefined
            };
            if (chat.replyId) {
                chat.reply = room.chats.find(b => b.id == chat.replyId);
            }
            room.chats.push(chat);
            await userChannelStore.readRoomChat(this.props.userChannel);
            this.notifyNewChat();
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
    richInput: InputChatBox;
    replyChat = async (d: ChannelTextType) => {
        if (this.richInput) {
            var use = await channel.get('/user/basic', { userid: d.userid });
            this.richInput.openReply({ text: lst('回复') + `${use.data.user.name}:${d.content}`, replyId: d.id })
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
                    return <><div className="shy-user-channel-communicate-head desk-drag">
                        <span>@{user?.name}</span>
                    </div>
                        <div className="shy-user-channel-communicate-content" ref={e => this.scrollEl = e}>
                            <div className="gap-20">
                                <Avatar user={user} size={80}></Avatar>
                                <div className="h2 flex"><span>{user.name}</span>{user.role == 'robot' && <span className='bg-p-1 text-white round flex-center flex-inline padding-w-3  h-16 gap-w-2' style={{ color: '#fff', backgroundColor: 'rgb(88,101,242)' }}>
                                    <Icon icon={CheckSvg} size={12}></Icon><span className='gap-l-2 f-12' style={{ color: '#fff' }}><S>机器人</S></span>
                                </span>}</div>
                                <div className="remark f-12"><Sp text="这是您与{name}私信记录的开头" data={{ name: user.name }}>这是您与<span className="bold text-1">@{user.name}</span>私信记录的开头。</Sp></div>
                            </div>
                            {props.userChannel.room.isLoadChat && <RenderChatsView userChannel={props.userChannel} reditChat={this.reditChat} replyChat={this.replyChat}></RenderChatsView>}
                        </div>
                        <div className="shy-user-channel-communicate-input bg-3">
                            <InputChatBox  placeholder={'@' + user?.name} ref={e => this.richInput = e} onChange={this.onInput}></InputChatBox>
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


