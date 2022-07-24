import React from "react";
import { Divider, Row } from "rich/component/view/grid";
export class ShyPayList extends React.Component {
    render() {
        return <div className="shy-pay-list">
            <h2>支付记录</h2>
            <Divider></Divider>
            <Row style={{ marginTop: 20 }}>

            </Row>
        </div>
    }
}