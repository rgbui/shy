/**
 * 
 * 用户角色
 * 每个成员都有基本的角色身份 @所有人
 * 空间所有者有最高的权限
 * @管理员 辅助管理
 *     能够编排文档
 *     能够编排目录
 * @消费者 服务于空间
 *     能够会话聊天
 *     能够评论
 *     
 * @访客
 * @匿名
 * 
 */

import lodash from 'lodash';
import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from "react";
import { ArrowLeftSvg, ArrowRightSvg, PlusSvg, SettingsSvg, TypesPersonSvg } from "rich/component/svgs";
import { Avatar } from 'rich/component/view/avator/face';
import { Button } from 'rich/component/view/button';
import { Row, Col, Space, Divider } from 'rich/component/view/grid';
import { Icon, IconButton } from "rich/component/view/icon";
import { Input } from 'rich/component/view/input';
import { Switch } from 'rich/component/view/switch';
import { Remark } from "rich/component/view/text";
import { channel } from 'rich/net/channel';
import { surface } from '../../..';
import { getCommonPerssions, WorkspacePermission } from '../../permission';
import "./style.less";


const RoleColors: string[] = [
    'rgb(26,188,156)',
    'rgb(46,204,113)',
    'rgb(52,152,219)',
    'rgb(155,89,182)',
    'rgb(233,30,99)',
    'rgb(241,196,15)',
    'rgb(230,126,34)',
    'rgb(231,76,60)',
    'rgb(149,165,166)',
    'rgb(96,125,139)',
    'rgb(17,128,106)',
    'rgb(31,139,76)',
    'rgb(32,102,148)',
    'rgb(113,54,138)',
    'rgb(173,20,87)',
    'rgb(194,124,14)',
    'rgb(168,67,0)',
    'rgb(153,45,34)',
    'rgb(151,156,159)',
    'rgb(84,110,122)',
]



@observer
export class WorkspaceRoles extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            roles: observable,
            mode: observable,
            editRole: observable,
            roleUsers: observable,
            rolePage: observable,
            roleSize: observable,
            roleTotal: observable,
        })
    }
    editRole: Record<string, any> = null;
    roles = [];
    mode = 'perssion';
    roleUsers: any[] = [];
    rolePage: number = 1;
    roleSize: number = 100;
    roleTotal: number;
    async openEditRole(role) {
        this.editRole = role;
        if (role.text == '所有人') {
            this.editRole.permission = surface.workspace.perssions || getCommonPerssions();
        }
        else {
            this.rolePage = 1;
            var r = await channel.get('/ws/role/members', { roleId: role.id, page: this.rolePage, size: this.roleSize });
            if (r.ok) {
                this.roleUsers = r.data.list;
                this.rolePage = r.data.page;
                this.roleSize = r.data.size;
                this.roleTotal = r.data.total;
            }
        }
    }
    operatorRole(role, event: React.MouseEvent) {

    }
    async loadRoles() {
        var r = await channel.get('/ws/roles');
        this.roles = r.data.list;
    }
    async addRole() {
        var r = await channel.put('/ws/role/create', {
            data: {
                text: '新角色',
                color: RoleColors[lodash.random(0, RoleColors.length)],
                perssions: getCommonPerssions()
            }
        });
        if (r.ok) {
            this.roles.push(r.data.role);
        }
    }
    renderRoles() {
        return <div className="shy-ws-roles-list">
            <h3>角色</h3>
            <Remark>使用角色来组织你的空间成员并自定义权限</Remark>
            <div className="shy-ws-roles-everyone" onMouseDown={e => this.openEditRole({ text: '所有人' })}>
                <Row>
                    <Col span={12}><Space>
                        <Icon size={30} icon={TypesPersonSvg}></Icon>
                        <div>
                            <h3>默认权限</h3>
                            <span>@所有人.适用所有空间成员</span>
                        </div>
                    </Space>
                    </Col>
                    <Col span={12} align='end'><Icon icon={ArrowRightSvg}></Icon></Col>
                </Row>
            </div>
            <div className='shy-ws-roles-list-box'>
                <div className='shy-ws-roles-list-box-head'>
                    <Row style={{ marginBottom: 0 }}>
                        <Col span={12}><span>角色</span></Col>
                        <Col span={12} align='end'><Button onClick={e => this.addRole()}>添加角色</Button></Col>
                    </Row>
                </div>
                {this.roles.map(r => {
                    return <Row key={r.id}>
                        <Col span={12}>{r.text}</Col>
                        <Col span={12} align='end'>
                            <IconButton onMouseDown={e => this.openEditRole(r)}
                                width={24}
                                size={14} wrapper
                                icon={SettingsSvg}
                            ></IconButton>
                            <IconButton width={24} onMouseDown={e => this.operatorRole(r, e)} size={14} wrapper
                                icon={'elipsis:sy'}
                            ></IconButton>
                        </Col>
                    </Row>
                })}
            </div>
        </div>
    }
    renderEditRoles() {
        return <div className='shy-ws-roles-edit'>
            <div className="shy-ws-roles-edit-roles">
                <div className='shy-ws-roles-edit-roles-head'>
                    <Row>
                        <Col><span onMouseDown={e => this.editRole = null}><Icon icon={ArrowLeftSvg}></Icon>
                            <span>后退</span></span>
                        </Col>
                        <Col><Icon click={e => this.addRole()} icon={PlusSvg}></Icon></Col>
                    </Row>
                </div>
                <a className={this.editRole?.text == '所有人' && !this.editRole?.id ? "hover" : ""} onMouseDown={e => this.openEditRole({ text: '所有人' })}>@所有人</a>
                {this.roles.map(r => {
                    return <a className={this.editRole?.id == r.id ? "hover" : ""} onMouseDown={e => this.openEditRole(r)} key={r.id}><span>{r.text}</span></a>
                })}
            </div>
            <div className="shy-ws-roles-edit-tab">
                <Row>
                    <Col span={12}><span>编辑角色-{this.editRole.text}</span>
                    </Col>
                    <Col span={12}>
                        <Icon icon='elipsis:sy'></Icon>
                    </Col>
                </Row>
                <div className="shy-ws-roles-edit-tab-head">
                    <a onMouseDown={e => (e.target as HTMLElement).classList.contains('disabled') ? undefined : this.mode = 'info'} className={(this.editRole?.text == '所有人' && !this.editRole?.id ? "disabled " : "") + (this.mode == 'info' ? "hover" : "")}>显示</a>
                    <a onMouseDown={e => this.mode = 'perssion'} className={this.mode == 'perssion' ? "hover" : ""}>权限</a>
                    <a onMouseDown={e => (e.target as HTMLElement).classList.contains('disabled') ? undefined : this.mode = 'user'} className={(this.editRole?.text == '所有人' && !this.editRole?.id ? "disabled " : "") + (this.mode == 'user' ? "hover" : "")}>管理成员</a>
                </div>
                <div className="shy-ws-roles-edit-tab-page">
                    {this.mode == 'info' && this.renderRoleInfo()}
                    {this.mode == 'perssion' && this.renderPerssions()}
                    {this.mode == 'user' && this.renderRoleUsers()}
                </div>
            </div>
        </div>
    }
    renderRoleInfo() {
        return <div className="shy-ws-role-info">
            <Row>
                <Col>角色名称*</Col>
                <Col><Input value={this.editRole.text} onChange={e => this.editRole.text = e}></Input></Col>
            </Row>
            <Divider></Divider>
            <Row>
                <Col>角色颜色*</Col>
                <Col><Remark>成员将使用角色列表中最靠前的角色的颜色。</Remark></Col>
                <Col><div className='shy-ws-role-info-color-box'>
                    <div className='shy-ws-role-info-color' style={{ backgroundColor: this.editRole.color }}></div>
                    <div className='shy-ws-role-info-color-picker'>

                    </div>
                    <div className='shy-ws-role-info-colors'>
                        {RoleColors.map(c => {
                            return <a key={c} style={{ backgroundColor: c }}></a>
                        })}
                    </div>
                </div></Col>
            </Row>
        </div>
    }
    renderPerssions() {
        function changePerssion(perssion, checked) {

        }
        return <div className="shy-ws-role-perssion">
            <Row>
                <Col>通用的空间权限</Col>
                <Col><Button>清除权限</Button></Col>
            </Row>

            <Row>
                <Col span={18}>编辑文档</Col><Col span={6} align='end'><Switch onChange={e => changePerssion(WorkspacePermission.editDoc, e)} checked={this.editRole.perssions.includs(WorkspacePermission.editDoc)}></Switch></Col>
                <Col><Remark>默认允许编辑文档</Remark></Col>
                <Divider></Divider>
            </Row>
            <Row>
                <Col span={18}>创建或删除文档</Col><Col span={6} align='end'><Switch onChange={e => changePerssion(WorkspacePermission.createOrDeleteDoc, e)} checked={this.editRole.perssions.includs(WorkspacePermission.createOrDeleteDoc)}></Switch></Col>
                <Col><Remark>默认允许创建或删除文档</Remark></Col>
                <Divider></Divider>
            </Row>
            <Row>
                <Col span={18}>会话发送消息</Col><Col span={6} align='end'><Switch onChange={e => changePerssion(WorkspacePermission.sendMessageByChannel, e)} checked={this.editRole.perssions.includs(WorkspacePermission.sendMessageByChannel)}></Switch></Col>
                <Col><Remark>默认允许会话发送消息</Remark></Col>
                <Divider></Divider>
            </Row>
            <Row>
                <Col span={18}>创建会话</Col><Col span={6} align='end'><Switch onChange={e => changePerssion(WorkspacePermission.createOrDeleteChannel, e)} checked={this.editRole.perssions.includs(WorkspacePermission.createOrDeleteChannel)}></Switch></Col>
                <Col><Remark>默认允许创建会话或删除会话</Remark></Col>
                <Divider></Divider>
            </Row>

        </div>
    }
    renderRoleUsers() {
        return <div className="shy-ws-role-users">
            {this.roleUsers.map(ru => {
                return <Row key={ru.id}>
                    <Col span={12}><Avatar userid={ru.userid}></Avatar></Col>
                    <Col span={12}></Col>
                </Row>
            })}
        </div>
    }
    render() {
        return <div className='shy-ws-roles'>
            {!this.editRole && this.renderRoles()}
            {this.editRole && this.renderEditRoles()}
        </div>
    }
}


