import lodash from "lodash";
import { EventsComponent } from "rich/component/lib/events.component";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import { Pid, PidTypeOptions } from "../declare";
import React from "react";
import { Button } from "rich/component/view/button";
import { Input } from "rich/component/view/input";
import { SelectBox } from "rich/component/view/select/box";
import { InputNumber } from "rich/component/view/input/number";
import { Divider } from "rich/component/view/grid";
import { serverSlideStore } from "../store";
import { Textarea } from "rich/component/view/input/textarea";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";

export class PidView extends EventsComponent {
    pid: Partial<Pid> = {};
    async selectDir() {
        this.pid.storeDir = await serverSlideStore.shyServiceSlideElectron.openFile({ dialogTitle: lst('选择存储目录'), mode: 'dir' })
        this.forceUpdate()
    }
    async getLocalIp() {
        this.pid.url = `http://${await await serverSlideStore.shyServiceSlideElectron.getLocalIp()}:${this.pid.port}`
        this.forceUpdate()
    }
    render() {
        return <div className=" round  min-w-400">

            <div className="padding-14">
                <div><label><S>端口</S>*:</label></div>
                <div className="flex gap-t-5 gap-b-10"><InputNumber value={this.pid.port} onChange={e => { this.pid.port = e; this.forceUpdate() }}></InputNumber></div>

                <div><label><S>进程</S>:</label></div>
                <div className="flex gap-t-5 gap-b-10"><Input placeholder={lst("进程") + this.pid.port} value={this.pid.name} onChange={e => { this.pid.name = e; this.forceUpdate() }}></Input></div>

                <div><label><S>网址</S>:</label><span className="remark f-12"><S>对外公开访问网址</S>,<a className="cursor item-hover" onMouseDown={e => this.getLocalIp()}><S>局域网ip</S></a></span></div>
                <div className="flex gap-t-5 gap-b-10"><Input clear placeholder={'http://127.0.0.1:' + this.pid.port} value={this.pid.url} onChange={e => { this.pid.url = e; this.forceUpdate() }}></Input></div>

                <div><label><S>服务</S>:</label></div>
                <div className="flex gap-t-5 gap-b-10">
                    <SelectBox style={{ width: '100%' }} border
                        multiple
                        onChange={e => { this.pid.types = e as string[]; this.forceUpdate() }}
                        value={this.pid.types}
                        options={PidTypeOptions}
                    ></SelectBox>
                </div>
                {this.pid.types?.includes('file') && <><div><label><S>本地文件存储</S>:</label><span className="remark f-12">(<S>如果为空会存到系统盘</S>)</span></div>
                    <div className="flex gap-t-5 gap-b-10">
                        <div className="flex-auto">
                            <Input value={this.pid.storeDir} readonly></Input>
                        </div>
                        <Button onMouseDown={e => this.selectDir()} className="flex-fixed"><S>选择文件夹</S></Button>
                    </div></>}
                <div><label><S>其它</S>:</label></div>
                <div className="flex gap-t-5 gap-b-10"><Textarea value={this.pid.config ? JSON.stringify(this.pid.config) : ""} onChange={e => {
                    try {
                        this.pid.config = window.eval("(" + e + ")");
                        this.forceUpdate()
                    }
                    catch (ex) {

                    }
                }}></Textarea></div>
                {this.error && <div className="error">{this.error}</div>}
            </div>
            <Divider></Divider>
            <div className="flex-center padding-w-14 padding-h-5">
                <Button className="gap-r-10" onClick={e => this.onSave()}><S>保存</S></Button>
                <Button onClick={e => this.onCancel()} ghost><S>取消</S></Button>
            </div>
        </div>
    }
    open(pid: Partial<Pid>) {
        this.pid = Object.assign({ types: ['ws'] }, pid || {}) as any;
        this.forceUpdate()
    }
    error: string = '';
    onSave() {
        this.error = '';
        if (!(this.pid.port >= 2000 && this.pid.port <= 60000)) this.error = lst('端口号位于2000~60000,不要与其它程序有冲突')
        if (this.pid.types.length == 0) this.error = lst('请至少选择一项服务')
        if (!this.error) {
            this.emit('save', lodash.cloneDeep(this.pid))
        }
        else {
            this.forceUpdate()
        }
    }
    onCancel() {
        this.emit('cancel')
    }
}

export async function usePidView(pid: Partial<Pid>) {
    let popover = await PopoverSingleton(PidView);
    let pv = await popover.open({ center: true, centerTop: 100 });
    pv.open(pid);
    return new Promise((resolve: (pid: Pid) => void, reject) => {
        pv.only('save', (data) => {
            popover.close();
            resolve(data);
        })
        pv.only('cancel', () => {
            popover.close();
            resolve(null);
        })
        popover.only('close', () => {
            resolve(null)
        })
    })
}