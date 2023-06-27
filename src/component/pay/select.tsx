import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Button } from "rich/component/view/button";
import { Icon } from "rich/component/view/icon";
import { Input } from "rich/component/view/input";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import { CheckBox } from "rich/component/view/checkbox/index";
import { AlipaySvg, WeixinPaySvg } from "../svgs";
import "./style.less";
import { usePayOrder } from ".";
import { ShyAlert } from "rich/component/lib/alert";
import { SelectBox } from "rich/component/view/select/box";
import { Price } from "../../util/price";

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
        if (kind == 'meal-1') this.orderInfo.price = 160;
        else if (kind == 'meal-2') this.orderInfo.price = 800;
        this.orderInfo.count = 1;
        this.forceUpdate()
    }

    async pay(event: React.MouseEvent) {
        if (this.checkAgree == false) {
            return ShyAlert('请同意诗云服务协议', 'warn')
        }
        if (this.orderInfo.kind == 'fill') {
            if (this.orderInfo.price < 99) {
                return ShyAlert('最低充99元', 'warn')
            }
        }
        var count = this.orderInfo.kind == 'fill' ? 1 : this.orderInfo.count;
        var subject = '';
        if (this.orderInfo.kind == 'fill') subject = '诗云付费充值￥' + this.orderInfo.price;
        else if (this.orderInfo.kind == 'meal-1') subject = '诗云个人专业版';
        else if (this.orderInfo.kind == 'meal-2') subject = '诗云社区版';
        if (this.orderInfo.kind != 'fill' && this.orderInfo.count > 1) {
            subject + this.orderInfo.count + '年'
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
        var text = '充值付费';
        if (this.orderInfo.kind == 'meal-1') text = '支付个人专业版';
        else if (this.orderInfo.kind == 'meal-2') text = '支付社区版';
        return <div className="shy-pay-selector">
            <div className="h3 gap-h-10">{text}</div>
            <div className="shy-pay-items flex-top">
                {this.orderInfo.kind == 'fill' && <div className="r-padding-h-5  round l-20">
                    <div>按量付费，适用于轻度知识工作者</div>
                    {/* <div>不限空间、不限人数、不限功能、按量付费</div>
                    <div>价格低廉，按需付费，充一次用很久</div> */}
                </div>}
                {this.orderInfo.kind == 'meal-1' && <div className="r-padding-h-5  round l-20">
                    <div>适用于中度知识工作者及小群体</div>
                    {/* <div>不限空间、不限人数、不限功能、超出按量付费</div>
                    <div>支持自定义二级域名</div> */}
                </div>}
                {this.orderInfo.kind == 'meal-2' && <div className="r-padding-h-5  round l-20">
                    <div>适用于开放性的社区群体</div>
                    {/* <div>不限空间、不限人数、不限功能、超出按量付费</div>
                    <div>支持商业独立运营</div> */}
                </div>}
            </div>
            <h3>支付方式</h3>
            <div className="shy-pay-platform">
                <a onMouseDown={e => { this.orderInfo.platform = 'weixin'; this.forceUpdate() }} className={this.orderInfo.platform == 'weixin' ? "hover" : ""}><Icon icon={WeixinPaySvg}></Icon><span style={{ display: 'inline-block', marginLeft: 5 }}>微信</span></a>
                <a onMouseDown={e => { this.orderInfo.platform = 'alipay'; this.forceUpdate() }} className={this.orderInfo.platform == 'alipay' ? "hover" : ""}><Icon size={30} icon={AlipaySvg}></Icon><span>支付宝</span></a>
            </div>
            <h3>支付金额</h3>
            <div className="flex">
                <div className="flex-fixed">
                    {this.orderInfo.kind == 'fill' && <div className="shy-pay-money"><span>充值&nbsp;</span><Input size={'default'} value={this.orderInfo.price.toString()} onChange={e => { var v = parseFloat(e); !(!isNaN(v) && v >= 1 && v <= 5000) ? undefined : this.orderInfo.price = v; this.forceUpdate() }}></Input><em>&nbsp;￥</em></div>}
                    {this.orderInfo.kind != 'fill' && <span style={{ fontSize: '24px' }}>{this.orderInfo.kind == 'meal-1' ? "￥180" : "￥800"}</span>}
                </div>
                <div className="flex-auto flex-end">
                    {this.orderInfo.kind == 'fill' && <span className="remark">最低充99元</span>}
                    {this.orderInfo.kind != 'fill' && <SelectBox value={this.orderInfo.count} options={[
                        { text: '1年', value: 1 },
                        { text: '2年', value: 2 },
                        { text: '3年', value: 3 },
                        { text: '4年', value: 4 },
                        { text: '5年', value: 5 }
                    ]} onChange={e => { this.orderInfo.count = e; this.forceUpdate(); }}></SelectBox>}
                </div>
            </div>
            <div className="flex gap-h-10">
                <CheckBox checked={this.checkAgree} onChange={e => { this.checkAgree = e; this.forceUpdate() }} >同意《<a className="text-1 underline" href='https://shy.live/service_protocol' target='_blank'>诗云用户协议</a>》</CheckBox>
            </div>
            <div className="shy-pay-buttons">
                <div className="flex-end r-gap-r-10">
                    <Button size='larger' style={{ width: 180 }} onClick={e => this.onClose()} ghost>取消</Button>
                    <Button size='larger' style={{ width: 180 }} onClick={e => this.pay(e)}>支付</Button>
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