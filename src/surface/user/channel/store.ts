import { makeObservable, observable, runInAction } from "mobx";
import { ResourceArguments } from "rich/extensions/icon/declare";
import { channel } from "rich/net/channel";

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
            channelMaps: observable,
        });
    }
    showFriend: boolean = true;
    channels: any[] = [];
    rooms: any[] = [];
    currentRoom: any = null;
    currentChannel: any = null;
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
        var map = this.channelMaps.get(room.id);
        console.log(map,'sxx')
        if (!map) {
            /**加载数据 */
           map= await this.loadRoomChats(channel, room);
        }
        runInAction(() => {
            this.currentRoom = room;
            this.currentChannel = channel;
            console.log('sss',map)
        })
    }
    channelMaps: Map<string, {
        channel?: any, users: {
            id: string;
            sn: number;
            avatar: ResourceArguments;
            name: string;
        }[], room?: any, seq?: number, chats: any[]
    }> = new Map();
    async loadRoomChats(ch: any, room: any) {
        
        var r = await channel.get('/user/chat/list', { roomId: room.id });
        if (r.ok) {
            var list = r.data.list||[];
            var users = await channel.get('/users/basic', { ids: room.users.map(u => u.userid) })
            var data = { channel: ch, room, users: users?.data?.list || [], seq: list.last()?.seq, chats: list };
            this.channelMaps.set(room.id, data);
            return data;
        }
    }
    mode: 'online' | 'all' | 'pending' | 'shield' = 'online';
    friends: { page: number, size: number, total: number, list: any[] } = { page: 1, size: 200, total: 0, list: [] };
    pends: { page: number, size: number, total: number, list: any[] } = { page: 1, size: 200, total: 0, list: [] };
    blacklist: { page: number, size: number, total: number, list: any[] } = { page: 1, size: 200, total: 0, list: [] };
    async loadFriends() {
        var r = await channel.get('/friends', { page: this.friends.page, size: this.friends.size });
        if (r.ok) {
            this.friends = r.data;
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
}

export var userChannelStore = new UserChannelStore();