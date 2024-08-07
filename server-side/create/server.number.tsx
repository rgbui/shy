import { EventsComponent } from "rich/component/lib/events.component";
import React from "react";
import { ServiceNumber } from "../declare";
import { Input } from "rich/component/view/input";
import { Divider } from "rich/component/view/grid";
import { Button } from "rich/component/view/button";
import lodash from "lodash";
import { InputNumber } from "rich/component/view/input/number";
import { serverSlideStore } from "../store";
import { masterSock } from "../../net/sock";
import { Spin } from "rich/component/view/spin";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";
import { PopoverSingleton } from "rich/component/popover/popover";
import { Textarea } from "rich/component/view/input/textarea";
import { CheckBox } from "rich/component/view/checkbox";

export class ServerNumberView extends EventsComponent {
    sn: ServiceNumber = {
        mongodb: {
            ip: '127.0.0.1',
            port: 27017,
            account: '',
            pwd: ''
        },
        redis: { abled: false, ip: '127.0.0.1', port: 6379, account: '',pwd: '' },
        search: { abled: false, url: 'http://127.0.0.1:9200' }
    } as any;
    oldSn: ServiceNumber;
    serviceNumberError = '';
    step: number = 1;
    render() {
        if (this.loading) {
            return <div className="padding-14 round ">
                <Spin></Spin>
            </div>
        }
        return <div className="padding-14 round ">

            <div className="flex"><label>服务号<em>*</em></label></div>
            <div className="flex"><Input value={this.sn.serviceNumber} onChange={e => { this.sn.serviceNumber = e; }}></Input></div>
            {this.serviceNumberError && <div className="error f-12 gap-t-5">{this.serviceNumberError}</div>}
            <div className="remark f-12 gap-t-5">服务号需要唯一</div>
            <div className="flex gap-t-5"><label>描述:</label></div>
            <div className="flex"><Textarea style={{ height: 60 }} value={this.sn.remark} onChange={e => { this.sn.remark = e; }}></Textarea></div>

            <Divider></Divider>
            <div className="flex"><label><S text="Mongodb">Mongodb(数据库-必填)</S></label></div>
            <div>
                <div className="remark f-12"><S text='CheckMongodb'>确认是否能与mongodb正常连接，mongodb没置帐号和密码可不填</S></div>
                <div className="r-flex r-gap-h-10">
                    <div className="r-gap-r-5"><span className="flex-fixed flex-end w-100">IP:</span><div className="flex-auto"><Input value={this.sn.mongodb.ip} onChange={e => this.sn.mongodb.ip = e}></Input></div><span className="flex-fixed flex-end w-100"><S>端口</S>:</span ><div className="flex-auto"><InputNumber value={this.sn.mongodb.port} onChange={e => this.sn.mongodb.port = e}></InputNumber></div></div>
                    <div className="r-gap-r-5"><span className="flex-fixed flex-end w-100">帐号:</span><div className="flex-auto"><Input value={this.sn.mongodb.account} onChange={e => this.sn.mongodb.account = e}></Input></div><span className="flex-fixed flex-end w-100"><S>密码</S>:</span ><div className="flex-auto"><Input type="password" value={this.sn.mongodb.pwd} onChange={e => this.sn.mongodb.pwd= e}></Input></div></div>
                </div>
            </div>

            <Divider></Divider>
            <div className="flex"><label className="gap-r-3"><CheckBox checked={this.sn.redis.abled} onChange={e => { this.sn.redis.abled = e; this.forceUpdate() }}></CheckBox></label><S text={'Redis'}>Redis(缓存)</S></div>
            {this.sn.redis.abled && <><div className="remark f-12"><S text={'CheckRedis'}>确认是否能与redis正常连接，redis没设置密码可不填</S></div>
                <div className="r-flex r-gap-h-10">
                    <div className="r-gap-r-5"><span className="flex-fixed flex-end w-100">IP:</span><div className="flex-auto"><Input value={this.sn.redis.ip} onChange={e => this.sn.redis.ip = e}></Input></div><span className="flex-fixed flex-end w-100"><S>端口</S>:</span ><div className="flex-auto"><InputNumber value={this.sn.redis.port} onChange={e => this.sn.redis.port = e}></InputNumber></div></div>
                    <div className="r-gap-r-5">
                        <span className="flex-fixed flex-end w-100"><S>密码</S>:</span ><div className="flex-auto"><Input type="password" value={this.sn.redis.pwd} onChange={e => this.sn.redis.pwd = e}></Input></div>
                        <span className="flex-fixed flex-end w-100"></span>
                        <div className="flex-auto hide" ><input /></div>
                    </div>
                </div></>}

            <Divider></Divider>
            <div className="flex"><label  className="gap-r-3"><CheckBox checked={this.sn.search.abled} onChange={e => { this.sn.search.abled = e; this.forceUpdate() }}></CheckBox></label><S text='ElasticSearch'>ElasticSearch(搜索引擎)</S></div>
            {this.sn.search.abled && <div className="r-flex r-gap-h-10">
                <div className="remark f-12"><S text='CheckElasticSearch'>确认是否能与ElasticSearch正常连接</S></div>
                <div className="r-gap-r-5"><span className="flex-fixed flex-end w-100"><S>网址</S>:</span><div className="flex-auto"><Input value={this.sn.search.url} onChange={e => this.sn.search.url = e}></Input></div></div>
            </div>}

            <Divider></Divider>
            <div className="flex-center gap-h-10">
                <Button className="gap-r-10" onClick={e => this.onSave()}><S>保存</S></Button>
                <Button ghost onClick={e => this.onCancel()}><S>取消</S></Button>
            </div>

        </div>
    }

    loading: boolean = false;
    async open(sn: ServiceNumber) {
        this.loading = true;
        this.forceUpdate(() => {
            if (sn) this.sn = sn;
            else { this.sn.serviceNumber = serverSlideStore.machineCode }
            this.oldSn = lodash.cloneDeep(this.sn);
            this.loading = false;
            this.forceUpdate()
        });
    }
    async onSave() {
        if (!this.sn.id) {
            var r = await masterSock.get('/service/number/exists', { serviceNumber: this.sn.serviceNumber })
            if (r.data.exists == true) {
                this.serviceNumberError = lst('服务号已存在');
                this.forceUpdate()
                return
            }
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