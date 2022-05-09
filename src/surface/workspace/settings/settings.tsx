import React from 'react';
import { Button } from 'rich/component/view/button';
import { Row, Col, Divider, Space } from 'rich/component/view/grid';
import { Input, Textarea } from 'rich/component/view/input';
import { OpenFileDialoug } from 'rich/component/file';
import { surface } from '../..';
import "./style.less";
import { observer } from 'mobx-react';
import { channel } from 'rich/net/channel';
import { useSetWsDomain } from '../../user/common/setDomain';
import { Remark } from 'rich/component/view/text';
import { SaveTip } from '../../../component/tip/save.tip';
import { makeObservable, observable, runInAction } from 'mobx';

@observer
export class WorkspaceSettingsView extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            data: observable,
            error: observable
        })
    }
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
    async openDomain(event: React.MouseEvent) {
        var r = await useSetWsDomain(surface.workspace.id, '');
        if (r) {
            surface.workspace.siteDomain = r;
        }
    }
    data = {
        text: '',
        slogan: '',
    }
    setData(data: { text?: string, slogan?: string }) {
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
        Object.assign(this.data, data);

        if (this.tip) this.tip.open();
    }
    error = {
        text: '',
        slogan: ''
    }
    componentDidMount() {
        this.data = { text: surface.workspace.text, slogan: surface.workspace.slogan };
        this.forceUpdate();
    }
    tip: SaveTip;
    async save() {
        var r = await channel.patch('/ws/patch', { data: this.data });
        if (r.ok) {
            surface.workspace.text = this.data.text;
            surface.workspace.slogan = this.data.slogan;
            this.tip.close();
        }
    }
    reset() {
        runInAction(() => {
            this.data = { text: surface.workspace.text, slogan: surface.workspace.slogan };
            this.error = { text: '', slogan: '' };
            this.tip.close();
        })
    }
    render() {
        return <div>
            <SaveTip ref={e => this.tip = e} save={e => this.save()} reset={e => this.reset()}></SaveTip>
            <h2>工作空间</h2>
            <Divider></Divider>
            <Row>
                <Col span={12}><h5 style={{ marginBottom: 10 }}>空间头像</h5></Col>
                <Col span={12}><h5 style={{ marginBottom: 10 }}>空间横幅背景</h5></Col>
                <Col span={12}>
                    <Space>
                        <div className='shy-settings-ws-avatar' onClick={() => this.onUploadFace()} >
                            {surface.workspace.icon && <img src={surface.workspace.icon.url} />}
                            {!surface.workspace.icon && <span>{surface.workspace.text.slice(0, 1)}</span>}
                            <div className='shy-settings-ws-avatar-hover'>添加图片</div>
                        </div>
                        <div>
                            <p>我们建议使用至少 200x200 大小的图片。</p>
                            <Button ghost onClick={e => this.onUploadFace()}>上传图片</Button>
                        </div>
                    </Space>
                </Col>
                <Col span={12}>
                    <div className='shy-settings-ws-cover' onClick={() => this.onUploadCover()} >
                        {surface.workspace.cover && <img src={surface.workspace.cover.url} />}
                        <div className='shy-settings-ws-cover-hover'>更换横幅</div>
                    </div>
                    {!surface.workspace.cover && <Button onClick={() => this.onUploadCover()}>上传横幅背景</Button>}
                </Col>
            </Row>
            <Divider></Divider>
            <Row>
                <Col span={24}><h5>工作空间名称</h5></Col>
                <Col span={24}><Remark>点击输入框可修改名称</Remark></Col>
                <Col span={24}><Input value={this.data.text} onChange={e => this.setData({ text: e })} placeholder={'请输入你的工作空间名称'}></Input></Col>
            </Row>
            <Divider></Divider>
            <Row>
                <Col span={24}><h5>工作空间描述</h5></Col>
                <Col span={24}><Remark>点击输入框可修改名称</Remark></Col>
                <Col span={24}><Textarea value={this.data.slogan} onChange={e => this.setData({ slogan: e })} placeholder={'请输入你的工作空间描述'}></Textarea></Col>
            </Row>
            <Divider></Divider>
            <Row>
                <Col><h5>空间域名</h5></Col>
                <Col>
                    <div className='shy-ws-settings-view-domain'>
                        <a style={{ textDecoration: 'underline', color: 'inherit' }} href={'https://' + (surface.workspace.siteDomain || surface.workspace.sn) + '.shy.live'}>https://{surface.workspace.siteDomain || surface.workspace.sn}.shy.live</a>
                        {!surface.workspace.siteDomain && <Button onClick={e => this.openDomain(e)} link>更换空间域名</Button>}
                    </div>
                </Col>
            </Row>
        </div>
    }
}