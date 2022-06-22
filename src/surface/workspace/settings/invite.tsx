import { observer } from "mobx-react";
import React from "react";
import { Button } from "rich/component/view/button";
import { Row, Col, Divider } from "rich/component/view/grid";
import { Input } from "rich/component/view/input";
import { Remark } from "rich/component/view/text";
import { surface } from "../..";

@observer
export class WorkspaceInvite extends React.Component {
    async createInvite(force?: boolean) {
        await surface.workspace.onCreateInvite(true, force);
        if (this.input) this.input.updateValue(surface.workspace.getInviteUrl());
    }
    input: Input;
    render() {
        return <div className='shy-ws-invites'>
            <h2>邀请</h2>
            <Divider></Divider>
            <h3 style={{ fontSize: 14 }}>通用的邀请链接</h3>
            <Row>
                <Remark>任何得到此链接的人均可以加入这个空间(空间没有人数上限的限制)，你也可以<a onMouseDown={e => this.createInvite(true)}>重置链接</a></Remark>
            </Row>
            <Row>
                <Col span={16}><Input ref={e => this.input = e}
                    readonly={true} value={surface.workspace.invite ? location.protocol + '//' + location.host + '/invite/' + surface.workspace.invite : ''}></Input></Col>
                <Col align='start' span={8}><Button size={'larger'} style={{ marginLeft: 20 }}
                    onClick={e => this.createInvite()}
                    ghost>{surface.workspace.invite ? '复制链接' : '创建链接'}</Button></Col>
            </Row>
        </div>
    }
}