import { EventsComponent } from "rich/component/lib/events.component";
import React from "react";
import { ServiceNumber } from "../declare";
import { Input } from "rich/component/view/input";
import { Divider } from "rich/component/view/grid";
import { Button } from "rich/component/view/button";
import lodash from "lodash";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import { InputNumber } from "rich/component/view/input/number";
import { serverSlideStore } from "../store";
import { masterSock } from "../../net/sock";
export class ServerNumberView extends EventsComponent {
    sn: ServiceNumber = {
        mongodb: { ip: '127.0.0.1', port: 27017, account: '', paw: '' },
        redis: { ip: '127.0.0.1', port: 6379, account: '', paw: '' },
        search: { url: 'http://127.0.0.1:9200' }
    } as any;
    oldSn: ServiceNumber;
    serviceNumberError = '';
    step: number = 1;
    render() {
        return <div className="padding-14 round ">

            <div className="flex"><label>服务号<em>*</em></label></div>
            <div className="flex"><Input value={this.sn.serviceNumber} onChange={e => { this.sn.serviceNumber = e; }}></Input></div>
            {this.serviceNumberError && <div className="error f-12 gap-t-5">{this.serviceNumberError}</div>}
            <div className="remark f-12 gap-t-5">服务号可承载N个诗云空间及支持部署在N台服务器</div>
            {/* <div className="flex"><label>服务商:</label></div>
            <div className="flex"><Input value={this.sn.serviceProvider} onChange={e => { this.sn.serviceProvider = e; this.forceUpdate() }}></Input></div> */}

            {/* <div className="flex"><label>描述:</label></div>
            <div className="flex"><Textarea value={this.sn.remark} onChange={e => { this.sn.remark = e; this.forceUpdate() }}></Textarea></div> */}

            <Divider></Divider>
            <div className="flex"><label>Mongodb(数据库)</label></div>
            <div>
                <div className="remark f-12">检测是否能与mongodb正常连接，mongodb没设置帐号和密码可不填</div>
                <div className="r-flex r-gap-h-10">
                    <div className="r-gap-r-5"><span className="flex-fixed flex-end w-100">IP:</span><div className="flex-auto"><Input value={this.sn.mongodb.ip} onChange={e => this.sn.mongodb.ip = e}></Input></div><span className="flex-fixed flex-end w-100">端口:</span ><div className="flex-auto"><InputNumber value={this.sn.mongodb.port} onChange={e => this.sn.mongodb.port = e}></InputNumber></div></div>
                    <div className="r-gap-r-5"><span className="flex-fixed flex-end w-100">帐号:</span><div className="flex-auto"><Input value={this.sn.mongodb.account} onChange={e => this.sn.mongodb.account = e}></Input></div><span className="flex-fixed flex-end w-100">密码:</span ><div className="flex-auto"><Input type="password" value={this.sn.mongodb.paw} onChange={e => this.sn.mongodb.paw.port = e}></Input></div></div>
                </div>
            </div>

            <Divider></Divider>
            <div className="flex"><label>Redis(缓存)</label></div>

            <div className="remark f-12">检测是否能与redis正常连接，redis没设置密码可不填</div>
            <div className="r-flex r-gap-h-10">
                <div className="r-gap-r-5"><span className="flex-fixed flex-end w-100">IP:</span><div className="flex-auto"><Input value={this.sn.redis.ip} onChange={e => this.sn.redis.ip = e}></Input></div><span className="flex-fixed flex-end w-100">端口:</span ><div className="flex-auto"><InputNumber value={this.sn.redis.port} onChange={e => this.sn.redis.port = e}></InputNumber></div></div>
                <div className="r-gap-r-5">
                    <span className="flex-fixed flex-end w-100">密码:</span ><div className="flex-auto"><Input type="password" value={this.sn.redis.paw} onChange={e => this.sn.redis.paw.port = e}></Input></div>
                    <span className="flex-fixed flex-end w-100"></span>
                    <div className="flex-auto hide" ><input /></div>
                </div>
            </div>

            <Divider></Divider>
            <div className="flex"><label>Elasticsearch(搜索引擎)</label></div>
            <div className="r-flex r-gap-h-10">
                <div className="remark f-12">检测是否能与elasticsearch正常连接</div>
                <div className="r-gap-r-5"><span className="flex-fixed flex-end w-100">网址:</span><div className="flex-auto"><Input value={this.sn.search.url} onChange={e => this.sn.search.url = e}></Input></div></div>
            </div>
            <Divider></Divider>
            <div className="flex-center gap-h-10">
                <Button className="gap-r-10" onClick={e => this.onSave()}>保存</Button><Button ghost onClick={e => this.onCancel()}>取消</Button>
            </div>

        </div>
    }

    open(sn: ServiceNumber) {
        if (sn) this.sn = Object.assign({}, sn || {}) as any;
        else { this.sn.serviceNumber = serverSlideStore.machineCode }
        this.oldSn = lodash.cloneDeep(this.sn);
        this.forceUpdate()
    }
    async onSave() {
        var r = await masterSock.get('/service/number/exists', { serviceNumber: this.sn.serviceNumber })
        if (r.data.exists == true) {
            this.serviceNumberError = '服务号已存在';
            this.forceUpdate()
            return
        }
        this.emit('save', lodash.cloneDeep(this.sn))
    }
    onCancel() {
        this.emit('cancel')
    }
}

export async function useServerNumberView(sn: ServiceNumber) {
    let popover = await PopoverSingleton(ServerNumberView);
    let serverNumberView = await popover.open({ center: true, centerTop: 100 });
    serverNumberView.open(sn);
    return new Promise((resolve: (data: ServiceNumber) => void, reject) => {
        serverNumberView.only('save', (data) => {
            popover.close();
            resolve(data);
        })
        serverNumberView.only('cancel', () => {
            popover.close();
            resolve(null);
        })
        popover.only('close', () => {
            resolve(null)
        })
    })
}