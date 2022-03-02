import { del, get, put } from "rich/net/annotation";
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
    @get('/friend/is')
    async isFriend(args) {
        return await masterSock.get('/friend/is', args);
    }
    @put('/friend/join')
    async joinUser(args) {
        return await masterSock.put('/friend/join', args);
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
}