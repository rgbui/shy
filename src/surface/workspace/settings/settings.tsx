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
import { useSetCustomDomain } from "../../user/common/setCustomDomain";
import { SaveTip } from '../../../component/tip/save.tip';
import { makeObservable, observable, runInAction } from 'mobx';
import { autoImageUrl } from 'rich/net/element.type';
import { Textarea } from 'rich/component/view/input/textarea';
import { ShyAlert } from 'rich/component/lib/alert';
import { fileSock, masterSock } from '../../../../net/sock';
import { useForm } from 'rich/component/view/form/dialoug';
import { ShyUrl, UrlRoute } from '../../../history';
import { lst } from 'rich/i18n/store';
import { S } from 'rich/i18n/view';
import { config } from '../../../../common/config';

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
        var us = await surface.user.wallet();
        if (config.isDev || config.isBeta || !us.isDue && (us.meal == 'meal-1' || us.meal == 'meal-2')) {
            var r = await useSetWsDomain(surface.workspace.id, '');
            if (r) {
                surface.workspace.siteDomain = r;
            }
        }
        else {
            ShyAlert(lst('需要开通专业版才能自定义空间二级域名'))
            return;
        }
    }
    async openCustomDomain(event: React.MouseEvent) {
        var us = await surface.user.wallet();
        if (config.isDev || config.isBeta || !us.isDue && (us.meal == 'meal-1' || us.meal == 'meal-2')) {
            await useSetCustomDomain(surface.workspace);
        }
        else {
            ShyAlert(lst('需要开通专业版才能支持自定义域名'))
            return;
        }
    }
    async createWorkspaceTemplate(event: React.MouseEvent) {
        if (surface.workspace.sn == 24 || window.shyConfig.isDev) {
            var g = await surface.workspace.sock.post('/create/template', { wsId: surface.workspace.id })
            if (g.ok) {
                var r = await fileSock.post('/download/file', { url: g.data.file.url });
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
        else ShyAlert(lst('该功能暂不开放'))
    }
    async cancelWorkspace(event: React.MouseEvent) {
        var r = await useForm({
            title: lst('注销空间'),
            remark: lst(`输入注销空间的名称[{text}]`, { text: surface.workspace.text }),
            fields: [{ name: 'name', type: 'input', text: lst('空间名称') }]
        });
        if (r?.name == surface.workspace.text) {
            var g = await surface.workspace.sock.delete('/ws/clear/all', { wsId: surface.workspace.id });
            if (g.ok) {
                var rg = await masterSock.delete('/ws/clear', { wsId: surface.workspace.id });
                if (rg.ok) {
                    UrlRoute.push(ShyUrl.home)
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
                this.error.text = lst('呢称过长');
                return;
            }
        }
        if (typeof data.slogan != 'undefined' && data.slogan) {
            this.error.slogan = '';
            if (data.slogan.length > 140) {
                this.error.slogan = lst('介绍过长,不能超过140个字符');
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
    nameInput: Input;
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
            if (this.nameInput) this.nameInput.updateValue(this.data.text);
            this.tip.close();
        })
    }
    render() {
        var domain = surface.workspace.siteDomain || surface.workspace.sn;
        return <div>
            <SaveTip ref={e => this.tip = e} save={e => this.save()} reset={e => this.reset()}></SaveTip>
            <div className="h2"><S>工作空间</S></div>
            <Divider></Divider>
            <div className='gap-h-10'>
                <div className='bold f-14'><S>空间头像</S></div>
                <div className='remark f-12 gap-h-10'></div>
                <div>
                    <Space valign='start'>
                        <div className='shy-settings-ws-avatar' onClick={() => this.onUploadFace()} >
                            {surface.workspace.icon && <img className='w100 h100 circle' src={autoImageUrl(surface.workspace.icon.url, 120)} />}
                            {!surface.workspace.icon && <span className='w100 h100 circle flex-center'>{surface.workspace.text.slice(0, 1)}</span>}
                            <div className='shy-settings-ws-avatar-hover'><S>添加图片</S></div>
                        </div>
                        <div>
                            <p style={{ fontSize: 12, marginBottom: 10 }}><S text='建议使用200x200以上的图片'>建议使用 200x200 以上的图片。</S></p>
                            <Button ghost onClick={e => this.onUploadFace()}><S>上传图片</S></Button>
                        </div>
                    </Space>
                </div>
            </div>

            <Divider></Divider>
            <div className='gap-h-10'>
                <div className='bold f-14'><S>空间名称</S></div>
                <div className='remark f-12 gap-h-10'><S>修改空间名称</S></div>
                <div className='max-w-500'>
                    <Input ref={e => this.nameInput = e} value={this.data.text} onChange={e => this.setData({ text: e })} placeholder={lst('请输入你的工作空间名称')}></Input>
                </div>
            </div>
            <Divider></Divider>
            <div className='gap-h-10'>
                <div className='bold f-14'><S>空间横幅背景</S></div>
                <div className='remark f-12 gap-h-10'><S>更换控间横幅</S></div>
                <div className='flex flex-top'>
                    {surface.workspace.cover && <div className='shy-settings-ws-cover' onClick={() => this.onUploadCover()} >
                        {surface.workspace.cover && <img src={autoImageUrl(surface.workspace.cover.url, 500)} />}
                        <div className='shy-settings-ws-cover-hover'><S>更换横幅</S></div>
                    </div>}
                    {surface.workspace.cover && <Button className='gap-l-10' ghost onClick={() => this.onRemoveCover()}><S>移除横幅背景</S></Button>}
                    {!surface.workspace.cover && <Button ghost onClick={() => this.onUploadCover()}><S>上传横幅背景</S></Button>}
                </div>
            </div>
            <Divider></Divider>
            <div className='gap-h-10'>
                <div className='bold f-14'><S>工作空间描述</S></div>
                <div className='remark f-12 gap-h-10'><S>修改工作空间描述</S></div>
                <div className='max-w-500'>
                    <Textarea value={this.data.slogan} onChange={e => this.setData({ slogan: e })} placeholder={lst('请输入你的工作空间描述')}></Textarea>
                </div>
            </div>
            <Divider></Divider>
            <div className='gap-h-10'>
                <div className='bold f-14'><S>空间域名</S></div>
                <div className='remark f-12 gap-h-10 flex'><S>默认</S>:<a className='link-remark underline gap-r-5' target='_blank' href={'https://' + surface.workspace.sn + '.' + UrlRoute.getHost()}>{'https://' + surface.workspace.sn + '.' + UrlRoute.getHost()}</a></div>
                {surface.workspace.siteDomain && <div className='shy-ws-settings-view-domain'>
                    <S>二级域名</S>:
                    <a style={{ textDecoration: 'underline', color: 'inherit', display: 'inline-block', marginRight: 10 }} target='_blank' href={'https://' + domain + '.' + UrlRoute.getHost()}>https://{domain}.{UrlRoute.getHost()}</a>
                </div>}
                {!surface.workspace.siteDomain && <div className='gap-t-20'>
                    <Button onClick={e => this.openDomain(e)} ghost><S>自定义二级域名</S></Button>
                    <div className='remark f-12 gap-h-10 flex'><S>示例</S>:https://mysite.{UrlRoute.getHost()}</div>
                </div>}
                {surface.workspace.customSiteDomain && <div style={{ marginTop: 20 }} className='shy-ws-settings-view-domain'>
                    <S>自定义域名</S>:
                    <a style={{ textDecoration: 'underline', color: 'inherit', display: 'inline-block', marginRight: 10 }} target='_blank' href={`http${surface.workspace.customSiteDomainProtocol ? "s" : ""}://` + surface.workspace.customSiteDomain}>http{surface.workspace.customSiteDomainProtocol ? "s" : ""}://{surface.workspace.customSiteDomain}</a>
                    <a className='link cursor gap-l-5' onClick={e => this.openCustomDomain(e)}><S>更换</S></a>
                </div>}
                {!surface.workspace.customSiteDomain && <div className='gap-t-20'>
                    <Button onClick={e => this.openCustomDomain(e)} ghost><S>自定义域名</S></Button>
                    <div className='remark f-12 gap-h-10 flex'><S>示例</S>:https://yousite.com</div>
                </div>}

            </div>
            <Divider></Divider>
            <div className='gap-h-10'>
                <div className='bold f-14'><S>导出数据</S></div>
                <div className='remark f-12 gap-h-10'><S text='导出空间所有的数据'>导出空间所有的数据(暂不开放）</S></div>
                <div className='shy-ws-settings-view-domain'>
                    <Button onClick={e => this.createWorkspaceTemplate(e)} ghost><S>导出数据</S></Button>
                </div>
            </div>
            <Divider></Divider>
            <div className='gap-h-10'>
                <div className='bold f-14'><S>注销空间</S></div>
                <div className='remark f-12 gap-h-10'><S text='注销空间不可撤消'>注销空间不可撤消，空间内的数据将自动清理</S></div>
                <div className='shy-ws-settings-view-domain'>
                    <Button onClick={e => this.cancelWorkspace(e)} danger ><S>注销空间</S></Button>
                </div>
            </div>
        </div>
    }
}