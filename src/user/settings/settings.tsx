import React from 'react';
import { Button } from 'rich/component/button';
import { Row, Col, Divider, Space } from 'rich/component/grid';
import { Input } from 'rich/component/input';
import { Avatar } from '../../components/face';
import { surface } from '../../surface';
export class UserSettingsView extends React.Component {
    render() {
        return <div className='shy-settings-content-form'>
            <div className='shy-settings-content-form-main'>
                <Row><h2>个人信息</h2></Row>
                <Divider></Divider>
                <Row>
                    <Col span={12} align='start'><Avatar size={70} text={surface.user.name} icon={surface.user.avatar}></Avatar></Col>
                    <Col span={12} align='end'><Button>上传图片</Button></Col>
                </Row>
                <Divider></Divider>
                <Row>
                    <h5>昵称</h5>
                    <label>点击输入框可修改名称</label>
                    <Input placeholder={'请输入你的工作空间名称'}></Input>
                </Row>
                <Divider></Divider>
                <Row>
                    <Col><h5>手机号</h5></Col>
                    <Col><label>未验证</label></Col>
                    <Col><span>{surface.user.phone}</span></Col><Col><Button>更改手机号</Button></Col>
                </Row>
                <Divider></Divider>
                <Row>
                    <Col><h5>邮箱</h5></Col>
                    <Col> <label>未验证</label></Col>
                    <Col><span>{surface.user.email}</span></Col><Col>
                        <Button>发送验证邮箱</Button>
                        <Button>更改邮箱</Button>
                    </Col>
                </Row>
                <Divider></Divider>
                <Row>
                    <Col><h5>密码</h5></Col>
                    <Col> <label>未设置</label></Col>
                    <Col><span>{surface.user.email}</span></Col>
                    <Col>
                        <Button>更换密码</Button>
                    </Col>
                </Row>
            </div>
            <div className='shy-settings-content-form-footer'>
                <Space align='end' style={{height:'100%'}}><Button>取消</Button><Button>保存</Button></Space>
            </div>
        </div>
    }
}