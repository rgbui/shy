import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Button } from "rich/component/view/button";
import { Icon } from "rich/component/view/icon";
import { Input } from "rich/component/view/input";
import { CheckBox } from "rich/component/view/checkbox/index";
import { AlipaySvg, WeixinPaySvg } from "../svgs";
import "./style.less";
import { usePayOrder } from ".";
import { ShyAlert } from "rich/component/lib/alert";
import { SelectBox } from "rich/component/view/select/box";
import { Price } from "../../util/price";
import { lst } from "rich/i18n/store";
import { S, Sp } from "rich/i18n/view";
import { UrlRoute } from "../../history";
import { surface } from "../../surface/app/store";
import { PopoverSingleton } from "rich/component/popover/popover";

export const MEAL_1_PRICE = 99;
export const MEAL_2_PRICE = 300;
export class SelectPayView extends EventsComponent {
    orderInfo: {
        kind: 'fill' | 'meal-1' | 'meal-2',
        subject: string,
        body: string,
        price: number,
        count: number,
        amount: number,
        platform: 'alipay' | 'weixin'
    } = {} as any;
    allowKind: boolean = false;
    loading: boolean = false;
    checkAgree: boolean = false;
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
        if (kind == 'meal-1') this.orderInfo.price = MEAL_1_PRICE;
        else if (kind == 'meal-2') this.orderInfo.price = MEAL_2_PRICE;
        this.orderInfo.count = 1;
        this.forceUpdate()
    }

    async pay(event: React.MouseEvent) {
        if (this.checkAgree == false) {
            return ShyAlert(lst('请同意诗云服务协议'), 'warn')
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
        else if (this.orderInfo.kind == 'meal-1') subject = lst('诗云专业版');
        else if (this.orderInfo.kind == 'meal-2') subject = lst('诗云社区版');
        if (this.orderInfo.kind != 'fill' && this.orderInfo.count > 1) {
            subject + this.orderInfo.count + lst('年')
        }
        var price = this.orderInfo.price;
        price = Price.toFixed(price);
        var r = await usePayOrder({
            kind: this.orderInfo.kind,
            subject: subject,
            body: '',
            count: count,
            price: price,
            platform: this.orderInfo.platform,
            amount: price * count
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
        if (this.orderInfo.kind == 'meal-1') text = lst('支付专业版');
        else if (this.orderInfo.kind == 'meal-2') text = lst('支付社区版');
        return <div className="shy-pay-selector">
            <div className="h3 gap-h-10">{text}</div>
            <div className="shy-pay-items flex-top">
                {this.orderInfo.kind == 'fill' && <div className="r-padding-h-5  round l-20">
                    <div><S text='按量付费适用于轻度知识工作者'>按量付费，适用于轻度知识工作者</S></div>
                </div>}
                {this.orderInfo.kind == 'meal-1' && <div className="r-padding-h-5  round l-20">
                    <div><S>适用于云端知识工作者</S></div>
                </div>}
                {this.orderInfo.kind == 'meal-2' && <div className="r-padding-h-5  round l-20">
                    <div><S>适用于多人协作，经营服务，价值变现</S></div>
                </div>}
            </div>
            <h3><S>支付方式</S></h3>
            <div className="shy-pay-platform">
                <a onMouseDown={e => { this.orderInfo.platform = 'weixin'; this.forceUpdate() }} className={this.orderInfo.platform == 'weixin' ? "hover" : ""}><Icon icon={WeixinPaySvg}></Icon><span style={{ display: 'inline-block', marginLeft: 5 }}><S>微信</S></span></a>
                <a onMouseDown={e => { this.orderInfo.platform = 'alipay'; this.forceUpdate() }} className={this.orderInfo.platform == 'alipay' ? "hover" : ""}><Icon size={30} icon={AlipaySvg}></Icon><span><S>支付宝</S></span></a>
            </div>
            <h3><S>支付金额</S></h3>
            <div className="flex">
                <div className="flex-fixed">
                    {this.orderInfo.kind == 'fill' && <div className="shy-pay-money"><span><S>充值</S>&nbsp;</span><Input
                        size={'default'}
                        value={this.orderInfo.price.toString()}
                        onChange={e => { var v = parseFloat(e); !(!isNaN(v) && v >= 1 && v <= 5000) ? undefined : this.orderInfo.price = v; this.forceUpdate() }}></Input><em>&nbsp;￥</em></div>}
                    {this.orderInfo.kind != 'fill' && <span style={{ fontSize: '24px' }}>{this.orderInfo.kind == 'meal-1' ? "￥" + MEAL_1_PRICE : "￥" + MEAL_2_PRICE}</span>}
                </div>
                <div className="flex-auto flex-end">
                    {this.orderInfo.kind == 'fill' && <span className="remark"><S>最低充</S>100<S>元</S></span>}
                    {this.orderInfo.kind != 'fill' && <SelectBox value={this.orderInfo.count} options={[
                        { text: '1' + lst('年'), value: 1 },
                        { text: '2' + lst('年'), value: 2 },
                        { text: '3' + lst('年'), value: 3 }
                    ]} onChange={e => { this.orderInfo.count = e; this.forceUpdate(); }}></SelectBox>}
                </div>
            </div>
            <div className="flex gap-h-10">
                <CheckBox checked={this.checkAgree} onChange={e => { this.checkAgree = e; this.forceUpdate() }} ><Sp text='同意诗云服务协议'>同意《<a className="text-1 underline" href={UrlRoute.getUrl() + '/service_protocol'} target='_blank'>诗云用户协议</a>》</Sp></CheckBox>
            </div>
            <div className="shy-pay-buttons">
                <div className="flex-end r-gap-r-10">
                    <Button size='larger' style={{ width: 180 }} onClick={e => this.onClose()} ghost><S>取消</S></Button>
                    <Button size='larger' style={{ width: 180 }} onClick={e => this.pay(e)}><S>支付</S></Button>
                </div>
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