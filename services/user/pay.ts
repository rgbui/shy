import { put } from "rich/net/annotation";
import { masterSock } from "../../net/sock";
import { BaseService } from "../common/base";

class UserPay extends BaseService {

    @put('/create/qr_pay/order')
    async userChannelJoin(args) {
        return await masterSock.put('/create/qr_pay/order', args);
    }
}