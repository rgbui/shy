import { observer } from "mobx-react";
import React from "react";
import { CopyText } from "rich/component/copy";
import { Button } from "rich/component/view/button";
import { Row, Col, Divider } from "rich/component/view/grid";
import { Input } from "rich/component/view/input";
import { Remark } from "rich/component/view/text";
import { channel } from "rich/net/channel";
import { surface } from "../..";

@observer
export class WorkspaceInvite extends React.Component {
    async createInvite() {
        if (!surface.workspace.invite) {
            var r = await channel.put('/ws/invite/create');
            if (r.ok) {
                surface.workspace.invite = r.data.code;
                this.forceUpdate();
            }
        }
        var url = location.protocol + '//' + location.host + '/invite/' + surface.workspace.invite
        CopyText(url);
        alert('邀请链接已复制')
    }
    render() {
        return <div className='shy-ws-invites'>
            <h2>邀请</h2>
            <Divider></Divider>
            <Row>
                <Remark>任何得到此链接的人均可以加入这个空间。</Remark>
            </Row>
            <Row>
                <Col span={16}><Input
                    readonly={true} value={surface.workspace.invite ? location.protocol + '//' + location.host + '/invite/' + surface.workspace.invite : ''}></Input></Col>
                <Col align='start' span={8}><Button style={{ marginLeft: 20 }}
                    onClick={e => this.createInvite()}
                    ghost>{surface.workspace.invite ? '复制链接' : '创建链接'}</Button></Col>
            </Row>
        </div>
    }
}