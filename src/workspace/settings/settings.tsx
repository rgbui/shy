import React from 'react';
import { Button } from 'rich/component/button';
import { Row, Col, Divider, Space } from 'rich/component/grid';
import { Input } from 'rich/component/input';
import { Avatar } from '../../components/face';
import { surface } from '../../surface';
export class WorkspaceSettingsView extends React.Component {
    render() {
        return <div className='shy-settings-content-form'>
            <div className='shy-settings-content-form-main'>
                <Row><h2>空间设置</h2></Row>
                <Divider></Divider>
                <Row>
                    <Col span={12} align='start'><Avatar size={70} text={surface.workspace.text} icon={surface.workspace.icon}></Avatar></Col>
                    <Col span={12} align='end'><Button>上传图片</Button></Col>
                </Row>
                <Divider></Divider>
                <Row>
                    <h5>工作空间名称</h5>
                    <label>点击输入框可修改名称</label>
                    <Input placeholder={'请输入你的工作空间名称'}></Input>
                </Row>
                <Divider></Divider>
                <Row>
                    <h5>空间域名</h5>
                    <label>设置你的专属工作空间域名:https://domain.shy.live</label>
                    <div className='shy-ws-settings-view-domain'>
                        <span>https://</span>
                        <Input placeholder={'domain'} style={{ width: 180 }}></Input>
                        <span>.shy.live</span>
                    </div>
                </Row>
            </div>
            <div className='shy-settings-content-form-footer'>
                <Space align='end' style={{ height: '100%' }}><Button>取消</Button><Button>保存</Button></Space>
            </div>
        </div>
    }
}