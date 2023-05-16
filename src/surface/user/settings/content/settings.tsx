import React from 'react';
import { Button } from 'rich/component/view/button';
import { Row, Col, Divider } from 'rich/component/view/grid';
import { surface } from '../../../store';
import { observer } from 'mobx-react';
import { makeObservable, observable, runInAction } from 'mobx';
import { User } from '../../user';
import { channel } from 'rich/net/channel';
import { useModifyName } from '../../common/setName';
import { useUpdateEmail } from '../../common/email';
import { useUpdatePhone } from '../../common/phone';
import { useUpdatePaw } from '../../common/setPaw';
import { autoImageUrl } from 'rich/net/element.type';
import { ShyAlert } from 'rich/component/lib/alert';
import { InviteCode } from '../task/inviteCode';

@observer
export class UserSettingsView extends React.Component<{ close?: () => void, setMode(): void }> {
    constructor(props) {
        super(props);
        makeObservable(this, {
            dataUser: observable
        })
    }
    dataUser: Partial<User> = null;
    componentDidMount() {
        channel.get('/user/query').then(r => {
            if (r.ok && r.data && r.data.user) {
                this.dataUser = r.data.user;
            }
        })
    }
    async modifyUserName(event: React.MouseEvent) {
        await useModifyName()
    }
    async modifyEmail(event: React.MouseEvent) {
        var r = await useUpdateEmail({ email: this.dataUser.email });
        if (r) {
            runInAction(() => {
                this.dataUser.email = r;
                this.dataUser.checkEmail = true;
            })
        }
    }
    async modifyPhone(event: React.MouseEvent) {
        var r = await useUpdatePhone({ phone: this.dataUser.phone });
        if (r) {
            runInAction(() => {
                this.dataUser.phone = r;
                this.dataUser.checkPhone = true;
            })
        }
    }
    async modifyPwd(event: React.MouseEvent) {
        var r = await useUpdatePaw({ checkPaw: this.dataUser.checkPaw });
        if (r) {
            this.dataUser.checkPaw = true;
            ShyAlert('密码设置成功')
        }
    }
    render() {
        return <div>
            <h2 className="h2">我的帐号</h2>
            <Divider></Divider>
            <div className="shy-user-settings-profile-box-card settings" style={{ margin: '20px 0px' }}>
                <div className="bg">
                    {!surface.user.cover?.url && <div style={{ height: 100, backgroundColor: surface.user?.cover?.color ? surface.user?.cover?.color : 'rgb(192,157,156)' }}></div>}
                    {surface.user.cover?.url && <img style={{ height: 180 }} src={autoImageUrl(surface.user.cover?.url, 900)} />}
                </div>
                <div className='shy-settings-user-avatar' style={{ top: surface.user.cover?.url ? 180 : 100 }}>
                    {surface.user?.avatar && <img src={autoImageUrl(surface.user.avatar.url, 120)} />}
                    {!surface.user?.avatar && <span>{surface.user.name.slice(0, 1)}</span>}
                </div>
                <div className="shy-user-settings-profile-box-card-operators">
                    <h2>{surface.user.name}#{surface.user.sn}</h2>
                    <Button onClick={e => this.props.setMode()}>编辑个人资料</Button>
                </div>
                <div className="shy-user-settings-profile-box-card-options">
                    <Row>
                        <Col span={24}><span>用户名</span></Col>
                        <Col span={12}>{surface.user?.name}#{surface.user?.sn}</Col><Col span={12} align={'end'}><Button onClick={e => this.modifyUserName(e)}>编辑</Button></Col>
                    </Row>
                    <Row>
                        <Col span={24}><span>电子邮箱</span></Col>
                        <Col span={12}><span>{this.dataUser?.email || '您还没有添加邮箱'}</span></Col><Col span={12} align={'end'}><Button onClick={e => this.modifyEmail(e)}>{this.dataUser?.checkEmail ? '更换' : '新增'}</Button></Col>
                    </Row>
                    <Row>
                        <Col span={24}><span>手机号</span></Col>
                        <Col span={12}><span>{this.dataUser?.phone || '您还没有添加手机号'}</span></Col><Col span={12} align={'end'}><Button onClick={e => this.modifyPhone(e)}>{this.dataUser?.checkPhone ? '更换' : '新增'}</Button></Col>
                    </Row>
                </div>
            </div>
            <Divider></Divider>
            <div className='gap-h-30 gap-t-40'>
                <div className='h4'>邀请好友</div>
                <InviteCode></InviteCode>
            </div>
            <div className='gap-h-30'>
                <div className='h4'>密码</div>
                <div className='remark f-12'>设置帐号的登录密码</div>
                <div className='gap-h-10'>
                    <Button onClick={e => this.modifyPwd(e)}>{this.dataUser?.checkPaw ? "修改密码" : "设置密码"}</Button>
                </div>
            </div>
            <div className='gap-h-30'>
                <div className='h4'>注销帐号</div>
                <div className='remark f-12'>注销帐号将清理帐号相关的信息</div>
                <div className='gap-h-10'>
                    <Button onClick={e => ShyAlert('暂时不支持注销帐号')} ghost>注销帐号</Button>
                </div>
            </div>
        </div>
    }
    onUpdate = () => { this.forceUpdate() }
}

