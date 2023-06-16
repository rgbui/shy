
import lodash from 'lodash';
import React from 'react';
import { ShyAlert } from 'rich/component/lib/alert';
import { EventsComponent } from 'rich/component/lib/events.component';
import { Icon } from 'rich/component/view/icon';
import { PopoverSingleton } from 'rich/extensions/popover/popover';
import { channel } from 'rich/net/channel';
import { WeixinPaySvg, AlipaySvg } from '../svgs';
import "./style.less";
import { Spin } from 'rich/component/view/spin';

export class PayView extends EventsComponent {
    async predictCreateOrder() {
        this.loading = true;
        this.forceUpdate();
        if (this.orderInfo.orderId) {
            if (!this.orderInfo.platform) return;
            var r = await channel.get('/repeat/qr_pay/order', {
                orderId: this.orderInfo.orderId,
                platform: this.orderInfo.platform
            });
            if (r.ok) {
                this.orderInfo.id = r.data.orderId;
                this.orderInfo.orderId = this.orderInfo.id;
                this.code = r.data.code;
            }
            else delete this.orderInfo.id;
        }
        else {
            var r = await channel.put('/create/qr_pay/order', {
                ...this.orderInfo
            });
            if (r.ok) {
                this.orderInfo.id = r.data.orderId;
                this.orderInfo.orderId = this.orderInfo.id;
                this.code = r.data.code;
            }
            else delete this.orderInfo.id;
        }
        this.loading = false;
        this.forceUpdate()
    }
    code: string = '';
    orderInfo: {
        id?: string,
        orderId?: string,
        kind: 'fill' | 'meal-1' | 'meal-2',
        subject: string,
        body: string,
        price: number,
        count: number,
        amount: number,
        platform: string,
        sockId?: string,
    }
    loading: boolean = false;
    async open(orderInfo: {
        kind: 'fill' | 'meal-1' | 'meal-2',
        subject: string,
        body: string,
        price: number,
        count: number,
        amount: number,
        platform: string
    }) {
        this.orderInfo = lodash.cloneDeep(orderInfo);
        this.orderInfo.sockId = window.shyConfig.guid();
        await this.predictCreateOrder();
    }
    onMessage = (event: MessageEvent<any>) => {
        if (event.origin && event.origin.startsWith('https://pay.shy.live'))
            try {
                var data = JSON.parse(event.data);
                if (data?.data.orderId && data.data.orderId === this.orderInfo.orderId) {
                    ShyAlert('付款成功')
                    this.emit('save')
                }
            }
            catch (ex) {

            }
    }
    componentDidMount(): void {
        window.addEventListener('message', this.onMessage)
    }
    componentWillUnmount(): void {
        window.removeEventListener('message', this.onMessage)
    }
    openSetPlatform(platform: string) {
        this.orderInfo.platform = platform;
        this.predictCreateOrder();
    }
    render() {
        if (!this.orderInfo?.orderId) return <div className="shy-pay-view"></div>
        if (!this.orderInfo.platform) return <div className='shy-pay-view'>
            <div className='h3'>选择支付方式</div>
            <div className='flex'>
                <a onMouseDown={e => { this.openSetPlatform('weixin') }} className={'flex-inline  flex-center gap-r-20 cursor'}><Icon icon={WeixinPaySvg}></Icon><span className='inline-block gap-l-5 text'>微信</span></a>
                <a onMouseDown={e => { this.openSetPlatform('alipay') }} className={'flex-inline flex-center cursor'}><Icon size={30} icon={AlipaySvg}></Icon><span className='text'>支付宝</span></a>
            </div>
        </div>
        var size = 240;
        var payUrl = `https://pay.shy.live/static/qr.html?size=${size}&url=${encodeURIComponent(this.code)}&sockId=${this.orderInfo.sockId}`
        return <div className="shy-pay-view">
            <div className='shy-pay-view-head'>
                <span>{this.orderInfo.platform == 'weixin' ? "微信" : "支付宝"}扫码支付<em>{this.orderInfo.amount * this.orderInfo.count}元</em></span>
            </div>
            {this.loading && <Spin block></Spin>}
            {this.orderInfo.id && !this.loading && <iframe style={{ width: size, height: size, border: 0 }} src={payUrl}></iframe>}
        </div>
    }
}

export async function usePayOrder(order: PayView['orderInfo']) {
    let popover = await PopoverSingleton(PayView, { mask: true, shadow: true });
    let fv = await popover.open({ center: true, centerTop: 100 });
    fv.open(order);
    return new Promise((resolve, reject) => {
        fv.only('close', () => {
            popover.close();
            resolve(null);
        });
        fv.only('save', () => {
            popover.close();
            resolve(true);
        })
        popover.only('close', () => {
            resolve(null);
        });
    })
}
