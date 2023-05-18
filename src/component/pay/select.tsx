import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Button } from "rich/component/view/button";
import { Col, Row } from "rich/component/view/grid";
import { Icon } from "rich/component/view/icon";
import { Input } from "rich/component/view/input";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import { CheckBox } from "rich/component/view/checkbox/index";
import { AlipaySvg, WeixinPaySvg } from "../svgs";
import "./style.less";
import { SelectBox } from "rich/component/view/select/box";
import { usePayOrder } from ".";
import { ShyAlert } from "rich/component/lib/alert";
import { channel } from "rich/net/channel";

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
    loading: boolean = false;
    checkAgree: boolean = false;
    constructor(props) {
        super(props)
    }
    async open(kind: 'fill' | 'meal-1' | 'meal-2') {
        this.orderInfo.kind = kind;
        this.orderInfo.platform = 'weixin';
        this.orderInfo.price = 100;
        this.orderInfo.count = 1;
        await this.loadUserWallert();
        this.forceUpdate()
    }
    wallet: { money: number, isDue: boolean, meal: string, due: Date } = { money: 0, isDue: false, meal: '', due: null }
    async loadUserWallert() {
        var r = await channel.get('/user/wallet');
        if (r?.ok) {
            this.wallet = r.data as any;
        }
    }
    getLowerPay() {
        var basePrice = 60;
        if (this.wallet.meal == 'meal' && this.wallet.isDue !== true) {
            basePrice = 0;
        }
        var g = 20 - (this.wallet.money || 0);
        var willPay = basePrice + g;
        return willPay > 10 ? willPay : 10;
    }
    async openPay(event: React.MouseEvent) {
        if (this.checkAgree == false) {
            return ShyAlert('请同意诗云服务协议', 'warn')
        }
        if (this.orderInfo.kind == 'fill' && this.orderInfo.price < this.getLowerPay()) {
            return ShyAlert('充值的金额不能小于' + this.getLowerPay() + "元", 'warn')
        }
        var count = this.orderInfo.kind == 'fill' ? 1 : this.orderInfo.count;
        var subject = '';
        if (this.orderInfo.kind == 'fill') subject = '诗云付费充值￥' + this.orderInfo.price;
        else if (this.orderInfo.kind == 'meal-1') subject = '诗云空间团队版';
        else if (this.orderInfo.kind == 'meal-2') subject = '诗云空间无限流量版';
        if (this.orderInfo.kind != 'fill' && this.orderInfo.count > 1) {
            subject + this.orderInfo.count + '年'
        }
        var price = this.orderInfo.price;
        if (this.orderInfo.kind == 'meal-1') {
            price = 199;
        }
        else if (this.orderInfo.kind == 'meal-2') {
            price = 360
        }
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
        var isFill = ['meal', 'meal-1', 'meal-2'].includes(this.wallet.meal) ? true : false;
        return <div className="shy-pay-selector">
            <div className="h3 gap-h-10">购买支付</div>
            <div className="shy-pay-items flex-top">

                {!isFill && <div onMouseDown={e => { this.orderInfo.kind = 'fill'; this.forceUpdate() }} className={"shy-pay-item" + (this.orderInfo.kind == 'fill' ? " hover" : "")}>
                    <h4>云端版</h4>
                    <div>软件服务 60<span className="del f-12">100</span>元/年</div>
                    <div>按量付费,适用于知识管理</div>
                </div>}

                {isFill && <div onMouseDown={e => { this.orderInfo.kind = 'fill'; this.forceUpdate() }} className={"shy-pay-item" + (this.orderInfo.kind == 'fill' ? " hover" : "")}>
                    <h4>充值</h4>
                    <div>按量付费</div>
                </div>}

                <div onMouseDown={e => { this.orderInfo.kind = 'meal-1'; this.forceUpdate() }} className={"shy-pay-item" + (this.orderInfo.kind == 'meal-1' ? " hover" : "")}>
                    <h4>团队版</h4>
                    <div>199元/年</div>
                    <div>适用于小团体</div>
                </div>
                <div onMouseDown={e => { this.orderInfo.kind = 'meal-2'; this.forceUpdate() }} className={"shy-pay-item" + (this.orderInfo.kind == 'meal-2' ? " hover" : "")}>
                    <h4>社区版</h4>
                    <div>360<span className="del f-12">480</span>元/年</div>
                    <div>适用于开放式社区空间</div>
                </div>
            </div>
            <h3>支付方式</h3>
            <div className="shy-pay-platform">
                <a onMouseDown={e => { this.orderInfo.platform = 'weixin'; this.forceUpdate() }} className={this.orderInfo.platform == 'weixin' ? "hover" : ""}><Icon icon={WeixinPaySvg}></Icon><span style={{ display: 'inline-block', marginLeft: 5 }}>微信</span></a>
                <a onMouseDown={e => { this.orderInfo.platform = 'alipay'; this.forceUpdate() }} className={this.orderInfo.platform == 'alipay' ? "hover" : ""}><Icon size={30} icon={AlipaySvg}></Icon><span>支付宝</span></a>
            </div>
            <h3>支付金额</h3>
            <div className="shy-pay-money-item">
                <Row valign="middle">
                    <Col span={12}>
                        {this.orderInfo.kind == 'fill' && <div className="shy-pay-money"><span>充值&nbsp;</span><Input size={'default'} value={this.orderInfo.price.toString()} onChange={e => { var v = parseFloat(e); !(!isNaN(v) && v >= 1 && v <= 5000) ? undefined : this.orderInfo.price = v; this.forceUpdate() }}></Input><em>&nbsp;￥</em></div>}
                        {this.orderInfo.kind != 'fill' && <span style={{ fontSize: '24px' }}>{this.orderInfo.kind == 'meal-1' ? "￥199" : "￥360"}</span>}
                    </Col>
                    <Col span={12} align={'end'}>
                        {this.orderInfo.kind != 'fill' && <SelectBox value={this.orderInfo.count} options={[
                            { text: '1年', value: 1 },
                            { text: '2年', value: 2 },
                            { text: '3年', value: 3 },
                            { text: '4年', value: 4 },
                            { text: '5年', value: 5 }
                        ]} onChange={e => { this.orderInfo.count = e; this.forceUpdate(); }}></SelectBox>}
                        {this.orderInfo.kind == 'fill' && <div className="remark">
                            最低支付{this.getLowerPay()}元
                        </div>}
                    </Col>
                </Row>
            </div>
            <div className="shy-pay-buttons">
                <div className="gap-h-10">
                    <CheckBox checked={this.checkAgree} onChange={e => { this.checkAgree = e; this.forceUpdate() }} >同意《<a href='https://shy.live/service_protocol' target='_blank'>诗云用户协议</a>》</CheckBox>
                </div>
                <Row>
                    <Col span={12}><Button size='larger' style={{ marginRight: 3 }} block onClick={e => this.onClose()} ghost>取消</Button></Col>
                    <Col span={12}><Button size='larger' style={{ marginLeft: 3 }} block onClick={e => this.openPay(e)}>支付&nbsp;￥{this.orderInfo.kind == 'fill' ? this.orderInfo.price : (this.orderInfo.kind == 'meal-1' ? 199 : 360) * this.orderInfo.count}</Button></Col>
                </Row>
            </div>
        </div>
    }
}


export async function useSelectPayView(kind: 'fill' | 'meal-1' | 'meal-2') {
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