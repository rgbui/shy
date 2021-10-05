import React from 'react';
import { Button } from 'rich/component/view/button';
import { Row, Col, Divider, Space } from 'rich/component/view/grid';
import { Input, Textarea } from 'rich/component/view/input';
import { OpenFileDialoug } from 'rich/component/file';
import { Directive } from 'rich/util/bus/directive';
import { messageChannel } from 'rich/util/bus/event.bus';
import { Avatar } from '../../../components/face';
import { surface } from '../../surface';
import { User } from '../user';

export class UserSettingsView extends React.Component<{ close?: () => void }> {
    async onUploadFace() {
        var file = await OpenFileDialoug({ exts: ['image/*'] });
        if (file) {
            var r = await messageChannel.fireAsync(Directive.UploadFile, file, (event) => { });
            if (r.ok) {
                if (r.data.url) {
                    surface.user.onUpdateUserInfo({ avatar: { name: 'image', url: r.data.url } })
                }
            }
        }
    }
    data: Partial<User> = {
        name: '',
        slogan: ''
    }
    setData(data: UserSettingsView['data']) {
        if (typeof data.name != 'undefined' && data.name) {
            this.error.name = '';
            if (data.name.length > 10) {
                this.error.name = '呢称过长';
                return;
            }
        }
        if (typeof data.slogan != 'undefined' && data.slogan) {
            this.error.slogan = '';
            if (data.slogan.length > 140) {
                this.error.slogan = '介绍过长,不能超过140个字符';
                return;
            }
        }
        Object.assign(this.data, data);
    }
    error: Partial<User> = {
        name: '',
        slogan: ''
    }
    componentDidMount() {
        this.data.name = surface.user.name;
        this.data.slogan = surface.user.slogan;
        messageChannel.on(Directive.UpdateUser, this.onUpdate)
    }
    componentWillUnmount() {
        messageChannel.off(Directive.UpdateUser, this.onUpdate)
    }
    async onSave() {
        if (this.error.name || this.error.slogan) return;
        await surface.user.onUpdateUserInfo({ name: this.data.name, slogan: this.data.slogan });
        this.onClose();
    }
    onClose() {
        if (typeof this.props.close == 'function')
            this.props.close()
    }
    render() {
        return <div className='shy-settings-content-form'>
            <div className='shy-settings-content-form-main'>
                <Row><h2>个人信息</h2></Row>
                <Divider></Divider>
                <Row>
                    <Col span={12} align='start'><Avatar onClick={e => this.onUploadFace()} size={70} text={surface.user.name} icon={surface.user.avatar}></Avatar></Col>
                    <Col span={12} align='end'><Button onClick={e => this.onUploadFace()}>上传图片</Button></Col>
                </Row>
                <Divider></Divider>
                <Row>
                    <h5>昵称</h5>
                    <label>点击输入框可修改名称</label>
                    <Input value={surface.user.name} onChange={e => this.data.name = e} placeholder={'请输入你的工作空间名称'}></Input>
                    {this.error.name && <span className='error'>{this.error.name}</span>}
                </Row>
                <Divider></Divider>
                <Row>
                    <h5>一句话介绍</h5>
                    <Textarea value={surface.user.slogan} onChange={e => this.data.slogan = e} placeholder={'简单介绍自已'}></Textarea>
                    {this.error.slogan && <span className='error'>{this.error.slogan}</span>}
                </Row>
                <Divider></Divider>
                <Row>
                    <Col><h5>手机号</h5></Col>
                    <Col><label>未验证</label></Col>
                    <Col><span>{surface.user.phone}</span></Col><Col><Button>更改手机号</Button></Col>
                </Row>
                <Divider></Divider>
                {/*<Row>
                    <Col><h5>邮箱</h5></Col>
                    <Col><label>未验证</label></Col>
                    <Col><span>{surface.user.email}</span></Col><Col>
                        <Button>发送验证邮箱</Button>
                        <Button>更改邮箱</Button>
                    </Col>
                </Row>
                <Divider></Divider>*/}
                {/* <Row>
                    <Col><h5>密码</h5></Col>
                    <Col> <label>未设置</label></Col>
                    <Col><span>{surface.user.email}</span></Col>
                    <Col>
                        <Button>更换密码</Button>
                    </Col>
                </Row> */}
            </div>
            <div className='shy-settings-content-form-footer'>
                <Space align='end' style={{ height: '100%' }}><Button onClick={() => this.onClose()} >取消</Button><Button onClick={() => this.onSave()}>保存</Button></Space>
            </div>
        </div>
    }
    onUpdate = () => { this.forceUpdate() }
}