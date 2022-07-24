
import React from 'react';
import { EventsComponent } from 'rich/component/lib/events.component';
import { Loading } from 'rich/component/view/loading';
import { PopoverSingleton } from 'rich/extensions/popover/popover';
import { channel } from 'rich/net/channel';
import "./style.less";
export class PayView extends EventsComponent {
    async predictCreateOrder() {
        this.loading = false;
        this.forceUpdate();
        var r = await channel.put('/create/qr_pay/order', {
            ...this.orderInfo
        });
        if (r.ok) {
            this.orderInfo.id = r.data.orderId;
        }
        else delete this.orderInfo.id;
        this.loading = true;
        this.forceUpdate()
    }
    orderInfo: {
        id?: string,
        kind: 'fill',
        subject: string,
        body: string,
        price: number,
        count: number,
        amount: number,
    }
    loading: boolean = false;
    async open(orderInfo: {
        kind: 'fill',
        subject: string,
        body: string,
        price: number,
        count: number,
        amount: number,
    }) {
        this.orderInfo = orderInfo;
        await this.predictCreateOrder();
    }
    notifyOrder = (order) => {
        console.log('notify', order);
        this.emit('close');
    }
    componentDidMount(): void {
        channel.sync('/user/order/notify', this.notifyOrder)
    }
    componentWillUnmount(): void {
        channel.off('/user/order/notify', this.notifyOrder);
    }
    render() {
        if (!this.orderInfo?.id) return <div className="shy-pay-view"></div>
        var size = 120;
        var orderUrl = `https://pay.shy.live/pay/qr?orderId=${this.orderInfo.id}`;
        var payUrl = `https://pay.shy.live/static/order?size=${size}&url=${encodeURIComponent(orderUrl)}`
        return <div className="shy-pay-view">
            <div className='shy-pay-view-head'>
                <span>微信、支付宝扫码支付<em>{this.orderInfo.amount * this.orderInfo.count}元</em></span>
            </div>
            {this.loading && <Loading></Loading>}
            {this.orderInfo.id && !this.loading && <iframe style={{ width: size + 10, height: size + 10, border: 0 }} src={payUrl}></iframe>}
        </div>
    }
}


export async function usePayOrder(order: PayView['orderInfo']) {
    let popover = await PopoverSingleton(PayView, { mask: true });
    let fv = await popover.open({ center: true });
    fv.open(order);
    return new Promise((resolve, reject) => {
        fv.only('close', () => {
            popover.close();
            resolve(true);
        });
        popover.only('close', () => {
            resolve(true);
        });
    })
}
