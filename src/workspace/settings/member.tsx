
import React from 'react';
import { Row, Col, Divider } from 'rich/component/view/grid';
import { Input } from 'rich/component/view/input';
import { Button } from 'rich/component/view/button';
import { CopyText } from 'rich/component/copy';
import { surface } from '../../surface';
import { workspaceService } from '../service';
import { Avatar } from '../../components/face';
import { Select } from 'rich/component/view/select';

export class WorkspaceMembers extends React.Component {
    async createInvite() {
        if (!surface.workspace.inviteUrl) {
            var r = await workspaceService.createInvite(surface.workspace.id);
            if (r.ok) {
                surface.workspace.inviteUrl = r.data.url;
                this.forceUpdate();
                CopyText(surface.workspace.inviteUrl)
            }
        }
        else CopyText(surface.workspace.inviteUrl)
    }
    async onAddMember() {

    }
    render() {
        return <div className='shy-ws-members'>
            <div className='shy-ws-memeber-invitation'>
                <h4>通用邀请链接</h4>
                <div className='shy-remark'>任何得到此链接的人均可以加入这个空间，你也可以</div>
                <Row><Col span={16}><Input></Input></Col><Col align='start' span={8}><Button style={{ marginLeft: 20 }} onClick={e => this.createInvite()} ghost>{surface.workspace.inviteUrl ? '复制链接' : '创建链接'}</Button></Col></Row>
            </div>
            <Divider></Divider>
            <div className='shy-ws-members-list'>
                <div className='shy-ws-member-head'>
                    <Row>
                        <Col span={12}><Input placeholder='搜索用户...'></Input></Col>
                        <Col span={12} align='end'><Button onClick={e => this.onAddMember()}>添加用户</Button></Col>
                    </Row>
                </div>
                <Divider></Divider>
                {surface.workspace.users.map(us => {
                    return <div className='shy-ws-member' key={us.userid}>
                        <Row>
                            <Col span={16}> <Avatar userid={us.userid}></Avatar>
                                <span>{us.nick}</span></Col>
                            <Col span={8} align='end'><Select style={{ width: 80 }} value={us.role} options={[{ text: '管理员', value: '管理员' }, { text: '普通', value: '普通' }]}></Select></Col>
                        </Row>
                    </div>
                })}
            </div>
        </div>
    }
}