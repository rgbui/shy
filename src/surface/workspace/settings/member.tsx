
import React from 'react';
import { Row, Col, Divider, Space } from 'rich/component/view/grid';
import { Input } from 'rich/component/view/input';
import { observer } from 'mobx-react';
import { makeObservable, observable, runInAction } from 'mobx';
import { surface } from '../..';
import { Select } from 'rich/component/view/select';
import { channel } from 'rich/net/channel';
import { Avatar } from 'rich/component/view/avator/face';
import { PlusSvg } from 'rich/component/svgs';
import { Icon } from 'rich/component/view/icon';
import lodash from 'lodash';
import { useSelectMenuItem } from 'rich/component/view/menu';
import { Rect } from 'rich/src/common/vector/point';


@observer
export class WorkspaceMembers extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            memebers: observable
        })
    }
    componentDidMount() {
        this.loadMembers();
    }
    async loadMembers() {
        var r = await channel.get('/ws/members', {
            page: this.page,
            size: this.size,
            word: this.word || undefined,
            roleId: this.roleId || undefined
        });
        if (r.ok) {
            runInAction(() => {
                this.page = r.data.page;
                this.size = r.data.size;
                this.total = r.data.total;
                this.memebers = r.data.list;
            })
        }
    }
    roleId: string = '';
    word: string = '';
    memebers: any[] = [];
    page: number = 1;
    size: number = 100;
    total: number = -1;
    async selectRole(member, event: React.MouseEvent) {
        var roles = lodash.cloneDeep(surface.workspace.roles);
        if (Array.isArray(member.roleIds)) {
            roles = roles.findAll(g => !member.roleIds.includes(g.id));
        }
        var r = await useSelectMenuItem(
            { roundArea: Rect.fromEvent(event) },
            roles.map(r => ({ text: r.text, value: r.id }))
        );
        if (r) {
            var g = await channel.patch('/ws/patch/member/roles', {
                userid: member.userid,
                roleIds: [r.item.value]
            });
            if (g.ok) {
                if (!Array.isArray(member.roleIds)) member.roleIds = [];
                member.roleIds.push(r.item.value);
            }
        }
    }
    async removeRole(member, roleId: string, event: React.MouseEvent) {
        if (Array.isArray(member.roleIds)) {
            lodash.remove(member.roleIds, g => g == roleId);
            var g = await channel.patch('/ws/patch/member/roles', {
                userid: member.userid, roleIds: member.roleIds
            });
            if (g.ok) {

            }
        }
    }
    render() {
        var roles = surface.workspace.roles;
        var options = roles.map(r => {
            return {
                text: r.text,
                value: r.id
            }
        });
        options.splice(0, 0, { text: '@所有人', value: '' })
        return <div className='shy-ws-members'>
            <div className="h2">成员</div>
            <Divider></Divider>
            <div className='shy-ws-members-list'>
                <div className='shy-ws-member-head'>
                    <Row style={{ marginBottom: 0 }}>
                        <Col span={6} style={{ height: 30 }} valign={'middle'}>
                            <span style={{ fontSize: 14 }}>{this.total}成员</span>
                        </Col>
                        <Col span={18} style={{ height: 30 }} valign={'middle'} align={'end'}>
                            <Space>
                                <span style={{ fontSize: 14 }}>显示角色:</span>
                                <Select style={{ fontSize: 14 }} value={this.roleId} dropStyle={{ width: 120 }} onChange={e => this.roleId = e} options={options}></Select>
                                <Input style={{ width: 180 }} value={this.word} onChange={e => this.word = e} onEnter={e => this.loadMembers()} placeholder='搜索用户...'></Input>
                            </Space>
                        </Col>
                    </Row>
                </div>
                <Divider></Divider>
                {
                    this.memebers.map(me => {
                        return <div key={me.id} className='shy-ws-member'>
                            <Row style={{ marginBottom: 0 }}>
                                <Col span={8}><Avatar showName size={30} userid={me.userid}></Avatar></Col>
                                <Col span={12}>
                                    <div className='shy-ws-member-roles'>
                                        {(me.roleIds || []).map(r => {
                                            var role = roles.find(g => g.id == r);
                                            if (role) return <a key={r}><span className='color' onMouseDown={e => this.removeRole(me, r, e)} style={{ backgroundColor: role.color }}></span><span className='text'>{role.text}</span></a>
                                            else return <a style={{ display: 'none' }} key={r}></a>
                                        })}
                                        <a><Icon size={12} icon={PlusSvg} onClick={e => this.selectRole(me, e)}></Icon></a>
                                    </div>
                                </Col>
                                <Col span={4} align={"end"}></Col>
                            </Row>
                        </div>
                    })
                }
            </div>
        </div>
    }
}