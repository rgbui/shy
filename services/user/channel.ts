import { get } from "rich/net/annotation";
import { masterSock } from "../../net/sock";
import { BaseService } from "../common/base";

class UserService extends BaseService {
    @get('/user/channels')
    async getUserChannel(args: { page?: number, size?: number }) {
        return await masterSock.get('/user/channels', args);
    }
}