
import React from "react";
import { Button } from "rich/component/view/button";
import { Col, Row } from "rich/component/view/grid";
import "./style.less";

export class SaveTip extends React.Component<{
    save: (event: React.MouseEvent) => void,
    reset: (event: React.MouseEvent) => void
}> {
    visible: boolean = false;
    open() {
        this.visible = true;
        this.forceUpdate();
    }
    close() {
        this.visible = false;
        this.forceUpdate()
    }
    save(e) {
        this.props.save(e)
    }
    reset(e) {
        this.props.reset(e);
    }
    render() {
        if (this.visible == false) return <></>
        return <div className="shy-save-tip">
            <Row style={{ marginBottom: 0 }}>
                <Col span={12}><span>注意！您尚未保存更改！</span></Col>
                <Col span={12} align={'end'}><Button onClick={e => this.reset(e)}
                    link style={{ marginRight: 10 }}>重置</Button>
                    <Button onClick={e => this.save(e)}>保存变更</Button>
                </Col>
            </Row>
        </div>
    }
}