import lodash from "lodash";
import { makeObservable, observable, runInAction } from "mobx";
import { channel } from "rich/net/channel";
import { UserBasic } from "rich/types/user";
import { surface } from "../..";
import { CacheKey, sCache } from "../../../../net/cache";
import { UserChannel, UserRoom } from "./declare";

class UserChannelStore {
    constructor() {
        makeObservable(this, {
            showFriend: observable,
            channels: observable,
            currentChannel: observable,
            mode: observable,
            friends: observable,
            pends: observable,
            blacklist: observable
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
    async loadChannels() {
        var r = await channel.get('/user/channels', { page: 1, size: 200 });
        if (r.ok) {
            runInAction(() => {
                this.channels = { list: r.data.list, total: r.data.total, page: r.data.page, size: r.data.size };
                this.channels.list.forEach(c => {
                    if (!c.room) {
                        c.room = r.data.rooms.find(g => g.id == c.roomId)
                    }
                })
            })
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
        }
        if (ch) {
            if (!Array.isArray(ch.room.chats)) ch.room.chats = [];
            ch.room.chats.push(data);
            if (this.currentChannel !== ch) {
                if (typeof ch.unreadSeq == 'undefined')
                    ch.unreadSeq = data.seq;
                else ch.unreadSeq > data.seq
                ch.unreadSeq = data.seq;
            }
        }
    }
    async setRoomSeqCache(roomId: string,seq: number)
    {
        sCache.set(CacheKey.roomCache.replace('{roomId}',roomId), seq)
    }
}

export var userChannelStore = new UserChannelStore();