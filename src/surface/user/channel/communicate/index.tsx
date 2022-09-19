import { observer } from "mobx-react";
import React from "react";
import { RichTextInput } from "rich/component/view/rich.input/index";
import { channel } from "rich/net/channel";
import { surface } from "../../..";
import { userChannelStore } from "../store";
import "./style.less";
import { timService } from "../../../../../net/primus";
import { UserBox } from "rich/component/view/avator/user";
import { Loading } from "rich/component/view/loading";
import { RenderChatsView } from "./render";
import { ChannelTextType } from "rich/extensions/chats/declare";
import { util } from "rich/util/util";
export var CommunicateView = observer(function () {
    function popOpen(cs: { char: string, span: HTMLElement }) {

    }
    async function onInput(data: {
        files?: File[];
        content?: string;
        reply?: {
            replyId: string;
        };
    }) {
        if (data.content) {
            var room = userChannelStore.currentChannel.room;
            var toUsers = room.users.map(c => c.userid);
            var re = await channel.put('/user/chat/send', {
                sockId: timService.sockId,
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
                await userChannelStore.setRoomSeqCache(room.id, re.data.seq);
                // await this.block.setLocalSeq(re.data.seq);
                // this.forceUpdate(()=>this.updateScroll());
            }
        }
        else if (data.files) {
            for (let i = 0; i < data.files.length; i++) {
                var id = util.guid();
                var file = data.files[i];
                var fr = { id, text: file.name, speed: `${file.name}-读取中...` };
                room.uploadFileds.push(fr);
                // this.forceUpdate(()=>this.updateScroll());
                var d = await channel.post('/user/upload/file', {
                    file,
                    uploadProgress: (event) => {
                        if (event.lengthComputable) {
                            fr.speed = `${file.name}-${util.byteToString(event.total)}(${(100 * event.loaded / event.total).toFixed(2)}%)`;
                            this.forceUpdate()
                        }
                    }
                });
                if (d) {
                    fr.speed = `${file.name}-上传完成`;
                    this.forceUpdate();
                    var re = await channel.put('/user/chat/send', {
                        sockId: timService.sockId,
                        tos: toUsers,
                        roomId: room.id,
                        file: d.data.file,
                    });
                    if (re.data) {
                        room.uploadFileds.remove(g => g.id == fr.id);
                        room.chats.push({
                            id: re.data.id,
                            userid: this.block.page.user.id,
                            createDate: re.data.createDate || new Date(),
                            file: d.data.file as any,
                            roomId: room.id,
                            seq: re.data.seq
                        });
                        await userChannelStore.setRoomSeqCache(room.id, re.data.seq);
                    }
                }
                await util.delay(20)
            }
        }
    }
    async function loadChats() {
        var ch = userChannelStore.currentChannel;
        if (ch && ch.room.isLoadChat !== true) {
            var r = await channel.get('/user/chat/list', { roomId: ch.room.id });
            if (r.ok) {
                var list = r.data.list || [];
                if (!Array.isArray(ch.room.chats)) ch.room.chats = [];
                ch.room.chats.push(...list);
            }
        }
    }
    React.useEffect(() => {
        loadChats()
    },[userChannelStore.currentChannel])
    if (!userChannelStore.currentChannel) return <Loading></Loading>
    return <div className="shy-user-channel-communicate">
        <div className="shy-user-channel-communicate-head">
            {<UserBox userid={surface.user.id == userChannelStore.currentChannel.room.creater ? userChannelStore.currentChannel.room.other : userChannelStore.currentChannel.room.creater}>{(user) => {
                return <span>@{user?.name}</span>
            }}</UserBox>}
        </div>
        <div className="shy-user-channel-communicate-content">
            {<RenderChatsView></RenderChatsView>}
        </div>
        <div className="shy-user-channel-communicate-input">
            <RichTextInput popOpen={popOpen} onInput={onInput}></RichTextInput>
        </div>
    </div>
})