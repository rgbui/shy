import React from 'react';
import { Button } from 'rich/component/view/button/index';
import { Divider, Space } from 'rich/component/view/grid';
import { Input } from 'rich/component/view/input';
import { OpenFileDialoug } from 'rich/component/file';
import { surface } from '../../store';
import "./style.less";
import { observer } from 'mobx-react';
import { channel } from 'rich/net/channel';
import { useSetWsDomain } from '../../user/common/setDomain';
import { SaveTip } from '../../../component/tip/save.tip';
import { makeObservable, observable, runInAction } from 'mobx';
import { autoImageUrl } from 'rich/net/element.type';
import { Textarea } from 'rich/component/view/input/textarea';
import { ShyAlert } from 'rich/component/lib/alert';
import { fileSock, masterSock } from '../../../../net/sock';
import { useForm } from 'rich/component/view/form/dialoug';
import { ShyUrl, UrlRoute } from '../../../history';

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
    async onRemoveCover() {
        surface.workspace.onUpdateInfo({ cover: null })
    }
    async openDomain(event: React.MouseEvent) {
        ShyAlert('该功能暂不开放')
        return;
        var r = await useSetWsDomain(surface.workspace.id, '');
        if (r) {
            surface.workspace.siteDomain = r;
        }
    }
    async createWorkspaceTemplate(event: React.MouseEvent) {
        if (surface.workspace.sn == 24) {
            var g = await surface.workspace.sock.post('/create/template', { wsId: surface.workspace.id })
            if (g.ok) {
                var r = await fileSock.post('/download/file', { url: g.data.url });
                if (r.ok) {
                    await masterSock.post('/create/workspace/template', {
                        wsId: surface.workspace.id,
                        templateUrl: r.data.file.url,
                        text: surface.workspace.text,
                        description: surface.workspace.slogan,
                        file: r.data.file
                    });
                }
            }
        }
        else ShyAlert('该功能暂不开放')
    }
    async cancelWorkspace(event: React.MouseEvent) {
        var r = await useForm({
            title: '注销空间',
            remark: `输入注销空间的名称[${surface.workspace.text}]`,
            fields: [{ name: 'name', type: 'input', text: '空间名称' }]
        });
        if (r?.name == surface.workspace.text) {
            var g = await surface.workspace.sock.delete('/ws/clear/all', { wsId: surface.workspace.id });
            if (g.ok) {
                var rg = await masterSock.delete('/ws/clear', { wsId: surface.workspace.id });
                if (rg.ok) {
                    UrlRoute.push(ShyUrl.myWorkspace)
                }
            }
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
            <div className="h2">工作空间</div>
            <Divider></Divider>
            <div className='gap-h-10'>
                <div className='bold f-14'>空间头像</div>
                <div className='remark f-12 gap-h-10'></div>
                <div>
                    <Space valign='start'>
                        <div className='shy-settings-ws-avatar' onClick={() => this.onUploadFace()} >
                            {surface.workspace.icon && <img className='w100 h100 circle' src={autoImageUrl(surface.workspace.icon.url, 120)} />}
                            {!surface.workspace.icon && <span className='w100 h100 circle flex-center'>{surface.workspace.text.slice(0, 1)}</span>}
                            <div className='shy-settings-ws-avatar-hover'>添加图片</div>
                        </div>
                        <div>
                            <p style={{ fontSize: 12, marginBottom: 10 }}>建议使用 200x200 以上的图片。</p>
                            <Button ghost onClick={e => this.onUploadFace()}>上传图片</Button>
                        </div>
                    </Space>
                </div>
            </div>

            <Divider></Divider>
            <div className='gap-h-10'>
                <div className='bold f-14'>空间名称</div>
                <div className='remark f-12 gap-h-10'>修改空间名称</div>
                <div className='max-w-500'>
                    <Input value={this.data.text} onChange={e => this.setData({ text: e })} placeholder={'请输入你的工作空间名称'}></Input>
                </div>
            </div>
            <Divider></Divider>
            <div className='gap-h-10'>
                <div className='bold f-14'>空间横幅背景</div>
                <div className='remark f-12 gap-h-10'>更换控间横幅</div>
                <div className='flex flex-top'>
                    {surface.workspace.cover && <div className='shy-settings-ws-cover' onClick={() => this.onUploadCover()} >
                        {surface.workspace.cover && <img src={autoImageUrl(surface.workspace.cover.url, 500)} />}
                        <div className='shy-settings-ws-cover-hover'>更换横幅</div>
                    </div>}
                    {surface.workspace.cover && <Button className='gap-l-10' ghost onClick={() => this.onRemoveCover()}>移除横幅背景</Button>}
                    {!surface.workspace.cover && <Button ghost onClick={() => this.onUploadCover()}>上传横幅背景</Button>}
                </div>
            </div>
            <Divider></Divider>
            <div className='gap-h-10'>
                <div className='bold f-14'>工作空间描述</div>
                <div className='remark f-12 gap-h-10'>修改工作空间描述</div>
                <div className='max-w-500'>
                    <Textarea value={this.data.slogan} onChange={e => this.setData({ slogan: e })} placeholder={'请输入你的工作空间描述'}></Textarea>
                </div>
            </div>
            <Divider></Divider>
            <div className='gap-h-10'>
                <div className='bold f-14'>空间域名</div>
                <div className='remark f-12 gap-h-10'>自定义空间二级域名(暂不开放）</div>
                <div className='shy-ws-settings-view-domain'>
                    <a style={{ textDecoration: 'underline', color: 'inherit', display: 'inline-block', marginRight: 10 }} href={'https://' + (surface.workspace.siteDomain || surface.workspace.sn) + '.shy.live'}>https://{surface.workspace.siteDomain || surface.workspace.sn}.shy.live</a>
                    {!surface.workspace.siteDomain && <Button onClick={e => this.openDomain(e)} ghost>更换空间域名</Button>}
                </div>
            </div>
            <Divider></Divider>
            <div className='gap-h-10'>
                <div className='bold f-14'>导出数据</div>
                <div className='remark f-12 gap-h-10'>导出空间所有的数据(暂不开放）</div>
                <div className='shy-ws-settings-view-domain'>
                    <Button onClick={e => this.createWorkspaceTemplate(e)} ghost>导出数据</Button>
                </div>
            </div>
            <Divider></Divider>
            <div className='gap-h-10'>
                <div className='bold f-14'>注销空间</div>
                <div className='remark f-12 gap-h-10'>注销空间不可撤消，空间内的数据将自动清理</div>
                <div className='shy-ws-settings-view-domain'>
                    <Button onClick={e => this.cancelWorkspace(e)} ghost>注销空间</Button>
                </div>
            </div>
        </div>
    }
}