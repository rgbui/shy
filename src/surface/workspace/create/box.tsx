import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { ChevronRightSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { Input } from "rich/component/view/input";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";
import { surface } from "../../store";
import { ResourceArguments } from "rich/extensions/icon/declare";
import { Button } from "rich/component/view/button";
import { Workspace } from "..";
import { SelectBox } from "rich/component/view/select/box";
import { PopoverSingleton } from "rich/component/popover/popover";
import { EventsComponent } from "rich/component/lib/events.component";
import { config } from "../../../../common/config";
import { OpenFileDialoug } from "rich/component/file";
import { channel } from "rich/net/channel";
import { UrlRoute } from "../../../history";

@observer
export class CreateWorkspaceView extends EventsComponent {
    constructor(props) {
        super(props);
        makeObservable(this, { local: observable })
    }
    local: {
        step: number,
        template?: string,
        name: string,
        avatar: ResourceArguments,
        datasource: Workspace['datasource'],
        error: string,
        privateCloundConfig: {
            abled: boolean;
            port: number;
            storeDir: string;
            mongodb: {
                ip: string;
                port: number;
                account: string;
                pwd: string;
            };
            esUrl: string;
        },
        dataServiceAddress?: string
    } = {
            step: 1,
            name: '',
            avatar: null,
            datasource: 'public-clound',
            template: null,
            privateCloundConfig: null,
            dataServiceAddress: '',
            error: ''
        }
    getTemplates() {
        return [
            { text: lst('知识库'), value: null },
            { text: lst('社区交流'), value: null },
            { text: lst('团队协作'), value: null },
            { text: lst('博客'), value: null },
            { text: lst('游戏'), value: null },
            { text: lst('学校俱乐部'), value: null }
        ]
    }
    renderStep1() {
        return <div>
            <div className="h2 flex-center"><S>创建空间</S></div>
            <div className="remark flex-center"><S text={'创建空间描述语'}>创建在线的生活工作空间，和您的朋友一起协作成长吧。</S></div>
            <div className="padding-b-10">
                <div onMouseDown={e => { this.local.template = null; this.local.step = 2 }} className="flex   cursor  border round padding-w-10 padding-h-5 item-hover  text-1 gap-h-5 "><span className="flex-auto"><S>亲自创建</S></span><span className="flex-fixed"><Icon size={20} icon={ChevronRightSvg}></Icon></span></div>
                <div className="remark f-12">选择模板</div>
                <div>
                    {this.getTemplates().map((temp, index) => {
                        return <div onMouseDown={e => { this.local.template = null; this.local.step = 2 }} key={index} className="flex cursor border round padding-w-10 padding-h-5 item-hover gap-h-5 text-1">
                            <div className="flex-auto">{temp.text}</div>
                            <div className="flex-fixed text-1"><Icon size={20} icon={ChevronRightSvg}></Icon></div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    }
    async onupload(e) {
        var file = await OpenFileDialoug({ exts: ['image/*'] });
        if (file) {
            var r = await channel.post('/user/upload/file', { file, uploadProgress: (event) => { } })
            if (r.ok) {
                if (r.data.file.url) {
                    this.local.avatar = r.data.file
                }
            }
        }
    }
    renderStep2() {

        return <div>
            <div className="h2 flex-center"><S>自定义您的空间</S></div>
            <div>
                <div className="flex-center flex-col">
                    {!this.local.avatar && <div onMouseDown={e => this.onupload(e)} className="size-50 circle flex-center remark cursor" style={{ border: '1px dashed #999' }}>
                        <Icon icon={{ name: 'byte', code: 'camera' }}></Icon>
                    </div>}
                    {this.local.avatar && <div onMouseDown={e => this.onupload(e)} className="size-50 flex-center cursor">
                        <img className="size-50 circle obj-center" src={this.local.avatar?.url} />
                    </div>}
                    <div className="flex-center"><S>空间头像</S></div>
                </div>
            </div>
            <div className="remark f-12 gap-t-10 gap-b-5"><S>空间名称</S></div>
            <div>
                <Input value={this.local.name} onChange={e => this.local.name = e} placeholder={lst("{name}的空间", { name: surface.user.name })}></Input>
            </div>
            <div className="remark f-12 gap-t-10 gap-b-5"><S>存储源</S></div>
            <div>
                <SelectBox border value={this.local.datasource} onChange={e => { this.local.datasource = e; this.local.error = ''; }} options={[
                    { text: lst('诗云'), value: 'public-clound' },
                    { text: lst('私有云'), value: 'private-clound' },
                    { text: lst('本地'), visible: config?.isDesk ? true : false, value: 'private-local' }
                ]}></SelectBox>
            </div>
            {this.local.datasource == 'private-clound' && <>
                <div className="remark f-12 gap-t-10 gap-b-5"><S>私有云</S></div>
                <div><Input value={this.local.dataServiceAddress} onChange={e => {
                    this.local.dataServiceAddress = e;
                }} placeholder={lst('私有云服务号')}></Input></div>
            </>}
            {
                this.local.datasource == 'private-local' && <div>
                    {this.local.privateCloundConfig?.abled !== true && <div className="text-1 item-hover round" onMouseDown={e => this.openLocalServer()}><S>开启本地存储服务</S></div>}
                </div>
            }
            <div className="gap-h-10 flex">
                <span className="flex-fixed item-hover round padding-w-5 padding-h-3 item-hover-light cursor" onMouseDown={e => { this.local.step = 1 }}><S>上一步</S></span>
                <span className="flex-auto flex-end"><Button onMouseDown={(e, b) => this.onCreate(b)} ><S>创建</S></Button></span>
            </div>
            {this.local.error && <div className="error padding-w-10 gap-h-10">{this.local.error}</div>}
        </div>
    }
    async onCreate(b: Button) {
        b.loading = true;
        var ws;
        try {
            this.local.error = '';
            if (this.local.datasource == 'private-clound' && !this.local.dataServiceAddress) {
                this.local.error = lst('私有云服务号不能为空')
                return;
            }
            else if (this.local.datasource == 'private-local' && !(this.local.privateCloundConfig?.abled === true)) {
                this.local.error = lst('请开启本地存储服务')
                return;
            }
            var rr = await channel.put('/ws/create', {
                text: this.local.name,
                datasource: this.local.datasource,
                templateUrl: this.local.template || undefined,
                dataServiceAddress: this.local.datasource == 'private-clound' ? this.local.dataServiceAddress : undefined
            })
            if (rr.ok) {
                await surface.loadWorkspaceList();
                ws = rr.data.workspace;
            }
        }
        catch (ex) {

        }
        finally {
            b.loading = false;
            this.emit('close');
            if (ws) {
                UrlRoute.pushToWs(ws.sn, true);
            }
        }
    }
    render() {
        return <div className="w-300 max-h-400 round padding-14">
            {this.local.step == 1 && this.renderStep1()}
            {this.local.step == 2 && this.renderStep2()}
        </div>
    }
    async openLocalServer() {

    }
    async open() {
        this.local = {
            step: 1,
            name: '',
            error: '',
            avatar: null,
            datasource: 'public-clound',
            template: null,
            privateCloundConfig: null
        }
        var rs = config.isDesk ? await surface.shyDesk.readLocalStore() : null;
        if (rs) {
            this.local.privateCloundConfig = rs;
        }
    }
}

export async function useCreateWorkspace() {
    let popover = await PopoverSingleton(CreateWorkspaceView, { mask: true });
    let fv = await popover.open({ center: true });
    fv.open();
    return new Promise((resolve: (name: string) => void, reject) => {
        fv.only('close', () => {
            popover.close();
            resolve(null);
        });
        fv.only('save', () => {
            popover.close();
        })
        popover.only('close', () => {
            resolve(null);
        });
    })
}