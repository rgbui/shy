import lodash from "lodash";
import { makeObservable, observable, runInAction } from "mobx";
import { ResourceArguments } from "rich/extensions/icon/declare";
import { channel } from "rich/net/channel";
import { UserBasic } from "rich/types/user";
import { surface } from "../..";
import { UserChannel, UserRoom, UserCommunicate } from "./declare";

class UserChannelStore {
    constructor() {
        makeObservable(this, {
            showFriend: observable,
            channels: observable,
            rooms: observable,
            currentChannel: observable,
            currentRoom: observable,
            mode: observable,
            friends: observable,
            pends: observable,
            blacklist: observable,
            roomChats: observable,
        });
    }
    showFriend: boolean = true;
    channels: UserChannel[] = [];
    rooms: UserRoom[] = [];
    currentRoom: UserRoom = null;
    currentChannel: UserChannel = null;
    currentChats: UserCommunicate[] = null;
    async loadChannels() {
        var r = await channel.get('/user/channels', { page: 1, size: 200 });
        if (r.ok) {
            runInAction(() => {
                this.rooms = r.data.rooms;
                this.channels = r.data.list;
            })
        }
    }
    async changeRoom(channel, room) {
        this.showFriend = false;
        var map = this.roomChats.get(room.id);
        if (!map) {
            /**加载数据 */
            map = await this.loadRoomChats(channel, room);
        }
        runInAction(() => {
            this.currentRoom = room;
            this.currentChannel = channel
        })
    }
    async openUserChannel(userid: string) {
        var room = this.rooms.find(g => g.users.some(s => s.userid == userid) && g.users.length == 2);
        if (room) {
            var ch = this.channels.find(c => c.roomId == room.id);
            if (ch) {
                ch.lastDate = new Date();
                await channel.patch('/user/channel/active', { id: ch.id });
                await this.sortChannels()
                await this.changeRoom(ch, room);
                return;
            }
        }
        var r = await channel.put('/user/channel/join', { userids: [userid] });
        if (r.ok) {
            if (!this.channels.some(s => s.id == r.data.channel.id)) this.channels.push(r.data.channel as UserChannel)
            if (!this.rooms.some(s => s.id == r.data.room.id)) this.rooms.push(r.data.room as UserRoom);
            console.log(r.data);
            await this.sortChannels()
            await this.changeRoom(r.data.channel, r.data.room);
        }
    }
    async sortChannels() {
        var cs = lodash.sortBy(this.channels, 'lastDate');
        cs.reverse();
        this.channels = cs;
    }
    async openFriends() {
        runInAction(() => {
            this.showFriend = true;
            this.currentChannel = null;
            this.currentRoom = null;
        })
    }
    roomChats: Map<string, {
        channel?: any,
        users: {
            id: string;
            sn: number;
            avatar: ResourceArguments;
            name: string;
        }[], room?: any, seq?: number, chats: any[]
    }> = new Map();
    async loadRoomChats(ch: any, room: any) {
        var r = await channel.get('/user/chat/list', { roomId: room.id });
        if (r.ok) {
            var list = r.data.list || [];
            var users = await channel.get('/users/basic', { ids: room.users.map(u => u.userid) })
            var data = { channel: ch, room, users: users?.data?.list || [], seq: list.last()?.seq, chats: list } as any;
            this.roomChats.set(room.id, data);
            return data;
        }
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
        var cm = this.roomChats.get(data.roomId);
        if (cm) {
            if (!Array.isArray(cm.chats)) cm.chats = [];
            cm.chats.push(data);
        }
    }
}

export var userChannelStore = new UserChannelStore();