import { del, get, put } from "rich/net/annotation";
import { masterSock } from "../../net/sock";
import { BaseService } from "../common/base";



class UserPay extends BaseService {
    @put('/create/qr_pay/order')
    async userPayQr(args) {
        return await masterSock.put('/create/qr_pay/order', args);
    }
    @get('/user/order/list')
    async userOrderList(args) {
        return await masterSock.get('/user/order/list', args);
    }
    @del('/user/del/order')
    async delrderList(args) {
        return await masterSock.delete('/user/del/order', args);
    }
    @get('/user/wallet')
    async userWallert(args) {
        return await masterSock.get('/user/wallet', args);
    }
    @get('/repeat/qr_pay/order')
    async repeatPayOrder(args) {
        return await masterSock.get('/repeat/qr_pay/order', args);
    }
}