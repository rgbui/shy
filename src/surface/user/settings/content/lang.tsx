import React from "react";
import { Col, Divider, Row } from "rich/component/view/grid";
import { Select } from "rich/component/view/select";
import { Remark } from "rich/component/view/text";

export class ShyAppLang extends React.Component {
    render() {
        return <div className="shy-app-lang">
            <h3>语言</h3>
            <Divider></Divider>
            <Row>
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