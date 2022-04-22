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
import { makeObservable, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import React from "react";
import { ArrowLeftSvg, ArrowRightSvg, PlusSvg, SettingsSvg, TypesPersonSvg } from "rich/component/svgs";
import { Avatar } from 'rich/component/view/avator/face';
import { Button } from 'rich/component/view/button';
import { useColorPicker } from 'rich/component/view/color/picker';
import { Row, Col, Space, Divider } from 'rich/component/view/grid';
import { Icon, IconButton } from "rich/component/view/icon";
import { Input } from 'rich/component/view/input';
import { useSelectMenuItem } from 'rich/component/view/menu';
import { Switch } from 'rich/component/view/switch';
import { Remark } from "rich/component/view/text";
import { channel } from 'rich/net/channel';
import { Rect } from 'rich/src/common/vector/point';
import { util } from 'rich/util/util';
import { surface } from '../../..';
import { SaveTip } from '../../../../component/tip/save.tip';
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
    bakeRoles = [];
    mode = 'permission';
    roleUsers: any[] = [];
    rolePage: number = 1;
    roleSize: number = 100;
    roleTotal: number = -1;
    async openEditRole(role) {
        this.editRole = role;
        if (!role.id) {
            this.mode = 'permission';
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
    componentDidMount() {
        this.loadRoles();
    }
    async operatorRole(role, event: React.MouseEvent) {
        event.stopPropagation();
        var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(event) }, [{ name: 'delete', text: '删除' }]);
        if (r && r.item.name == 'delete') {
            var re = await channel.del('/ws/role/delete', { roleId: role.id });
            var rs = this.roles.map(r => r);
            rs.remove(g => g.id == role.id);
            this.roles = rs;
        }
    }
    async loadRoles() {
        this.roles = lodash.cloneDeep(surface.workspace.roles);
        this.roles.push({ text: '所有人', permissions: surface.workspace.permissions || getCommonPerssions() })
        this.bakeRoles = lodash.cloneDeep(this.roles);
    }
    async addRole() {
        var r = await channel.put('/ws/role/create', {
            data: {
                text: '新角色',
                color: RoleColors[lodash.random(0, RoleColors.length)],
                permissions: getCommonPerssions()
            }
        });
        if (r.ok) {
            this.roles.push(r.data.role);
        }
    }
    get allRole() {
        return this.roles.find(g => g.text == '所有人');
    }
    renderRoles() {
        return <div className="shy-ws-roles-list">
            <h3>角色</h3>
            <Remark>使用角色来组织你的空间成员并自定义权限</Remark>
            <div className="shy-ws-roles-everyone" onMouseDown={e => this.openEditRole(this.allRole)}>
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
                        <Col span={12} align='end'><Button size='small' onClick={e => this.addRole()}>添加角色</Button></Col>
                    </Row>
                </div>
                {this.roles.filter(g => g.id ? true : false).map(r => {
                    return <div key={r.id} className='shy-ws-roles-list-role-info' onMouseDown={e => this.openEditRole(r)} >
                        <div style={{ display: 'inline-flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <svg width="20" height="23" viewBox="0 0 20 23" style={{ marginRight: 5 }}><g fill="none" fillRule="evenodd"><path
                                fill={r.color}
                                d="M19.487 5.126L10.487 0.126C10.184 -0.042 9.81798 -0.042 9.51498 0.126L0.514977 5.126C0.197977 5.302 0.000976562 5.636 0.000976562 5.999C0.000976562 6.693 0.114977 22.999 10.001 22.999C19.887 22.999 20.001 6.693 20.001 5.999C20.001 5.636 19.804 5.302 19.487 5.126ZM10.001 5.999C11.382 5.999 12.501 7.118 12.501 8.499C12.501 9.88 11.382 10.999 10.001 10.999C8.61998 10.999 7.50098 9.88 7.50098 8.499C7.50098 7.118 8.61998 5.999 10.001 5.999ZM6.25098 16C6.25098 13.699 7.69998 12.25 10.001 12.25C12.302 12.25 13.751 13.699 13.751 16H6.25098Z"></path></g></svg>
                            {r.text}</div>
                        <div><IconButton width={24} onMouseDown={e => this.operatorRole(r, e)} size={14} wrapper
                            icon={'elipsis:sy'}
                        ></IconButton></div>
                    </div>
                })}
            </div>
        </div>
    }
    renderEditRoles() {
        return <div className='shy-ws-roles-edit'>
            <div className="shy-ws-roles-edit-roles">
                <div className='shy-ws-roles-edit-roles-head'>
                    <Row>
                        <Col span={18}><Icon style={{ cursor: 'pointer' }} click={e => this.editRole = null} icon={ArrowLeftSvg}></Icon>
                            <span style={{ cursor: 'pointer', display: 'inline-block', marginLeft: 5 }} onMouseDown={e => this.editRole = null}>后退</span>
                        </Col>
                        <Col span={6}><Icon click={e => this.addRole()} icon={PlusSvg}></Icon></Col>
                    </Row>
                </div>
                {this.roles.filter(f => f.id ? true : false).map(r => {
                    return <a className={this.editRole?.id == r.id ? "hover" : ""} onMouseDown={e => this.openEditRole(r)} key={r.id}><span style={{ backgroundColor: r.color }}></span><span>{r.text}</span></a>
                })}
                <a className={this.editRole?.text == '所有人' && !this.editRole?.id ? "hover" : ""} onMouseDown={e => this.openEditRole(this.allRole)}><span style={{ backgroundColor: 'rgb(153, 170, 181)' }}></span><span>@所有人</span></a>
            </div>
            <div className="shy-ws-roles-edit-tab">
                <div className='shy-ws-roles-edit-tab-title'><Row>
                    <Col span={12}><span>编辑角色-{this.editRole.text}</span></Col>
                    {/*<Col span={12} align={'end'}><Icon icon='elipsis:sy'></Icon></Col> */}
                </Row></div>
                <div className="shy-ws-roles-edit-tab-head">
                    <a onMouseDown={e => (e.target as HTMLElement).classList.contains('disabled') ? undefined : this.mode = 'info'} className={(this.editRole?.text == '所有人' && !this.editRole?.id ? "disabled " : "") + (this.mode == 'info' ? "hover" : "")}>显示</a>
                    <a onMouseDown={e => this.mode = 'permission'} className={this.mode == 'permission' ? "hover" : ""}>权限</a>
                    <a onMouseDown={e => (e.target as HTMLElement).classList.contains('disabled') ? undefined : this.mode = 'user'} className={(this.editRole?.text == '所有人' && !this.editRole?.id ? "disabled " : "") + (this.mode == 'user' ? "hover" : "")}>管理成员</a>
                </div>
                <div className="shy-ws-roles-edit-tab-page">
                    {this.mode == 'info' && this.renderRoleInfo()}
                    {this.mode == 'permission' && this.renderPerssions()}
                    {this.mode == 'user' && this.renderRoleUsers()}
                </div>
            </div>
        </div>
    }
    async openFontColor(event: React.MouseEvent) {
        var self = this;
        var r = await useColorPicker(
            { roundArea: Rect.fromEvent(event) },
            {
                color: this.editRole.color || undefined,
                change(color) {
                    self.editRole.color = color;
                }
            }
        );
        if (r) {
            this.editRole.color = r;
        }
    }
    editSave(data: Record<string, any>) {
        runInAction(() => {
            for (let n in data) {
                this.editRole[n] = data[n];
            }
            this.tip.open();
        })
    }
    tip: SaveTip;
    async save() {
        for (let i = 0; i < this.roles.length; i++) {
            var role = this.roles[i];
            if (role.id) {
                var br = this.bakeRoles.find(b => b.id == role.id);
                if (br) {
                    if (JSON.stringify(br) != JSON.stringify(role)) {
                        await channel.patch('/ws/role/patch', { roleId: role.id, data: { text: role.text, color: role.color, permissions: role.permissions } });
                        await util.delay(200);
                    }
                }
            }
            else {
                var br = this.bakeRoles.find(g => g.id ? false : true);
                if (JSON.stringify(br.permissions) != JSON.stringify(role.perssionss)) {
                    await channel.patch('/ws/patch', { data: { permissions: role.permissions } });
                    surface.workspace.permissions = role.permissions;
                    await util.delay(200);
                }
            }
        }
        this.tip.close();
    }
    reset() {
        this.roles = lodash.cloneDeep(this.bakeRoles);
        this.tip.close();
    }
    renderRoleInfo() {
        return <div className="shy-ws-role-info">

            <Row>
                <Col>角色名称*</Col>
                <Col><Input value={this.editRole.text} onChange={e => this.editSave({ text: e })}></Input></Col>
            </Row>
            <Divider></Divider>
            <Row>
                <Col>角色颜色*</Col>
                <Col><Remark>成员将使用角色列表中最靠前的角色的颜色。</Remark></Col>
                <Col><div className='shy-ws-role-info-color-box'>
                    <div className='shy-ws-role-info-color' style={{ backgroundColor: this.editRole.color }}></div>
                    <div className='shy-ws-role-info-color-picker' onMouseDown={e => this.openFontColor(e)} style={{ backgroundColor: RoleColors.includes(this.editRole.color) ? "rgb(153, 170, 181)" : this.editRole.color }}>
                        <svg style={{ position: 'absolute', top: 2, right: 2 }} width="14" height="14" viewBox="0 0 16 16"><g fill="none"><path d="M-4-4h24v24H-4z"></path><path fill="hsl(0, calc(var(--saturation-factor, 1) * 0%), 100%)" d="M14.994 1.006C13.858-.257 11.904-.3 10.72.89L8.637 2.975l-.696-.697-1.387 1.388 5.557 5.557 1.387-1.388-.697-.697 1.964-1.964c1.13-1.13 1.3-2.985.23-4.168zm-13.25 10.25c-.225.224-.408.48-.55.764L.02 14.37l1.39 1.39 2.35-1.174c.283-.14.54-.33.765-.55l4.808-4.808-2.776-2.776-4.813 4.803z"></path></g></svg>
                    </div>
                    <div className='shy-ws-role-info-colors'>
                        {RoleColors.map(c => {
                            return <a onMouseDown={e => this.editSave({ color: c })} key={c} style={{ backgroundColor: c }}>
                                {this.editRole?.color == c && <svg aria-hidden="false" width="16" height="16" viewBox="0 0 24 24"><path fill="hsl(0, calc(var(--saturation-factor, 1) * 0%), 100%)" fillRule="evenodd" clipRule="evenodd" d="M8.99991 16.17L4.82991 12L3.40991 13.41L8.99991 19L20.9999 7.00003L19.5899 5.59003L8.99991 16.17Z"></path></svg>}
                            </a>
                        })}
                    </div>
                </div></Col>
            </Row>
        </div>
    }
    renderPerssions() {
        var self = this;
        function changePermission(permission, checked) {
            if (!Array.isArray(self.editRole?.permissions)) {
                self.editRole.permissions = [];
            }
            if (checked == true) {
                if (!self.editRole.permissions.includes(permission)) {
                    self.editRole.permissions.push(permission);
                }
            }
            else {
                if (self.editRole.permissions.includes(permission)) {
                    lodash.remove(self.editRole.permissions, x => x == permission);
                }
            }
            self.tip.open();
        }
        function is(permission: WorkspacePermission) {
            if (Array.isArray(self.editRole?.permissions)) {
                return (self.editRole.permissions as number[]).includes(permission)
            }
            return false;
        }
        return <div className="shy-ws-role-permission">
            <Row>
                <Col span={12}>通用的空间权限</Col>
                <Col span={12} align={'end'}><Button link size={'small'} >清除权限</Button></Col>
            </Row>
            <Row>
                <Col span={18}>编辑文档</Col><Col span={6} align='end'><Switch onChange={e => changePermission(WorkspacePermission.editDoc, e)} checked={is(WorkspacePermission.editDoc)}></Switch></Col>
                <Col><Remark>默认允许编辑文档</Remark></Col>
                <Divider></Divider>
            </Row>
            <Row>
                <Col span={18}>创建或删除文档</Col><Col span={6} align='end'><Switch onChange={e => changePermission(WorkspacePermission.createOrDeleteDoc, e)} checked={is(WorkspacePermission.createOrDeleteDoc)}></Switch></Col>
                <Col><Remark>默认允许创建或删除文档</Remark></Col>
                <Divider></Divider>
            </Row>
            <Row>
                <Col span={18}>会话发送消息</Col><Col span={6} align='end'><Switch onChange={e => changePermission(WorkspacePermission.sendMessageByChannel, e)} checked={is(WorkspacePermission.sendMessageByChannel)}></Switch></Col>
                <Col><Remark>默认允许会话发送消息</Remark></Col>
                <Divider></Divider>
            </Row>
            <Row>
                <Col span={18}>创建会话</Col><Col span={6} align='end'><Switch onChange={e => changePermission(WorkspacePermission.createOrDeleteChannel, e)} checked={is(WorkspacePermission.createOrDeleteChannel)}></Switch></Col>
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
            <SaveTip ref={e => this.tip = e} save={e => this.save()} reset={e => this.reset()}></SaveTip>
            {!this.editRole && this.renderRoles()}
            {this.editRole && this.renderEditRoles()}
        </div>
    }
}


