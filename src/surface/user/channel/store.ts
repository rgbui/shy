import lodash from "lodash";
import { computed, makeObservable, observable, runInAction } from "mobx";
import { channel } from "rich/net/channel";
import { UserBasic } from "rich/types/user";
import { surface } from "../..";
import { CacheKey, yCache } from "../../../../net/cache";
import { UserChannel, UserRoom } from "./declare";

class UserChannelStore {
    constructor() {
        makeObservable(this,{
            showFriend: observable,
            channels: observable,
            currentChannel: observable,
            mode: observable,
            friends: observable,
            pends: observable,
            blacklist: observable,
            unReadChatCount: computed
        });
    }
    showFriend: boolean = true;
    channels: {
        list: UserChannel[],
        total: number,
        page: number,
        size: number
    } = { list: [], total: 0, page: 1, size: 200 }
    currentChannel: UserChannel = null;
    isloaded: boolean = false;
    get unReadChatCount() {
        return this.channels.list.sum(g => g.unreadCount || 0)
    }
    async loadChannels() {
        if (this.isloaded) return;
        this.isloaded = true;
        var r = await channel.get('/user/channels', { page: 1, size: 200 });
        if (r.ok) {
            this.channels = {
                list: r.data.list,
                total: r.data.total,
                page: r.data.page,
                size: r.data.size
            };
            await this.channels.list.eachAsync(async c => {
                if (!c.room) {
                    c.room = r.data.rooms.find(g => g.id == c.roomId)
                    c.room.chats = [];
                    var g = await yCache.get(CacheKey.roomCache.replace('{roomId}', c.room.id));
                    if (g) {
                        if (typeof g == 'string') g = parseFloat(g);
                        if (!isNaN(g)) {
                            c.readedSeq = g;
                        }
                    }
                }
            });
            await this.loadUnreadCounts();
        } else this.isloaded = false;
    }
    /**
     * 获取未读的聊天数
     */
    async loadUnreadCounts() {
        var rs: { roomId: string, seq: number }[] = [];
        this.channels.list.forEach(c => {
            if (typeof c.room.currentnSeq == 'number') {
                if (c.unreadCount == c.room.currentnSeq) {
                    return;
                }
                rs.push({ roomId: c.room.id, seq: c.readedSeq || undefined })
            }
        });
        if (rs.length > 0) {
            var size = 10;
            var count = Math.ceil(rs.length / size);
            for (let i = 0; i < count; i++) {
                var rgs = rs.slice(i * size, (i + 1) * size);
                var result = await channel.get('/user/room/unread', { unrooms: rgs });
                if (result.ok) {
                    result.data.unreads.forEach(ur => {
                        var c = this.channels.list.find(cc => cc.roomId == ur.roomId);
                        if (c) {
                            c.unreadCount = ur.count;
                        }
                    })
                }
            }
        }
    }
    changeRoom(ch: UserChannel) {
        runInAction(() => {
            this.showFriend = false;
            this.currentChannel = ch;
        })
    }
    async openUserChannel(userid: string) {
        var ch = this.channels.list.find(g => g.room.single == true && (g.room.creater == userid || g.room.other == userid));
        if (ch) {
            ch.lastDate = new Date();
            await channel.patch('/user/channel/active', { id: ch.id });
            this.sortChannels()
            this.changeRoom(ch);
            return;
        }
        var r = await channel.put('/user/channel/join', { userids: [userid] });
        if (r.ok) {
            var ch = r.data.channel as UserChannel;
            if (!this.channels.list.some(s => s.id == ch.id)) {
                ch.room = r.data.room as UserRoom;
                this.channels.list.push(ch);
            }
            else ch = this.channels.list.find(g => g.id == ch.id)
            ch.lastDate = new Date();
            this.sortChannels();
            this.changeRoom(ch);
        }
    }
    sortChannels() {
        var cs = lodash.sortBy(this.channels.list, 'lastDate');
        cs.reverse();
        this.channels.list = cs;
    }
    openFriends() {
        runInAction(() => {
            this.showFriend = true;
            this.currentChannel = null;
        })
    }
    mode: 'online' | 'all' | 'pending' | 'shield' = 'online';
    friends: { page: number, size: number, total: number, users?: UserBasic[], list: any[] } = { page: 1, size: 200, users: [], total: 0, list: [] };
    pends: { page: number, size: number, total: number, list: any[] } = { page: 1, size: 200, total: 0, list: [] };
    blacklist: { page: number, size: number, total: number, list: any[] } = { page: 1, size: 200, total: 0, list: [] };
    async loadFriends() {
        var r = await channel.get('/friends', { page: this.friends.page, size: this.friends.size });
        if (r.ok) {
            this.friends = r.data;
            var ids = this.friends.list.map(c => surface.user.id == c.friendId ? c.userid : c.friendId);
            ids = lodash.uniq(ids);
            var us = await channel.get('/users/basic', { ids: ids });
            if (us?.ok) {
                this.friends.users = us.data.list;
            }
        }
    }
    async loadPends() {
        var r = await channel.get('/friends/pending', { page: this.pends.page, size: this.pends.size });
        if (r.ok) {
            this.pends = r.data;
        }
    }
    async loadBlacklist() {
        var r = await channel.get('/user/blacklist', { page: this.blacklist.page, size: this.blacklist.size });
        if (r.ok) {
            this.blacklist = r.data;
        }
    }
    async notifyChat(data) {
        var ch = this.channels.list.find(g => g.room == data.roomId);
        if (!ch) {
            //这个需要自动创建一个新的channel
            var r = await channel.get('/user/channel/create', { roomId: data.roomId });
            if (r.ok) {
                ch = r.data.channel
                this.channels.list.push(ch);
                this.sortChannels();
            }
        }
        if (ch) {
            if (!Array.isArray(ch.room.chats)) ch.room.chats = [];
            ch.room.chats.push(data);
            if (this.currentChannel !== ch) {
                ch.unreadCount = (ch.unreadCount || 0) + 1;
                ch.room.currentnSeq = ch.room.chats.max(c => c.seq);
            }
            else {
                await this.readRoomChat(ch);
            }
        }
    }
    async readRoomChat(channel: UserChannel) {
        runInAction(() => {
            channel.readedSeq = channel.room.chats.max(c => c.seq);
            channel.room.currentnSeq = channel.readedSeq;
            channel.unreadCount = 0;
        })
        await yCache.set(CacheKey.roomCache.replace('{roomId}', channel.room.id), channel.readedSeq)
    }
}

export var userChannelStore = new UserChannelStore();