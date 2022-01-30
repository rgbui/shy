
import React from 'react';
import { Row, Col, Divider, Space } from 'rich/component/view/grid';
import { Input } from 'rich/component/view/input';
import { Button } from 'rich/component/view/button';
import { CopyText } from 'rich/component/copy';
import { surface } from '../..';
import { workspaceService } from '../../../../services/workspace';
import { Avatar } from 'rich/component/view/avator/face';
import { observer } from 'mobx-react';
import SvgDown from "rich/src/assert/svg/chevronDown.svg";
@observer
export class WorkspaceMembers extends React.Component {
    async createInvite() {
        if (!surface.workspace.invite) {
            var r = await workspaceService.createInvite(surface.workspace.id);
            if (r.ok) {
                surface.workspace.invite = r.data.code;
                this.forceUpdate();
            }
        }
        var url = location.protocol + '//' + location.host + '/invite/' + surface.workspace.invite
        CopyText(url);
        alert('邀请链接已复制')
    }
    async onAddMember() {

    }
    async setUser(user, event: React.MouseEvent) {

    }
    render() {
        function getRoleName(user) {
            if (user.role == 'adming') return '管理员';
            else return '成员';
        }
        return <div className='shy-ws-members'>
            <div className='shy-ws-memeber-invitation'>
                <h4>通用邀请链接</h4>
                <div className='shy-remark'>任何得到此链接的人均可以加入这个空间。</div>
                <Row><Col span={16}><Input readonly={true} value={surface.workspace.invite ? location.protocol + '//' + location.host + '/invite/' + surface.workspace.invite : ''}></Input></Col><Col align='start' span={8}><Button style={{ marginLeft: 20 }} onClick={e => this.createInvite()} ghost>{surface.workspace.invite ? '复制链接' : '创建链接'}</Button></Col></Row>
            </div>
            <Divider></Divider>
            <div className='shy-ws-members-list'>
                <div className='shy-ws-member-head'>
                    <Row>
                        <Col span={12}><Input placeholder='搜索用户...'></Input></Col>
                        {/*<Col span={12} align='end'><Button onClick={e => this.onAddMember()}>添加用户</Button></Col> */}
                    </Row>
                </div>
                <Divider></Divider>
                {surface.workspace.users.map(us => {
                    return <div className='shy-ws-member' key={us.userid}>
                        <Row style={{ marginBottom: 20 }}>
                            <Col span={16}><Space>
                                <Avatar size={30} userid={us.userid}></Avatar>
                                <span>{us.nick}</span></Space>
                            </Col>
                            <Col span={8} align='end'>
                                <Space gap={5} style={{ cursor: 'pointer' }} onMousedown={e => this.setUser(us, e)}>
                                    <span>{getRoleName(us)}</span>
                                    <SvgDown style={{ width: 10 }}></SvgDown>
                                </Space>
                            </Col>
                        </Row>
                    </div>
                })}
            </div>
        </div>
    }
}