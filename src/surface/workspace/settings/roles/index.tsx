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
import { ChevronLeftSvg, ChevronRightSvg, CloseSvg, DotsSvg, MemberSvg, PlusSvg, TrashSvg } from "rich/component/svgs";
import { Avatar } from 'rich/component/view/avator/face';
import { Button } from 'rich/component/view/button';
import { Row, Col, Divider } from 'rich/component/view/grid';
import { Icon } from "rich/component/view/icon";
import { Input } from 'rich/component/view/input';
import { useSelectMenuItem } from 'rich/component/view/menu';
import { HelpText, Remark } from "rich/component/view/text";
import { channel } from 'rich/net/channel';
import { Rect } from 'rich/src/common/vector/point';
import { util } from 'rich/util/util';
import { surface } from '../../../app/store';
import { SaveTip } from '../../../../component/tip/save.tip';
import { AtomPermission, getCommonPermission, getAtomPermissionComputedChanges, getAtomPermissionOptions } from "rich/src/page/permission";
import { ToolTip } from 'rich/component/view/tooltip';
import { SelectBox } from 'rich/component/view/select/box';
import { MenuItemType } from 'rich/component/view/menu/declare';
import { Pagination } from 'rich/component/view/pagination';
import { useUserPicker } from 'rich/extensions/at/picker';
import { Confirm } from 'rich/component/lib/confirm';
import { SearchListType } from 'rich/component/types';
import { Spin } from 'rich/component/view/spin';
import { lst } from 'rich/i18n/store';
import { S } from 'rich/i18n/view';
import { Tip } from 'rich/component/view/tooltip/tip';
import "./style.less";
import { useColorPicker } from 'rich/component/view/color/lazy';
import Pic from "../../../../assert/img/four-hand.png";
import { UserBasic, WorkspaceRole } from 'rich/types/user';
import { ShyAlert } from 'rich/component/lib/alert';

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
            roleUserSearch: observable,
        })
    }
    editRole: Record<string, any> = null;
    roles = [];
    bakeRoles = [];
    mode = 'permission';
    roleUserSearch: SearchListType = {
        list: [],
        page: 1,
        size: 100,
        total: -1,
        loading: false
    }
    async openEditRole(role) {

        if (!surface.workspace.isAllow(AtomPermission.wsFull)) return;
        this.editRole = role;
        if (!role.id) {
            this.mode = 'permission';
        }
        else {
            this.roleUserSearch.page = 1
            await this.loadRoleMemebers(role);
        }
    }
    async loadRoleMemebers(role) {
        this.roleUserSearch.loading = true;
        try {
            this.roleUserSearch.error = '';
            var r = await channel.get('/ws/role/members', { ws: undefined, roleId: role.id, page: this.roleUserSearch.page, size: this.roleUserSearch.size });
            if (r.ok) {
                Object.assign(this.roleUserSearch, r.data);
            }
        }
        catch (ex) {
            this.roleUserSearch.error = ex.toString();
        }
        finally {
            this.roleUserSearch.loading = false;
        }
    }
    componentDidMount() {
        this.loadRoles();
    }
    async operatorRole(role, event: React.MouseEvent) {
        event.stopPropagation();
        var ele = event.currentTarget as HTMLElement;
        try {
            ele.classList.remove('visible');
            var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(event) }, [
                { name: 'edit', icon: { name: 'byte', code: 'write' }, text: lst('编辑') },
                { type: MenuItemType.divide },
                { name: 'delete', icon: TrashSvg, text: lst('删除') }
            ]);
            if (r && r.item.name == 'delete') {
                await channel.del('/ws/role/delete', { roleId: role.id });
                var rs = this.roles.map(r => r);
                rs.remove(g => g.id == role.id);
                this.roles = rs;
                surface.workspace.roles.remove(g => g.id == role.id);
                surface.workspace.roles = surface.workspace.roles;
                this.bakeRoles.remove(g => g.id == role.id);
            }
            else if (r?.item.name == 'edit') {
                this.openEditRole(role);
            }
        }
        catch (e) {

        }
        finally {
            ele.classList.add('visible');
        }
    }
    async loadRoles() {
        this.roles = lodash.cloneDeep(surface.workspace.roles);
        this.roles.push({ text: lst('所有人'), permissions: surface.workspace.allMemeberPermissions || getCommonPermission() })
        this.bakeRoles = lodash.cloneDeep(this.roles);
    }
    async addRole() {
        if (!surface.workspace.isAllow(AtomPermission.wsFull)) return ShyAlert(lst('你没有权限'));
        var r = await channel.put('/ws/role/create', {
            data: {
                text: lst('新角色'),
                color: RoleColors[lodash.random(0, RoleColors.length)],
                permissions: getCommonPermission()
            }
        });
        if (r.ok) {
            this.roles.push(r.data.role);
            surface.workspace.roles.push(lodash.cloneDeep(r.data.role as WorkspaceRole));
            this.bakeRoles.push(lodash.cloneDeep(r.data.role as WorkspaceRole))
        }
    }
    async removeRole(id) {
        if (await Confirm(lst('确认删除角色?'))) {
            await channel.del('/ws/role/delete', { roleId: id });
            var rs = this.roles.map(r => r);
            rs.remove(g => g.id == id);
            this.roles = rs;
            surface.workspace.roles.remove(g => g.id == id);
            surface.workspace.roles = surface.workspace.roles;
            this.bakeRoles.remove(g => g.id == id);
            if (id == this.editRole?.id)
                this.editRole = null;
        }
    }
    get allRole() {
        return this.roles.find(g => g.text == lst('所有人'));
    }
    renderRoles() {
        return <div className="shy-ws-roles-list">
            <div className='h2'><S>角色</S></div>
            <Divider></Divider>
            <div className='remark gap-h-10'><S>使用角色来组织你的空间成员并自定义权限</S></div>
            <div className="shy-ws-roles-everyone flex cursor round padding-20" onMouseDown={e => this.openEditRole(this.allRole)}>
                <div className='flex-auto flex'>
                    <div className='flex-fixed circle bg-white size-40 flex-center remark'>
                        <Icon size={24} icon={MemberSvg}></Icon>
                    </div>
                    <div className='flex-auto gap-l-10'>
                        <h3><S>默认权限</S></h3>
                        <div className='remark f-12 gap-t-5'><S>@所有人.适用所有空间成员</S></div>
                    </div>
                </div>
                <div className='flex-fixed gap-r-10'>
                    <span className='item-hover size-30 circle flex-center '><Icon size={20} icon={ChevronRightSvg}></Icon></span>
                </div>
            </div>
            <div className='shy-ws-roles-list-box'>
                <div className='shy-ws-roles-list-box-head flex'>
                    <div className='flex-auto'><span><S>角色</S></span></div>
                    {surface.workspace.isAllow(AtomPermission.wsFull) && <div className='flex-fixed'><Button size='small' onClick={e => this.addRole()}><S>添加角色</S></Button></div>}
                </div>
                {this.roles.length == 1 && <div className='remark flex-center gap-h-20'><S>还没有创建任何角色</S></div>}
                {this.roles.filter(g => g.id ? true : false).map(r => {
                    return <div key={r.id} className='shy-ws-roles-list-role-info visible-hover padding-10' onMouseDown={e => this.openEditRole(r)} >
                        <div className='flex-auto flex'>
                            <svg
                                width="20"
                                height="23"
                                viewBox="0 0 20 23"
                                style={{ marginRight: 5 }}
                            >
                                <g fill="none"
                                    fillRule="evenodd">
                                    <path fill={r.color} d="M19.487 5.126L10.487 0.126C10.184 -0.042 9.81798 -0.042 9.51498 0.126L0.514977 5.126C0.197977 5.302 0.000976562 5.636 0.000976562 5.999C0.000976562 6.693 0.114977 22.999 10.001 22.999C19.887 22.999 20.001 6.693 20.001 5.999C20.001 5.636 19.804 5.302 19.487 5.126ZM10.001 5.999C11.382 5.999 12.501 7.118 12.501 8.499C12.501 9.88 11.382 10.999 10.001 10.999C8.61998 10.999 7.50098 9.88 7.50098 8.499C7.50098 7.118 8.61998 5.999 10.001 5.999ZM6.25098 16C6.25098 13.699 7.69998 12.25 10.001 12.25C12.302 12.25 13.751 13.699 13.751 16H6.25098Z">
                                    </path>
                                </g>
                            </svg>
                            <span>{r.text}</span>
                        </div>
                        {surface.workspace.isAllow(AtomPermission.wsFull) && <div className='flex-fixed size-24 visible item-hover round cursor flex-center ' onMouseDown={e => this.operatorRole(r, e)} > <Icon size={16} icon={DotsSvg}></Icon></div>}
                    </div>
                })}
            </div>
            <div className='flex-center gap-t-80'>
                <img src={Pic} className='object-center' style={{ maxWidth: 300 }} />
            </div>
        </div>
    }
    renderEditRoles() {
        return <div className='shy-ws-roles-edit'>
            <div className="shy-ws-roles-edit-roles">
                <div className='flex gap-b-10'>
                    <div className='flex-auto cursor flex'>
                        <span className='item-hover round flex padding-r-8 padding-h-2 '>
                            <span className='size-20 flex-center'>
                                <Icon size={20} onClick={e => this.editRole = null} icon={ChevronLeftSvg}></Icon>
                            </span>
                            <span onMouseDown={e => this.editRole = null}><S>后退</S></span>
                        </span>
                    </div>
                    <div className='flex-fixed'>
                        <Tip text={'添加角色'}><span className='cursor round item-hover flex-center size-20'><Icon size={16} onClick={e => this.addRole()} icon={PlusSvg}></Icon></span></Tip>
                    </div>
                </div>
                {this.roles.filter(f => f.id ? true : false).map(r => {
                    return <a className={'flex visible-hover ' + (this.editRole?.id == r.id ? "hover" : "")} onMouseDown={e => this.openEditRole(r)} key={r.id}>
                        <span className='flex-fixed size-14 circle' style={{ backgroundColor: r.color }}></span>
                        <span className='flex-auto gap-l-5 text-overflow'>{r.text}</span>
                        <span className='flex-fixed flex-center text-1 visible item-hover round cursor size-20' onMouseDown={e => {
                            this.removeRole(r.id);
                        }}><Icon size={12} icon={CloseSvg}></Icon></span>
                    </a>
                })}
                <a className={this.editRole?.text == lst('所有人') && !this.editRole?.id ? "hover" : ""} onMouseDown={e => this.openEditRole(this.allRole)}><span className=' size-14 circle' style={{ backgroundColor: 'rgb(153, 170, 181)' }}></span><span className='flex-auto gap-l-5 text-overflow'><S>所有人</S></span></a>
            </div>
            <div className="shy-ws-roles-edit-tab">
                <div className='shy-ws-roles-edit-tab-title'><Row>
                    <Col span={12}><span><S>编辑角色</S>-{this.editRole.text}</span></Col>
                </Row></div>
                <div className="shy-ws-roles-edit-tab-head">
                    <a onMouseDown={e => (e.target as HTMLElement).classList.contains('disabled') ? undefined : this.mode = 'info'} className={(this.editRole?.text == lst('所有人') && !this.editRole?.id ? "disabled " : "") + (this.mode == 'info' ? "hover" : "")}><S>显示</S></a>
                    <a onMouseDown={e => this.mode = 'permission'} className={this.mode == 'permission' ? "hover" : ""}><S>权限</S></a>
                    <a onMouseDown={e => (e.target as HTMLElement).classList.contains('disabled') ? undefined : this.mode = 'user'} className={(this.editRole?.text == lst('所有人') && !this.editRole?.id ? "disabled " : "") + (this.mode == 'user' ? "hover" : "")}><S>管理成员</S></a>
                </div>
                <div className="shy-ws-roles-edit-tab-page">
                    {this.mode == 'info' && this.renderRoleInfo()}
                    {this.mode == 'permission' && this.renderPermissions()}
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
            this.editSave({ color: r })
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
                    if (JSON.stringify(br) !== JSON.stringify(role)) {
                        lodash.remove(role.permissions, g => typeof g == 'number' && g < 100);
                        await channel.patch('/ws/role/patch', {
                            roleId: role.id, data: {
                                text: role.text,
                                color: role.color,
                                permissions: role.permissions
                            }
                        });
                        var wr = surface.workspace.roles.find(g => g.id == role.id);
                        if (wr) {
                            Object.assign(wr, role);
                        }
                        await util.delay(200);
                    }
                }
            }
            else {
                var br = this.bakeRoles.find(g => g.id ? false : true);
                if (JSON.stringify(br.permissions) !== JSON.stringify(role.permissions)) {
                    await channel.patch('/ws/patch', { data: { permissions: role.permissions } });
                    surface.workspace.allMemeberPermissions = role.permissions;
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
            <div className='gap-t-10 gap-b-5 flex f-12'><label><S>角色名称</S></label><i className='text-p gap-l-3'>*</i></div>
            <div><Input value={this.editRole.text} onChange={e => this.editSave({ text: e })}></Input></div>

            <div className='gap-t-10  flex f-12'><label><S>角色颜色</S></label><i className='text-p gap-l-3'>*</i></div>
            <div className='gap-b-5 remark f-12'><S text='成员将使用角色列表中最靠前的角色的颜色'>成员将使用角色列表中最靠前的角色的颜色。</S></div>
            <div>
                <div className='shy-ws-role-info-color-box'>
                    <div className='shy-ws-role-info-color' style={{
                        backgroundColor: this.editRole.color
                    }}></div>
                    <div className='shy-ws-role-info-color-picker' onMouseDown={e => this.openFontColor(e)} style={{
                        backgroundColor: RoleColors.includes(this.editRole.color) ? "rgb(153, 170, 181)" : this.editRole.color
                    }}>
                        <svg style={{ position: 'absolute', top: 2, right: 2 }} width="14" height="14" viewBox="0 0 16 16"><g fill="none"><path d="M-4-4h24v24H-4z"></path><path fill="hsl(0, calc(var(--saturation-factor, 1) * 0%), 100%)" d="M14.994 1.006C13.858-.257 11.904-.3 10.72.89L8.637 2.975l-.696-.697-1.387 1.388 5.557 5.557 1.387-1.388-.697-.697 1.964-1.964c1.13-1.13 1.3-2.985.23-4.168zm-13.25 10.25c-.225.224-.408.48-.55.764L.02 14.37l1.39 1.39 2.35-1.174c.283-.14.54-.33.765-.55l4.808-4.808-2.776-2.776-4.813 4.803z"></path></g></svg>
                    </div>
                    <div className='shy-ws-role-info-colors'>
                        {RoleColors.map(c => {
                            return <a onMouseDown={e => this.editSave({ color: c })} key={c} style={{ backgroundColor: c }}>
                                {this.editRole?.color == c && <svg aria-hidden="false" width="16" height="16" viewBox="0 0 24 24"><path fill="hsl(0, calc(var(--saturation-factor, 1) * 0%), 100%)" fillRule="evenodd" clipRule="evenodd" d="M8.99991 16.17L4.82991 12L3.40991 13.41L8.99991 19L20.9999 7.00003L19.5899 5.59003L8.99991 16.17Z"></path></svg>}
                            </a>
                        })}
                    </div>
                </div>
            </div>
        </div>
    }
    renderPermissions() {
        var self = this;
        function save(ps: AtomPermission[], names: string[]) {
            lodash.remove(self.editRole.permissions as AtomPermission[], g => !AtomPermission[g] || names.some(n => AtomPermission[g] && AtomPermission[g].startsWith(n) ? true : false));
            ps.forEach(p => {
                if (!self.editRole.permissions.includes(p)) {
                    self.editRole.permissions.push(p)
                }
            })
            lodash.remove(self.editRole.permissions, g => typeof g == 'number' && g > -1 && g < 1000 ? false : true);
            self.tip.open();
        }
        return <div className="shy-ws-role-permission">
            <div className='flex'>
                <span className='flex-auto flex'>
                    <span className='gap-r-3 f-12'><S>通用的页面访问权限</S></span>
                    <HelpText url={window.shyConfig?.isUS ? "https://help.shy.red/page/56" : "https://help.shy.live/page/348"} ><S>了解页面访问权限</S></HelpText>
                </span>
                <span className='f-12 flex-fixed '><Button link size={'small'} ><S>清除权限</S></Button></span>
            </div>
            <div className='r-gap-h-10'>
                <div className='flex'>
                    <div className='flex-auto'>
                        <div><S>页面权限</S></div>
                        <div className='remark f-12'><S text='设置文档白板PPT的权限'>设置文档、白板、PPT、频道、数据表等页面权限</S></div>
                    </div>
                    <div className='flex-fixed'>
                        <SelectBox
                            border
                            multiple
                            computedChanges={async (vs, v) => {
                                return getAtomPermissionComputedChanges('pageAndDb', vs, v);
                            }}
                            options={getAtomPermissionOptions('pageAndDb')}
                            value={self.editRole?.permissions.filter(g => AtomPermission[g]?.startsWith('page') || AtomPermission[g]?.startsWith('db'))}
                            onChange={e => { save(e, ['page', 'db']) }}
                        ></SelectBox>
                    </div>
                </div>
                <Divider></Divider>
                {/* <div className='flex'>
                    <div className='flex-auto'>
                        <div><S>数据表权限</S></div>
                        <div className='remark f-12'><S>设置数据表的权限</S></div>
                    </div>
                    <div className='flex-fixed'>
                        <SelectBox

                            border
                            options={getAtomPermissionOptions('db')}
                            multiple
                            computedChanges={async (vs, v) => {
                                return getAtomPermissionComputedChanges('db', vs, v);
                            }}
                            value={self.editRole?.permissions?.filter(g => AtomPermission[g]?.startsWith('db'))}
                            onChange={e => { save(e) }}
                        ></SelectBox>
                    </div>
                </div>
                <Divider></Divider> */}
                <div className='flex'>
                    <div className='flex-auto'>
                        <div><S>空间管理权限</S></div>
                        <div className='remark f-12'><S>设置管理理员对空间成员管理权限</S></div>
                    </div>
                    <div className='flex-fixed'>
                        <SelectBox
                            border
                            options={getAtomPermissionOptions('ws')}
                            multiple
                            computedChanges={async (vs, v) => {
                                return getAtomPermissionComputedChanges('ws', vs, v);
                            }}
                            value={self.editRole?.permissions.filter(g => AtomPermission[g]?.startsWith('ws'))}
                            onChange={e => { save(e, ['ws']) }}
                        ></SelectBox>
                    </div>
                </div>
            </div>
        </div>
    }
    async onAddRoleMember(e: React.MouseEvent) {
        var r = await useUserPicker({ center: true, centerTop: 100 }, surface.workspace, { ignoreUserAll: true }) as UserBasic;
        if (r) {
            var g = await surface.workspace.sock.put('/ws/user/put/role', { wsId: surface.workspace.id, roleId: this.editRole.id, userid: r.id });
            await this.loadRoleMemebers(this.editRole)
        }
    }
    async removeRoleMember(id: string) {
        if (await Confirm(lst(`确定要从角色组[{text}]移出成员吗`, { text: this.editRole.text }))) {
            var g = await surface.workspace.sock.delete('/ws/user/delete/role', { wsId: surface.workspace.id, roleId: this.editRole.id, userid: id });
            await this.loadRoleMemebers(this.editRole)
        }
    }
    renderRoleUsers() {
        return <div className="shy-ws-role-users">
            <div className='flex'>
                <span className='flex-auto  f-14'><S>成员列表</S>{this.roleUserSearch.total ? `(${this.roleUserSearch.total})` : ''}</span>
                <ToolTip overlay={<S>添加成员</S>}><span onClick={e => this.onAddRoleMember(e)} className='flex-fixed flex-center size-24 round item-hover round cursor'>
                    <Icon size={18} icon={PlusSvg}></Icon>
                </span></ToolTip>
            </div>
            {this.roleUserSearch.loading && <div className='remark flex-center gap-h-30'><Spin></Spin></div>}
            {this.roleUserSearch.list.map(ru => {
                return <div className='flex gap-h-10 visible-hover' key={ru.id}>
                    <span className='flex-auto'><Avatar middle size={32} showName showSn userid={ru.userid}></Avatar></span>
                    <ToolTip overlay={lst('移出成员')}>
                        <span onClick={e => this.removeRoleMember(ru.userid)} className='flex-fixed size-24 flex-center round item-hover cursor visible'>
                            <Icon size={14} icon={CloseSvg}></Icon>
                        </span>
                    </ToolTip>
                </div>
            })}
            {this.roleUserSearch.loading == false && this.roleUserSearch.list.length == 0 && <div className='remark f-12 flex-center gap-h-30'><S>还没有成员</S></div>}
            <div className='flex-center'>
                <Pagination
                    size={this.roleUserSearch.size}
                    index={this.roleUserSearch.page}
                    total={this.roleUserSearch.total}
                    onChange={e => {
                        this.roleUserSearch.page = e;
                        this.loadRoleMemebers(e);
                    }}
                ></Pagination>
            </div>
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


