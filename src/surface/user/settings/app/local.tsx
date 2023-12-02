import React from "react";
import lodash from "lodash";
import { config } from "../../../../../common/config";
import { S } from "rich/i18n/view";
import { SwitchText } from "rich/component/view/switch";
import { Input } from "rich/component/view/input";
import { InputNumber } from "rich/component/view/input/number";
import { Icon } from "rich/component/view/icon";
import { UrlRoute } from "../../../../history";
import { surface } from "../../../store";
import { observer } from "mobx-react";
import { makeObservable, observable } from "mobx";
import { Divider } from "rich/component/view/grid";
import { Button } from "rich/component/view/button";
import { CheckSvg } from "rich/component/svgs";
import { ShyAlert } from "rich/component/lib/alert";
import { lst } from "rich/i18n/store";
import { Sock } from "../../../../../net/sock";

@observer
export class LocalDataSource extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            local: observable,
            checkPort: observable,
            checkMongodb: observable,
            checkES: observable,
            checkMongodbError: observable,
            checkEsError: observable,
            checkPortError: observable,
            checkService: observable,
            checkServiceError: observable
        });
    }
    local: { abled: boolean, port: number, storeDir: string, mongodb: { ip: string, port: number, account: string, pwd: string }, esUrl: string } = {
        abled: false,
        storeDir: '',
        port: 12800,
        mongodb: {
            ip: 'localhost',
            port: 27017,
            account: '',
            pwd: ''
        },
        esUrl: ''
    }
    checkMongodb: boolean = null;
    checkMongodbError: string = '';
    checkES: boolean = null;
    checkEsError: string = '';
    checkPort: boolean = null;
    checkPortError: string = '';
    checkService: boolean = null;
    checkServiceError: string = '';
    componentDidMount() {
        this.load();
    }
    async load() {
        if (surface.shyDesk) {
            var r = await surface.shyDesk.readLocalStore();
            if (r) {
                this.local = lodash.cloneDeep(r);
            }
        }
    }
    async setValue(path, value) {
        lodash.set(this.local, path, value);
    }
    async onSave(b?: Button) {
        if (b) b.loading = true;
        try {
            await surface.shyDesk.saveLocalStore(lodash.cloneDeep(this.local));
        }
        catch (ex) {

        }
        finally {
            if (b)
                b.loading = false;
            if (b) {
                ShyAlert(lst('保存成功'))
            }
        }
    }
    async onSelectDir() {
        var r = await surface.shyDesk.openFile({ dialogTitle: '选择本地存储目录', mode: 'dir' });
        if (r) {
            this.local.storeDir = r;
        }
    }
    async onCheckMongodb(button: Button) {
        try {
            button.loading = true;
            this.checkMongodbError = '';
            var r = await surface.shyDesk.checkMongodb(lodash.cloneDeep(this.local.mongodb));
            console.log('check result', r);
            this.checkMongodb = r.connect;
            if (!r.connect) {
                this.checkMongodbError = lst('Mongodb连接失败')
                ShyAlert(r.error);
            }
        }
        catch (ex) {

        }
        finally {
            button.loading = false;
        }
    }
    async onCheckEs(button: Button) {
        button.loading = true;
        this.checkEsError = '';
        try {
            var r = await surface.shyDesk.checkEs(lodash.cloneDeep(this.local.esUrl));
            this.checkES = r.connect;
            if (!r.connect) {
                this.checkEsError = lst('ES连接失败')
                ShyAlert(r.error);
            }
        }
        catch (ex) {

        }
        finally {
            button.loading = false;
        }
    }
    async onCheckPort(button: Button) {
        button.loading = true;
        this.checkPortError = '';
        try {
            console.log(this.local.port || 12800)
            var r = await surface.shyDesk.portIsOccupied(this.local.port || 12800);
            this.checkPort = r;
            if (r !== true) {
                this.checkPortError = lst('端口被占用');
                ShyAlert(this.local.port + lst('端口被占用'))
            }
        }
        catch (ex) {
            console.error(ex);
        }
        finally {
            button.loading = false;
        }
    }
    async onCheckLocalService(button?: Button) {
        if (button) button.loading = true;
        this.checkServiceError = '';
        var sock = Sock.createSock('http://127.0.0.1:' + (this.local.port || 12800));
        try {
            var r = await sock.get('/test/connect');
            if (r?.ok) {
                if (r.data.ok == true) this.checkService = true;
                else { this.checkServiceError = lst('本地服务未启动'); this.checkService = false; }
            }
        }
        catch (ex) {
            this.checkServiceError = lst('本地服务未启动');
            this.checkService = false;
        }
        finally {
            if (button)
                button.loading = false;
        }
    }
    render() {
        if (!config.isDesk) {
            return <div className="flex-center gap-h-30 remark f-12">
                <S text='无法设置本地存储'>浏览器无法设置本地存储</S>
                <a target="_blank" href={UrlRoute.getUrl('/download')}><S>安装客户端</S></a>
            </div>
        }
        return <div>
            <div className="h2"><S>设置本地存储</S></div>
            <Divider></Divider>
            <div className="w-500">
                <div className="gap-t-10 flex w-500">
                    <span className="flex-auto"><SwitchText align="right" checked={this.local.abled} onChange={async e => {
                        await this.setValue('abled', e);
                        await surface.shyDesk.saveLocalStore(lodash.cloneDeep(this.local));
                    }}><S>开启本地存储服务</S></SwitchText></span>
                    <span className="flex flex-fixed">
                        {!lodash.isNull(this.checkService) && <span className={"flex flex-fixed gap-r-10" + (this.checkService === false ? " text-p" : "")}>
                            <Icon icon={this.checkService ? CheckSvg : { name: 'byte', code: 'caution' }} size={14}></Icon>
                            <span className="gap-l-5">{this.checkServiceError}</span>
                        </span>}
                        <Button className="flex-fixed" onClick={(e, b) => this.onCheckLocalService(b)}><S>检测本地服务</S></Button>
                    </span>
                </div>
                {this.local.abled && <div>
                    <div className="f-14 gap-t-20 flex"><span className="flex-auto"><S>本地服务端口</S><span>(<S>选填</S>)</span></span>{!lodash.isNull(this.checkPort) && <span className={"flex-fixed gap-r-5 flex" + (this.checkPort == false ? " text-p" : "")}><Icon size={14} icon={this.checkPort ? CheckSvg : { name: 'byte', code: 'caution' }}></Icon>{this.checkPortError && <i>{this.checkPortError}</i>}</span>}<Button className="flex-fixed" onClick={(e, b) => this.onCheckPort(b)} size="small" ghost><S>检测端口占用</S></Button></div>
                    <div className="f-12 remark gap-h-5"><S text="用于启动本地服务">用于启动本地服务</S></div>
                    <div className="flex">
                        <InputNumber placeholder="12800" value={this.local.port} onChange={e => this.setValue('port', e)}></InputNumber>
                    </div>
                    <div className="f-14 gap-t-20 flex"><span className="flex-auto">Mongodb</span>{!lodash.isNull(this.checkMongodb) && <span className={"flex-fixed gap-r-5 flex" + (this.checkMongodb == false ? " text-p" : "")}><Icon size={14} icon={this.checkMongodb ? CheckSvg : { name: 'byte', code: 'caution' }}></Icon>{this.checkMongodbError && <i>{this.checkMongodbError}</i>}</span>}<Button onClick={(e, b) => this.onCheckMongodb(b)} className="flex-fixed" size="small" ghost><S>检测Mongodb连接</S></Button></div>
                    <div className="f-12 remark gap-h-5"><S text='请确保Mongodb帐号有管理员权限'>请确保Mongodb帐号有管理员权限,系统将自动创建数据库</S></div>
                    <div className="r-flex r-gap-h-5">
                        <div><span className="flex-fixed w-80 flex-end gap-r-10"><S>IP</S>:</span><Input value={this.local.mongodb.ip} onChange={e => this.setValue('mongodb.ip', e)}></Input></div>
                        <div><span className="flex-fixed w-80 flex-end gap-r-10"><S>端口</S>:</span><InputNumber placeholder={'27017'} value={this.local.mongodb.port} onChange={e => this.setValue('mongodb.port', e)}></InputNumber></div>
                        <div><span className="flex-fixed w-80 flex-end gap-r-10"><S>帐号</S>:</span><Input value={this.local.mongodb.account} onChange={e => { this.setValue('mongodb.account', e) }}></Input></div>
                        <div><span className="flex-fixed w-80 flex-end gap-r-10"><S>密码</S>:</span><Input type='password' value={this.local.mongodb.pwd} onChange={e => { this.setValue('mongodb.pwd', e) }}></Input></div>

                    </div>
                    <div className="f-14 gap-t-20"><S>本地存储</S><span>(*)</span></div>
                    <div className="f-12 remark gap-h-5"><S>存放空间文件路径</S></div>
                    <div className="flex"><span className="flex-auto"><Input value={this.local.storeDir} onChange={e => this.setValue('storeDir', e)}></Input></span>
                        <span onMouseDown={e => this.onSelectDir()} className="flex-fixed item-hover round cursor size-24 gap-l-10">
                            <Icon size={18} icon={{ name: 'byte', code: 'folder-close' }}></Icon>
                        </span>
                    </div>

                    <div className="f-14 gap-t-20 flex"><span className="flex-auto"><S>ES搜索引擎</S><span>(<S>选填</S>)</span></span>{!lodash.isNull(this.checkES) && <span className={"flex-fixed gap-r-5 flex" + (this.checkES === false ? " text-p" : "")}><Icon size={16} icon={this.checkES ? CheckSvg : { name: 'byte', code: 'caution' }}></Icon>{this.checkEsError && <i>{this.checkEsError}</i>}</span>}<Button className="flex-fixed" onClick={(e, b) => this.onCheckEs(b)} size="small" ghost><S>检测ES连接</S></Button></div>
                    <div className="f-12 remark gap-h-5"><S>用于空间文档搜索</S></div>
                    <div className="flex">
                        <Input value={this.local.esUrl} onChange={e => this.setValue('esUrl', e)}></Input>
                    </div>

                    <div className="gap-t-20 flex">
                        <Button onClick={(e, b) => this.onSave(b)}><S>保存</S></Button>
                        <span className="gap-l-10 f-12 remark"><S>请确认所有均能正常连接</S></span>
                    </div>
                </div>}
            </div>

        </div>
    }
}

