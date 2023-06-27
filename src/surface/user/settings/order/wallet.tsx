

import dayjs from "dayjs";
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Button } from "rich/component/view/button";
import { Divider, } from "rich/component/view/grid";
import { channel } from "rich/net/channel";
import { useSelectPayView } from "../../../../component/pay/select";
import { Price } from "../../../../util/price";
import { useForm } from "rich/component/view/form/dialoug";
import { masterSock } from "../../../../../net/sock";
import { ShyAlert } from "rich/component/lib/alert";
import "./style.less";

@observer
export class ShyWallet extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            wallet: observable
        })
    }
    componentDidMount() {
        this.load()
    }
    async load() {
        var r = await channel.get('/user/wallet');
        if (r?.ok) {
            this.wallet = r.data as any;
        }
    }
    async coupon(e: React.MouseEvent) {
        var g = await useForm({
            title: '兑换券',
            remark: '请注意，兑换码只能兑换一次',
            fields: [
                { name: "code", text: '兑换码', type: 'input' }
            ],
            maskCloseNotSave: true
        });
        if (g?.code) {
            var c = await masterSock.post('/user/coupon', { code: g.code });
            if (c?.ok) {
                if (c.data.success)
                    this.load();
                else ShyAlert('兑换券已过期');
            }
            else ShyAlert('兑换券不存在');
        }
    }
    wallet: { money: number, isDue: boolean, meal: string, due: Date } = { isDue: false, money: 0, meal: '', due: null }
    render() {
        var self = this;
        async function openPay(kind: "fill" | "meal" | "meal-1" | "meal-2") {
            var g = await useSelectPayView(kind);
            if (g) {
                self.load();
            }
        }
        function getMeal() {
            if (self.wallet.meal == 'meal-1') {
                return '个人专业版';
            }
            else if (self.wallet.meal == 'meal-2') {
                return '社区版';
            }
            else if (self.wallet.meal == 'meal') {
                return '云端版'
            }
            else return '无'
        }
        return <div className="shy-app-lang">
            <h2 className="h2">账户钱包</h2>
            <Divider></Divider>
            <div className="gap-h-20">
                <div className="h4">余额</div>
                <div className="flex flex-top gap-h-20 r-gap-r-10">
                    <span className="f-16 flex-fixed">{Price.toFixed(this.wallet.money)}元</span>
                    <span className="flex-auto flex-end r-gap-l-10"><Button onClick={e => openPay('fill')}>充值</Button>
                        <Button ghost onClick={e => this.coupon(e)}>兑换码</Button></span>
                </div>
                <Divider></Divider>
            </div>
            <div className="gap-h-20">
                <div className="h4">套餐</div>
                <div className="flex flex-top gap-h-20 r-gap-r-10">
                    <span className="f-16 flex-fixed"><em>{getMeal()}</em> {this.wallet.due && (this.wallet.meal == 'meal' || this.wallet.meal == 'meal-1' || this.wallet.meal == 'meal-2') && <i className="text-1">[{dayjs(this.wallet.due).format('YYYY.MM.DD')}到期]</i>}</span>
                    <span className="flex-auto flex-end r-gap-l-10">{this.wallet.meal != 'meal-2' && <Button ghost onClick={e => openPay('meal-1')}>个人专业版</Button>}
                        <Button ghost onClick={e => openPay('meal-2')}>社区版</Button></span>
                </div>  <Divider></Divider>
            </div>

        </div>
    }
}