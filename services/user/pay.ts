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

    @del('/open/weixin/unbind')
    async openWeixinUnbind(args) {
        return await masterSock.delete('/open/weixin/unbind', args);
    }
    @get('/open/list')
    async openList(args) {
        return await masterSock.get('/open/list', args);
    }
    @put('/open/weixin/bind')
    async WeixinBind(args) {
        return await masterSock.put('/open/weixin/bind', args);
    }
    @put('/open/sign')
    async WeixinOpenSign(args) {
        return await masterSock.put('/open/sign', args);
    }
    @get('/check/feature')
    async checkFeature(args) {
        return await masterSock.get('/check/feature', args);
    }
}