import React from 'react';
import { Button } from 'rich/component/view/button';
import { Row, Col, Divider, Space } from 'rich/component/view/grid';
import { Input } from 'rich/component/view/input';
import { Workspace } from '..';
import { OpenFileDialoug } from 'rich/component/file';
import { Avatar } from '../../../components/face';
import { surface } from '../..';
import { Directive } from 'rich/util/bus/directive';
import { messageChannel } from 'rich/util/bus/event.bus';
import "./style.less";
import { observer } from 'mobx-react';
@observer
export class WorkspaceSettingsView extends React.Component<{ close: () => void }> {
    async onUploadFace() {
        var file = await OpenFileDialoug({ exts: ['image/*'] });
        if (file) {
            var r = await messageChannel.fireAsync(Directive.UploadFile, file, (event) => { });
            if (r.ok) {
                if (r.data.url) {
                    surface.workspace.onUpdateInfo({ icon: { name: 'image', url: r.data.url } })
                }
            }
        }
    }
    data: Partial<Workspace> = {
        text: '',
        slogan: '',
        customizeSecondDomain: '',
    }
    setData(data: WorkspaceSettingsView['data']) {
        if (typeof data.text != 'undefined' && data.text) {
            this.error.text = '';
            if (data.text.length > 30) {
                this.error.text = '呢称过长';
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
        if (typeof data.customizeSecondDomain != 'undefined' && data.customizeSecondDomain) {
            this.error.customizeDomain = '';
            if (data.customizeDomain.length > 30) {
                this.error.customizeDomain = '二级域名不合法';
                return;
            }
        }
        Object.assign(this.data, data);
    }
    error: Partial<Workspace> = {
        text: '',
        slogan: ''
    }
    async onSave() {
        if (this.error.text || this.error.slogan) return;
        await surface.workspace.onUpdateInfo({ text: this.data.text, customizeSecondDomain: this.data.customizeSecondDomain, slogan: this.data.slogan });
        this.onClose();
    }
    onClose() {
        if (typeof this.props.close == 'function')
            this.props.close()
    }
    render() {
        return <div className='shy-settings-content-form'>
            <div className='shy-settings-content-form-main'>
                <Row><h2>空间设置</h2></Row>
                <Divider></Divider>
                <Row>
                    <Col span={12} align='start'><Avatar onClick={() => this.onUploadFace()} size={70} text={surface.workspace.text} icon={surface.workspace.icon}></Avatar></Col>
                    <Col span={12} align='end'><Button onClick={() => this.onUploadFace()}>上传图片</Button></Col>
                </Row>
                <Divider></Divider>
                <Row>
                    <Col span={24}><h5>工作空间名称</h5></Col>
                    <Col span={24}><label>点击输入框可修改名称</label></Col>
                    <Col span={24}><Input value={surface.workspace.text} onChange={e => this.setData({ text: e })} placeholder={'请输入你的工作空间名称'}></Input></Col>
                </Row>
                <Divider></Divider>
                <Row>
                    <Col><h5>空间域名</h5></Col>
                    <Col><label>设置你的专属工作空间域名</label></Col>
                    <Col>
                        <div className='shy-ws-settings-view-domain'>
                            <a style={{ textDecoration: 'underline', color: 'inherit' }} href={'https://' + (surface.workspace.customizeDomain || surface.workspace.sn) + '.shy.live'}>https://{surface.workspace.customizeDomain || surface.workspace.sn}.shy.live</a>
                            <Button link>更换空间域名</Button>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className='shy-settings-content-form-footer'>
                <Space align='end' style={{ height: '100%' }}>
                    <Button onClick={e => this.onClose()} ghost >取消</Button>
                    <Button onClick={e => this.onSave()}>保存</Button>
                </Space>
            </div>
        </div>
    }
}