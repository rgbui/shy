import React from 'react';
import { Button } from 'rich/component/view/button';
import { Row, Col, Divider } from 'rich/component/view/grid';
import { Input, Textarea } from 'rich/component/view/input';
import { Workspace } from '..';
import { OpenFileDialoug } from 'rich/component/file';
import { surface } from '../..';
import "./style.less";
import { observer } from 'mobx-react';
import { channel } from 'rich/net/channel';

@observer
export class WorkspaceSettingsView extends React.Component {
    async onUploadFace() {
        var file = await OpenFileDialoug({ exts: ['image/*'] });
        if (file) {
            var r = await channel.post('/user/upload/file', { file, uploadProgress: (event) => { } })
            if (r.ok) {
                if (r.data.file.url) {
                    surface.workspace.onUpdateInfo({ icon: { name: 'image', url: r.data.file.url } })
                }
            }
        }
    }
    async onUploadCover() {
        var file = await OpenFileDialoug({ exts: ['image/*'] });
        if (file) {
            var r = await channel.post('/user/upload/file', { file, uploadProgress: (event) => { } })
            if (r.ok) {
                if (r.data.file.url) {
                    surface.workspace.onUpdateInfo({ cover: { name: 'image', url: r.data.file.url } })
                }
            }
        }
    }
    data: Partial<Workspace> = {
        text: '',
        slogan: '',
        siteDomain: '',
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
        if (typeof data.siteDomain != 'undefined' && data.siteDomain) {
            this.error.siteDomain = '';
            if (data.siteDomain.length > 30) {
                this.error.siteDomain = '二级域名不合法';
                return;
            }
        }
        Object.assign(this.data, data);
    }
    error: Partial<Workspace> = {
        text: '',
        slogan: ''
    }
    render() {
        return <div>
            <h1>工作空间</h1>
            <Row>
                <Col span={12}><h5>空间头像</h5></Col>
                <Col span={12}><h5>空间横幅背景</h5></Col>
                <Col span={12}>
                    <div className='shy-settings-ws-avatar' onClick={() => this.onUploadFace()} >
                        {surface.workspace.icon && <img src={surface.workspace.icon.url} />}
                        {!surface.workspace.icon && <span>{surface.workspace.text.slice(0, 1)}</span>}
                    </div>
                </Col>
                <Col span={12}>
                    <div className='shy-settings-ws-cover' onClick={() => this.onUploadCover()} >
                        {surface.workspace.cover && <img src={surface.workspace.cover.url} />}
                    </div>
                    {!surface.workspace.cover && <Button onClick={() => this.onUploadCover()}>上传横幅背景</Button>}
                </Col>
            </Row>
            <Divider></Divider>
            <Row>
                <Col span={24}><h5>工作空间名称</h5></Col>
                <Col span={24}><label>点击输入框可修改名称</label></Col>
                <Col span={24}><Input value={this.data.text || surface.workspace.text} onChange={e => this.setData({ text: e })} placeholder={'请输入你的工作空间名称'}></Input></Col>
            </Row>
            <Divider></Divider>
            <Row>
                <Col span={24}><h5>工作描述</h5></Col>
                <Col span={24}><label>点击输入框可修改名称</label></Col>
                <Col span={24}><Textarea value={this.data.slogan || surface.workspace.slogan} onChange={e => this.setData({ text: e })} placeholder={'请输入你的工作空间名称'}></Textarea></Col>
            </Row>
            <Divider></Divider>
            <Row>
                <Col><h5>空间域名</h5></Col>
                <Col>
                    <div className='shy-ws-settings-view-domain'>
                        <a style={{ textDecoration: 'underline', color: 'inherit' }} href={'https://' + (surface.workspace.siteDomain || surface.workspace.sn) + '.shy.live'}>https://{surface.workspace.siteDomain || surface.workspace.sn}.shy.live</a>
                        <Button link>更换空间域名</Button>
                    </div>
                </Col>
            </Row>
        </div>
    }
}