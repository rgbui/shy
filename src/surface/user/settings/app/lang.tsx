import React from "react";
import { Col, Divider, Row } from "rich/component/view/grid";
import { Select } from "rich/component/view/select";
import { Remark } from "rich/component/view/text";

export class ShyAppLang extends React.Component {
    render() {
        return <div className="shy-app-lang">
            <h2 className="h2">语言</h2>
            <Divider></Divider>
            <Row style={{ marginTop: 20 }}>
                <Col span={12}><Remark>选择语言</Remark></Col>
                <Col span={12} align={'end'}><Select
                    dropStyle={{ width: 80 }}
                    dropAlign="right"
                    value={'zh'}
                    options={[{ text: '中文', value: 'zh' }]}
                ></Select></Col>
            </Row>
        </div>
    }
}