import React from 'react';
import { Button } from 'rich/component/view/button';
import { Row, Col, Divider } from 'rich/component/view/grid';
import { surface } from '../../..';
import { observer } from 'mobx-react';
import { makeObservable, observable, runInAction } from 'mobx';
import { User } from '../../user';
import { channel } from 'rich/net/channel';
import { useModifyName } from '../../common/setName';
import { useUpdateEmail } from '../../common/email';
import { useUpdatePhone } from '../../common/phone';
import { useUpdatePaw } from '../../common/setPaw';
import { autoImageUrl } from 'rich/net/element.type';

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
        }
    }
    render() {
        return <div>
            <h2>我的帐号</h2>
            <div className="shy-user-settings-profile-box-card settings" style={{ margin: 20 }}>
                <div className="bg">
                    {!surface.user.cover?.url && <div style={{ height: 100, backgroundColor: surface.user?.cover?.color ? surface.user?.cover?.color : 'rgb(192,157,156)' }}></div>}
                    {surface.user.cover?.url && <img style={{ height: 180 }} src={autoImageUrl(surface.user.cover?.url, 500)} />}
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
            <Row>
                <Col><h5>密码</h5></Col>
                <Col style={{marginTop:10}}><Button onClick={e => this.modifyPwd(e)}>{this.dataUser?.checkPaw ? "修改密码" : "设置密码"}</Button></Col>
            </Row>
            {/*<Row>
                <Col><h5>删除帐户</h5></Col>
                <Col>
                    <Remark>删除帐户后将清理相关的帐号</Remark>
                </Col>
                <Col align='start'>
                    <Button ghost>删除帐户</Button>
                </Col>
            </Row> */}
        </div>
    }
    onUpdate = () => { this.forceUpdate() }
}

