import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Button } from "rich/component/view/button";
import { Icon } from "rich/component/view/icon";
import { CheckBox } from "rich/component/view/checkbox/index";
import { AlipaySvg, WeixinPaySvg } from "../svgs";
import "./style.less";
import { usePayOrder } from ".";
import { ShyAlert } from "rich/component/lib/alert";
import { SelectBox } from "rich/component/view/select/box";
import { Price } from "../../util/price";
import { lst } from "rich/i18n/store";
import { S, Sp } from "rich/i18n/view";
import { surface } from "../../surface/app/store";
import { PopoverSingleton } from "rich/component/popover/popover";
import { Avatar } from "rich/component/view/avator/face";
import { ShyOrderInfo } from './declare'

export const MEAL_1_PRICE = 99;
export const MEAL_2_PRICE = 298;
export const MEAL_FOREVER_PRICE = 498;
export class SelectPayView extends EventsComponent {
    orderInfo: ShyOrderInfo = {
        kind: 'fill',
        subject: '',
        body: '',
        price: 100,
        count: 1,
        rate: 1,
        free: 0,
        amount: 0,
        platform: 'weixin'
    } as any;
    allowKind: boolean = false;
    loading: boolean = false;
    checkAgree: boolean = true;
    constructor(props) {
        super(props)
    }
    async open(kind: 'fill' | 'meal' | 'meal-1' | 'meal-2') {

        if (kind == 'meal') { this.allowKind = true }
        else this.allowKind = false;
        if (kind == 'meal') this.orderInfo.kind = kind == 'meal' ? 'meal-1' : 'meal-2';
        else this.orderInfo.kind = kind;

        this.orderInfo.platform = 'weixin';
        this.orderInfo.price = 100;
        this.orderInfo.rate = 1;
        this.orderInfo.free = 0;
        if (kind == 'meal-1') this.orderInfo.price = MEAL_1_PRICE;
        else if (kind == 'meal-2') this.orderInfo.price = MEAL_2_PRICE;
        this.orderInfo.count = 1;
        this.forceUpdate()
    }

    async pay(event: React.MouseEvent) {
        if (this.checkAgree == false) {
            return ShyAlert(lst('请同意诗云付费协议'), 'warn')
        }
        if (this.orderInfo.kind == 'fill') {
            var w = await surface.user.wallet();
            var low = 99;
            if (w.meal == 'meal-1' || w.meal == 'meal-2') {
                low = 10;
            }
            if (this.orderInfo.price < low) {
                return ShyAlert(lst('最低充') + low + lst('元'), 'warn')
            }
        }
        var count = this.orderInfo.kind == 'fill' ? 1 : this.orderInfo.count;
        var subject = '';
        if (this.orderInfo.kind == 'fill') subject = lst('诗云付费充值￥') + this.orderInfo.price;
        else if (this.orderInfo.kind == 'meal-1') subject = lst('个人版');
        else if (this.orderInfo.kind == 'meal-2') subject = lst('协作版');
        if (this.orderInfo.kind != 'fill' && this.orderInfo.count > 1) {
            subject + this.orderInfo.count + lst('年')
        }
        var price = this.orderInfo.price;
        price = Price.toFixed(price);
        var amount = Price.sub(Price.mul(Price.mul(price, count), this.orderInfo.rate), this.orderInfo.free);
        amount = Price.toFixed(amount);
        var r = await usePayOrder({
            kind: this.orderInfo.kind,
            subject: subject,
            body: '',
            free: this.orderInfo.free,
            rate: this.orderInfo.rate,
            count: count,
            price: price,
            platform: this.orderInfo.platform,
            amount: amount
        });
        if (r) {
            this.emit('save')
        }
    }
    onClose() {
        this.emit('close');
    }
    render() {
        var text = lst('充值付费');
        if (this.orderInfo.kind == 'meal-1') text = lst('个人版');
        else if (this.orderInfo.kind == 'meal-2') text = lst('协作版');
        return <div className="shy-pay-selector">
            <div className="flex border-bottom padding-w-20 gap-b-5 padding-h-5 "><span><Avatar size={32} middle showName userid={surface.user?.id}></Avatar></span></div>
            <div className="h3 gap-h-10 gap-w-20 ">{text}</div>
            <div className="shy-pay-items flex-top  gap-w-20">
                {this.orderInfo.kind == 'fill' && <div className="r-padding-h-5  round l-20">
                    <div><S>按量付费，用多少付多少</S></div>
                </div>}
                {this.orderInfo.kind == 'meal-1' && <div className="r-padding-h-5  round l-20">
                    <div><S>适用于云端知识工作者</S></div>
                </div>}
                {this.orderInfo.kind == 'meal-2' && <div className="r-padding-h-5  round l-20">
                    <div><S>适用于多人协作，经营服务，价值变现</S></div>
                </div>}
            </div>
            <h3 className=" gap-w-20"><S>支付方式</S></h3>
            <div className="shy-pay-platform gap-w-20">
                <a onMouseDown={e => { this.orderInfo.platform = 'weixin'; this.forceUpdate() }} className={this.orderInfo.platform == 'weixin' ? "hover" : ""}><Icon icon={WeixinPaySvg}></Icon><span style={{ display: 'inline-block', marginLeft: 5 }}><S>微信</S></span></a>
                <a onMouseDown={e => { this.orderInfo.platform = 'alipay'; this.forceUpdate() }} className={this.orderInfo.platform == 'alipay' ? "hover" : ""}><Icon size={30} icon={AlipaySvg}></Icon><span><S>支付宝</S></span></a>
            </div>
            <h3 className="gap-w-20"><S>支付金额</S></h3>
            {this.orderInfo.kind == 'fill' && <div className="flex r-gap-r-10 gap-w-20 gap-h-10">

                <Button onMouseDown={e => { this.orderInfo.price = 100; this.orderInfo.rate = 1; this.forceUpdate() }} ghost={this.orderInfo.price == 100 ? false : true}>￥100</Button>
                <Button onMouseDown={e => { this.orderInfo.price = 200; this.orderInfo.rate = 1; this.forceUpdate() }} ghost={this.orderInfo.price == 200 ? false : true}>￥200</Button>
                <Button onMouseDown={e => { this.orderInfo.price = 300; this.orderInfo.rate = 0.97; this.forceUpdate() }} ghost={this.orderInfo.price == 300 ? false : true}>￥300<span className="f-12 gap-l-5">省3%</span></Button>
                <Button onMouseDown={e => { this.orderInfo.price = 500; this.orderInfo.rate = 0.95; this.forceUpdate() }} ghost={this.orderInfo.price == 500 ? false : true}>￥500<span className="f-12 gap-l-5">省5%</span></Button>
                <Button onMouseDown={e => { this.orderInfo.price = 1000; this.orderInfo.rate = 0.9; this.forceUpdate() }} ghost={this.orderInfo.price == 1000 ? false : true}>￥1000<span className="f-12 gap-l-5">省10%</span></Button>

            </div>}
            {this.orderInfo.kind != 'fill' && <div className="flex  gap-w-20 gap-h-10">
                <span style={{ fontSize: 20 }}>￥{this.orderInfo.kind == 'meal-1' ? MEAL_1_PRICE : MEAL_2_PRICE}/年</span>
                <span className="remark del gap-w-20">￥{this.orderInfo.kind == 'meal-1' ? '180' : "480"}/年</span>
                <SelectBox border value={this.orderInfo.count} options={[
                    { text: '1' + lst('年'), value: 1 },
                    { text: '2' + lst('年'), remark: '5%优惠', value: 2 },
                    { text: '3' + lst('年'), remark: '15%优惠', value: 3 }
                ]} onChange={e => {
                    this.orderInfo.count = e;
                    if (e == 1) this.orderInfo.rate = 1;
                    else if (e == 2) this.orderInfo.rate = 0.95;
                    else if (e == 3) this.orderInfo.rate = 0.85;
                    this.forceUpdate();
                }}></SelectBox>
            </div>}

            <div className="flex padding-h-10 gap-w-20">
                <CheckBox checked={this.checkAgree} onChange={e => { this.checkAgree = e; this.forceUpdate() }} ><Sp text='同意诗云付费协议'>同意《<a className="text-1 underline" href={'https://help.shy.live/page/2277'} target='_blank'>诗云 shy.live 付费产品订阅协议</a>》</Sp></CheckBox>
            </div>

            <div className="shy-pay-buttons gap-w-20 gap-h-30">
                <Button block size='larger' style={{ fontSize: 24 }} disabled={this.checkAgree ? false : true} onClick={e => this.pay(e)}><S>支付</S>￥{Price.toFixed(Price.sub(Price.mul(Price.mul(this.orderInfo.price, this.orderInfo.count), this.orderInfo.rate), this.orderInfo.free))}</Button>
            </div>

        </div>
    }
}


export async function useSelectPayView(kind: 'fill' | 'meal' | 'meal-1' | 'meal-2') {
    let popover = await PopoverSingleton(SelectPayView, { mask: true, shadow: true });
    let fv = await popover.open({ center: true });
    fv.open(kind);
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