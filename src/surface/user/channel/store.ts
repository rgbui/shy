import { makeObservable, observable, runInAction } from "mobx";
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
            blacklist: observable
        });
    }
    showFriend: boolean = false;
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