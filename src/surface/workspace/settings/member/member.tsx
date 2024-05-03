
import React from 'react';
import { Divider } from 'rich/component/view/grid';
import { Input } from 'rich/component/view/input';
import { observer } from 'mobx-react';
import { makeObservable, observable } from 'mobx';
import { surface } from '../../../app/store';
import { channel } from 'rich/net/channel';
import { Avatar } from 'rich/component/view/avator/face';
import { CheckSvg, CloseSvg, PlusSvg } from 'rich/component/svgs';
import { Icon } from 'rich/component/view/icon';
import lodash from 'lodash';
import { useSelectMenuItem } from 'rich/component/view/menu';
import { Rect } from 'rich/src/common/vector/point';
import { ShyAlert } from 'rich/component/lib/alert';
import { SearchListType } from 'rich/component/types';
import { Spin } from 'rich/component/view/spin';
import { Pagination } from 'rich/component/view/pagination';
import { Confirm } from 'rich/component/lib/confirm';
import { ToolTip } from 'rich/component/view/tooltip';
import { lst } from 'rich/i18n/store';
import { S } from 'rich/i18n/view';
import { SelectBox } from 'rich/component/view/select/box';
import { MenuItem, MenuItemType } from 'rich/component/view/menu/declare';
import { HelpText } from 'rich/component/view/text';
import Pic from "../../../../assert/img/four-users.png";

@observer
export class WorkspaceMembers extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            searchList: observable,
            currentRobots: observable
        })
    }
    componentDidMount() {
        (async () => {
            await this.loadCurrentRobots();
            await this.loadMembers();
        })()
    }
    async loadMembers() {
        this.searchList.loading = true;
        try {
            var r = await channel.get('/ws/members', {
                page: this.searchList.page,
                size: this.searchList.size,
                word: this.searchList.word || undefined,
                roleId: this.searchList.roleId || undefined,
                ws: undefined
            });
            if (r.ok) {
                Object.assign(this.searchList, r.data);
                console.log(JSON.stringify(this.searchList))
            }
        }
        catch (ex) {
            this.searchList.error = ex.toString();
        }
        finally {
            this.searchList.loading = false;
        }
    }
    async loadCurrentRobots() {
        var gs = await channel.get('/ws/robots');
        if (gs.ok) {
            this.currentRobots = gs.data.list as any;
            // console.log(JSON.stringify(this.currentRobots))
        }
    }
    searchList: SearchListType<any, { roleId: string }> = {
        list: [],
        page: 1,
        size: 100,
        total: 0,
        word: '',
        roleId: '',
        loading: false,
        error: ''
    }
    async selectRole(member, event: React.MouseEvent) {
        var roles = lodash.cloneDeep(surface.workspace.roles);
        if (Array.isArray(member.roleIds)) {
            roles = roles.findAll(g => !member.roleIds.includes(g.id));
        }
        if (roles.length == 0) return ShyAlert(lst('请添加角色'));
        var r = await useSelectMenuItem(
            { roundArea: Rect.fromEvent(event) },
            roles.map(r => {
                return {
                    text: r.text,
                    value: r.id,
                    renderIcon(item, value) {
                        return <span className='flex size-14 circle' style={{ background: r.color }}></span>
                    }
                }
            })
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
            var g = await channel.del('/ws/user/delete/role', {
                userid: member.userid,
                roleId
            });
            if (g.ok) {
                lodash.remove(member.roleIds, g => g == roleId);
            }
        }
    }
    async removeUser(member) {
        if (await Confirm(lst(`确认要移除成员吗`))) {
            await channel.act('/current/ws/remove/member', { userid: member.userid })
            this.loadMembers();
        }
    }
    getRoleOptions() {
        var roles = surface.workspace.roles;
        var self = this;
        var options: MenuItem<string>[] = roles.map(r => {
            return {
                text: r.text,
                value: r.id,
                type: MenuItemType.custom,
                render(item, view) {
                    return <div className='gap-w-5 h-28 flex item-hover cursor padding-w-5 round'>
                        <span className='flex-fixed size-12 gap-l-4 circle' style={{ background: r.color }}></span>
                        <span className='flex-fixed gap-l-5'>{r.text}</span>
                        {self.searchList.roleId == r.id && <label className='flex-auto flex-end'><Icon className={'gap-r-8'} size={16} icon={CheckSvg}></Icon></label>}
                    </div>
                }
            }
        });
        options.splice(0, 0, { text: lst('@所有人', '@  所有人'), value: '' })
        return options as any;
    }
    render() {
        return <div className='shy-ws-members'>
            <div className="h2">
                <span><S>空间成员</S></span>
                <span className="flex-fixed"><HelpText style={{ fontWeight: 'normal' }} url={window.shyConfig?.isUS ? "https://help.shy.red/page/63#iWy7Gc5ZV47nRLgvzgUsem" : "https://help.shy.live/page/249#qTpYYwfVS37nVbjCebo1mV"}>了解成员管理</HelpText></span>
            </div>
            <Divider></Divider>
            <div className='shy-ws-members-list'>
                <div className='shy-ws-member-head'>
                    <div className='flex'>
                        <div className='flex-fixed'>
                            <span>{this.searchList.total}<S>成员</S></span>
                        </div>
                        <div className='flex-auto flex-end'>
                            <SelectBox border value={this.searchList.roleId} onChange={e => { this.searchList.roleId = e; this.loadMembers() }} options={this.getRoleOptions()}></SelectBox>
                            <Input className={'gap-l-10'} size='small' style={{ width: 180 }} value={this.searchList.word} onChange={e => this.searchList.word = e} onEnter={e => this.loadMembers()} placeholder={lst('搜索用户...')}></Input>
                        </div>
                    </div>
                </div>
                <Divider></Divider>
                {this.searchList.loading && <div className='flex-center gap-h-20'><Spin></Spin></div>}
                {this.searchList.list.map(me => {
                    return <div key={me.id} className='shy-ws-member flex round padding-10 visible-hover'>
                        <div className='flex-fixed w-240'>
                            <Avatar showName middle showSn={false} size={30} userid={me.userid}></Avatar>
                        </div>
                        <div className='flex-auto'>
                            <div className='shy-ws-member-roles'>
                                {(me.roleIds || []).map(r => {
                                    var role = surface.workspace.roles.find(g => g.id == r);
                                    if (role) return <a key={r}>
                                        <span className='color cursor' onMouseDown={e => this.removeRole(me, r, e)} style={{ width: 12, height: 12, backgroundColor: role.color }}></span>
                                        <span className='text'>{role.text}</span>
                                    </a>
                                    else return <a style={{ display: 'none' }} key={r}></a>
                                })}
                                {(me.roleIds || []).length < surface.workspace.roles.length && <ToolTip overlay={<S>添加角色</S>}><span style={{ padding: 0 }} className='cursor size-24 flex-center item-hover item-hover-light-focus round'><Icon size={16} icon={PlusSvg} onClick={e => this.selectRole(me, e)}></Icon></span></ToolTip>}
                            </div>
                        </div>
                        <div className='flex-fixed'>
                            {surface.workspace.owner != me.userid && !this.currentRobots.some(s => s.userid == me.userid) && <ToolTip overlay={<S>移出成员</S>}>
                                <span onMouseDown={e => this.removeUser(me)} className='flex-center size-20 item-hover cursor round visible'>
                                    <Icon size={14} icon={CloseSvg}></Icon>
                                </span>
                            </ToolTip>}
                        </div>
                    </div>
                })
                }
                <div className='gap-h-20'>
                    <Pagination index={this.searchList.page}
                        size={this.searchList.size}
                        total={this.searchList.total} onChange={e => {
                            this.searchList.page = e;
                            this.loadMembers();
                        }}></Pagination>
                </div>
                {this.searchList.total < 10 && <div className='flex-center gap-t-80'>
                    <img src={Pic} className='object-center' style={{ maxWidth: 500 }} />
                </div>}
            </div>
        </div>
    }
    currentRobots: { userid: string }[] = [];
}