import { del, get, patch, put } from "rich/net/annotation";
import { masterSock } from "../../net/sock";
import { BaseService } from "../common/base";

class UserService extends BaseService {
    @get('/user/channels')
    async getUserChannel(args: { page?: number, size?: number }) {
        return await masterSock.get('/user/channels', args);
    }
    @del('/user/channel/delete')
    async userChannelDelete(args) {
        return await masterSock.delete('/user/channel/delete', args);
    }
    @put('/user/channel/join')
    async userChannelJoin(args) {
        return await masterSock.put('/user/channel/join', args);
    }
    @get('/friend/is')
    async isFriend(args) {
        return await masterSock.get('/friend/is', args);
    }
    @put('/friend/join')
    async joinUser(args) {
        return await masterSock.put('/friend/join', args);
    }
    @put('/friend/agree')
    async friendAgree(args) {
        return await masterSock.put('/friend/agree', args);
    }
    @get('/friends')
    async userFriends(args) {
        return await masterSock.get('/friends', args);
    }
    @del('/friend/delete')
    async deleteUserFriend(args) {
        return await masterSock.delete('/friend/delete', args);
    }
    @get('/friends/pending')
    async userFriendsPending(args) {
        return await masterSock.get('/friends/pending', args);
    }
    @get('/user/blacklist')
    async userblacklist(args) {
        return await masterSock.get('/user/blacklist', args);
    }
    @put('/blacklist/join')
    async joinBlacklist(args) {
        return await masterSock.put('/blacklist/join', args);
    }
    @del('/user/blacklist/delete')
    async deleteUserBlacklist(args) {
        return await masterSock.delete('/user/blacklist/delete', args);
    }
    @put('/user/chat/send')
    async putUserChat(args) {
        return await masterSock.put('/user/chat/send', args);
    }
    @get('/user/chat/list')
    async getChatList(args) {
        return await masterSock.get('/user/chat/list', args);
    }
    @get('/search/friends')
    async searchFriends(args) {
        return await masterSock.get('/search/friends', args);
    }
    @get('/search/friends/pending')
    async searchFriendsPending(args) {
        return await masterSock.get('/search/friends/pending', args);
    }
    @get('/search/blacklist')
    async searchBloacklist(args) {
        return await masterSock.get('/search/blacklist', args);
    }
    @patch('/user/channel/active')
    async patchChannel(args) {
        console.log(args,'args');
        return await masterSock.patch('/user/channel/active', args);
    }
}