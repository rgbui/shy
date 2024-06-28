import React from "react";
import lodash from "lodash";
import { config } from "../../../../../common/config";
import { S } from "rich/i18n/view";
import { Input } from "rich/component/view/input";
import { InputNumber } from "rich/component/view/input/number";
import { Icon } from "rich/component/view/icon";
import { UrlRoute } from "../../../../history";
import { surface } from "../../../app/store";
import { observer } from "mobx-react";
import { makeObservable, observable } from "mobx";
import { Divider } from "rich/component/view/grid";
import { Button } from "rich/component/view/button";
import { CheckSvg, TriangleSvg } from "rich/component/svgs";
import { ShyAlert } from "rich/component/lib/alert";
import { lst } from "rich/i18n/store";
import { Sock } from "../../../../../net/sock";
import { ToolTip } from "rich/component/view/tooltip";
import { util } from "rich/util/util";

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
            checkServiceTip: observable,
            otherSpread: observable,
            mongodbOtherSpread: observable,
        });
    }
    local: {
        abled: boolean,
        port: number,
        clientId: string,
        storeDir: string,
        sideMode: 'dev' | 'beta' | 'pro',
        region: 'cn' | 'us',
        mongodb: { ip: string, port: number, account: string, pwd: string },
        esUrl: string
    } = {
            abled: false,
            storeDir: '',
            port: 12800,
            sideMode: 'pro',
            region: 'cn',
            clientId: '',
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
    mongodbOtherSpread = false;
    checkES: boolean = null;
    checkEsError: string = '';
    checkPort: boolean = null;
    checkPortError: string = '';
    checkService: boolean = null;
    checkServiceTip: string = '';
    otherSpread: boolean = false;
    componentDidMount() {
        this.load();
    }
    async load() {
        if (surface.shyDesk) {
            var r = await surface.shyDesk.readLocalStore();
            if (r) {
                this.local = lodash.cloneDeep(r);
                if (!this.local.mongodb) {
                    this.local.mongodb = {
                        ip: 'localhost',
                        port: 27017
                    } as any;
                }
            }
        }
    }
    setValue(path, value) {
        lodash.set(this.local, path, value);
    }
    async onSave(b?: Button) {
        if (b) b.loading = true;
        try {
            if (!this.local.storeDir) {
                this.checkService = false;
                this.checkServiceTip = lst('请选择存储目录');
                return;
            }
            if (!this.local.mongodb.ip) {
                this.checkService = false;
                this.checkServiceTip = lst('请输入mongodb ip');
                return;
            }
            if (!this.local.mongodb.port) {
                this.checkService = false;
                this.checkServiceTip = lst('请输入mongodb port');
                return;
            }

            if (!(await this.onCheckMongodb())) {
                this.checkService = false;
                this.checkServiceTip = lst('Mongodb连接失败');
                return;
            }
            var d = lodash.cloneDeep(this.local);
            if (window.shyConfig.isDev) d.sideMode = 'dev';
            else if (window.shyConfig.isBeta) d.sideMode = 'beta';
            else if (window.shyConfig.isPro) d.sideMode = 'pro';
            d.region = window.shyConfig?.isUS ? "us" : "cn";
            console.log('save  local store', d);
            await surface.shyDesk.saveLocalStore(d as any);
            await surface.shyDesk.startServer();
            await surface.waitRunLocalServer(true);
            if (surface.islocalServerSuccess) {
                d.abled = true;
                d.clientId = util.guid();
                await surface.shyDesk.saveLocalStore(d);
                await this.load();
                this.checkService = true;
                this.checkServiceTip = lst('本地服务已启动');
            }
            else {
                this.checkService = false;
                this.checkServiceTip = lst('本地服务未启动');
            }
        }
        catch (ex) {
            console.error(ex);
        }
        finally {
            b.loading = false;
        }
    }
    async onSelectDir() {
        var r = await surface.shyDesk.openFile({ dialogTitle: '选择本地存储目录', mode: 'dir' });
        if (r) {
            this.local.storeDir = r;
        }
    }
    async onCheckMongodb(button?: Button) {
        try {
            if (button)
                button.loading = true;
            this.checkMongodbError = '';
            this.checkMongodb = true;
            var mo = lodash.cloneDeep(this.local?.mongodb || {} as any);
            if (!mo.ip) mo.ip = 'localhost'
            if (!mo.port) mo.port = 27017
            var r = await surface.shyDesk.checkMongodb(mo);
            console.log('check result', r);
            this.checkMongodb = r.connect;
            if (!r.connect) {
                this.checkMongodbError = lst('Mongodb连接失败')
                return false;
            }
            else return true;
        }
        catch (ex) {

        }
        finally {
            if (button)
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
        this.checkServiceTip = '';
        var sock = Sock.createSock('http://127.0.0.1:' + (this.local.port || 12800));
        try {
            var code = Math.random();
            var r = await sock.get('/ws/check/connect', { code });
            if (r?.ok) {
                if (r.data.code == code) this.checkService = true;
                else {
                    this.checkServiceTip = lst('本地服务未启动');
                    this.checkService = false;
                }
            }
        }
        catch (ex) {
            this.checkServiceTip = lst('本地服务未启动');
            this.checkService = false;
        }
        finally {
            if (button)
                button.loading = false;
        }
    }
    // async startServer() {
    //     // 在渲染进程中使用 ipcRenderer 发送消息
    //     const { ipcRenderer } = require('electron');
    //     // 发送消息到主进程
    //     ipcRenderer.send('startServer');

    // }
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
                {this.local.abled && <div className="gap-h-20">

                    <div >
                        <div className="f-12 remark"><S>存放资源文件的文件夹路径</S></div>
                        <div className="gap-h-5">{this.local.storeDir}</div>
                    </div>

                    <div>

                        <div className="f-12 remark" ><S>Mongodb连接</S></div>
                        <div className="gap-h-5"><span>ip</span>:<span>{this.local.mongodb?.ip || "localhost"}</span></div>
                        <div className="gap-h-5"><span><S>端口</S>:</span><span>{this.local.mongodb?.port || '27017'}</span></div>
                        {this.local.mongodb?.account && <div className="gap-h-5"><span><S>帐号</S>:</span><span>{this.local.mongodb?.account}</span></div>}


                    </div>
                </div>
                }

                {!this.local.abled && <div>

                    <div style={{ border: '2px dashed #ddd' }} className="round-16 padding-10 gap-h-10">
                        <p>安装mongodb数据库和安装应用程序没什么区别</p>
                        <p>仅安装一次，安装后本地与云端体验完全一致</p>
                        <p>参考<a
                            className="cursor"
                            style={{ textDecoration: 'underline' }}
                            href='https://help.shy.live/page/2174#agjp8twRD3AxCKPT9UGgew'
                            target="_blank"
                        >安装mongodb手册</a></p>
                    </div>

                    <div className="f-14 gap-t-20">1.<S>本地存储</S></div>
                    <div className="f-12 remark gap-h-5"><S>存放资源文件的文件夹路径</S></div>
                    <div className="flex"><span className="flex-auto"><Input
                        value={this.local.storeDir || ""}
                        onChange={e => this.setValue('storeDir', e)}></Input></span>
                        <ToolTip overlay={lst('选择文件夹')}><span
                            onMouseDown={e => this.onSelectDir()}
                            className="flex-fixed flex-center item-hover round cursor size-24 gap-l-10">
                            <Icon size={18} icon={{ name: 'byte', code: 'folder-close' }}></Icon>
                        </span></ToolTip>
                    </div>

                    <div className="f-14 gap-t-20 flex"><span className="flex-auto">2.Mongodb连接</span>{!lodash.isNull(this.checkMongodb) && <span className={"flex-fixed gap-r-5 flex" + (this.checkMongodb == false ? " text-p" : "")}><Icon className={'gap-r-3'} size={14} icon={this.checkMongodb ? CheckSvg : { name: 'byte', code: 'caution' }}></Icon><i>{this.checkMongodbError}</i></span>}<Button onClick={(e, b) => this.onCheckMongodb(b)} className="flex-fixed" size="small" ghost><S>检测Mongodb连接</S></Button></div>
                    <div className="f-12 remark gap-h-5"><S text='请确保Mongodb帐号有管理员权限'>在本机电脑上安装mongodb后，填写数据库相关信息</S></div>
                    <div>
                        <div className="flex gap-h-5"><span className="flex-fixed w-80 flex-end gap-r-10"><S>IP</S>:</span><Input value={this.local.mongodb?.ip || "localhost"} onChange={e => this.setValue('mongodb.ip', e)}></Input></div>
                        <div className="flex gap-h-5"><span className="flex-fixed w-80 flex-end gap-r-10"><S>端口</S>:</span><InputNumber placeholder={'27017'} value={this.local.mongodb?.port || 27017} onChange={e => this.setValue('mongodb.port', e)}></InputNumber></div>
                        <div className="flex">
                            <span onMouseDown={e => {
                                this.mongodbOtherSpread = !this.mongodbOtherSpread;
                            }} className={" gap-l-10 item-hover flex-fixed flex-center cursor round size-16 ts " + (this.mongodbOtherSpread ? "angle-180" : "angle-90")}> <Icon size={8} icon={TriangleSvg}></Icon></span>
                            <span className="remark"><S>帐号和密码</S></span>
                        </div>
                        {this.mongodbOtherSpread && <div>
                            <div className="flex gap-h-5"><span className="flex-fixed w-80 flex-end gap-r-10"><S>帐号</S>:</span><Input value={this.local.mongodb?.account} onChange={e => { this.setValue('mongodb.account', e) }}></Input></div>
                            <div className="flex gap-h-5"><span className="flex-fixed w-80 flex-end gap-r-10"><S>密码</S>:</span><Input type='password' value={this.local.mongodb?.pwd} onChange={e => { this.setValue('mongodb.pwd', e) }}></Input></div>
                        </div>}
                    </div>
                    <div className="gap-t-20 flex">
                        <Button onClick={(e, b) => this.onSave(b)}><S>开启本地存储服务</S></Button>
                    </div>
                    <div className="gap-h-10">
                        <span className="flex flex-fixed">
                            {!lodash.isNull(this.checkService) && <span className={"flex flex-fixed gap-r-10" + (this.checkService === false ? " text-p" : "")}>
                                <Icon icon={this.checkService ? CheckSvg : { name: 'byte', code: 'caution' }} size={14}></Icon>
                                <span className="gap-l-5">{this.checkServiceTip}</span>
                            </span>}
                        </span>
                    </div>
                </div>}
            </div>
            <div className="h-100"></div>
        </div>
    }
}

