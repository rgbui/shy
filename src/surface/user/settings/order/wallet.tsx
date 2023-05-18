

import dayjs from "dayjs";
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Button } from "rich/component/view/button";
import { Divider, Row, Space } from "rich/component/view/grid";
import { channel } from "rich/net/channel";
import { useSelectPayView } from "../../../../component/pay/select";
import "./style.less";
import Big from 'big.js';
import { Price } from "../../../../util/price";
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
    wallet: { money: number, isDue: boolean, meal: string, due: Date } = { isDue: false, money: 0, meal: '', due: null }
    render() {
        var self = this;
        async function openPay(kind: "fill" | "meal-1" | "meal-2") {
            var g = await useSelectPayView(kind);
            if (g) {
                self.load();
            }
        }
        function getMeal() {
            if (self.wallet.meal == 'meal-1') {
                return '团队版';
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
            <Row style={{ marginTop: 20 }}>
                <Space >
                    <span>余额:{Price.toFixed(this.wallet.money)}元</span>
                    <Button link onClick={e => openPay('fill')}>充值</Button>
                    <Button style={{ visibility: 'hidden' }} link disabled>兑换码</Button>
                </Space>
            </Row>
            <Row style={{ marginTop: 20 }}>
                <Space >
                    <span>套餐:<em>{getMeal()}</em> {this.wallet.due && (this.wallet.meal == 'meal' || this.wallet.meal == 'meal-1' || this.wallet.meal == 'meal-2') && <i>{dayjs(this.wallet.due).format('YYYY.MM.DD')}到期</i>}</span>
                    <Button link onClick={e => openPay('meal-2')}>开通套餐</Button>
                </Space>
            </Row>
        </div>
    }
}