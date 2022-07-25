
import React from "react";
import { Button } from "rich/component/view/button";
import { Divider, Row } from "rich/component/view/grid";
import { usePayOrder } from "../../../../component/pay";
export class ShyWallet extends React.Component {
    render() {
        async function openPay() {
            await usePayOrder({
                kind: 'fill',
                subject: '充值',
                body: '测试充值',
                price: 0.01,
                count: 1,
                amount: 0.01
            })
        }
        return <div className="shy-app-lang">
            <h2>账户钱包</h2>
            <Divider></Divider>
            <Row style={{ marginTop: 20 }}>
                <span>余额:00.0</span><Button onClick={e => openPay()}>充值</Button>
            </Row>
        </div>
    }
}