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

export class PidView extends EventsComponent {
    pid: Partial<Pid> = {};
    async selectDir() {
        this.pid.storeDir = await serverSlideStore.shyServiceSlideElectron.openFile({ dialogTitle: '选择存储目录', mode: 'dir' })
        this.forceUpdate()
    }
    async getLocalIp() {
        this.pid.url = `http://${await await serverSlideStore.shyServiceSlideElectron.getLocalIp()}:${this.pid.port}`
        this.forceUpdate()
    }
    render() {
        return <div className=" round  min-w-400">

            <div className="padding-14">
                <div><label>端口*:</label></div>
                <div className="flex gap-t-5 gap-b-10"><InputNumber value={this.pid.port} onChange={e => { this.pid.port = e; this.forceUpdate() }}></InputNumber></div>

                <div><label>进程:</label></div>
                <div className="flex gap-t-5 gap-b-10"><Input placeholder={"进程" + this.pid.port} value={this.pid.name} onChange={e => { this.pid.name = e; this.forceUpdate() }}></Input></div>

                <div><label>网址:</label><span className="remark f-12">对外公开访问网址,<a className="cursor item-hover" onMouseDown={e => this.getLocalIp()}>局域网ip</a></span></div>
                <div className="flex gap-t-5 gap-b-10"><Input clear placeholder={'http://127.0.0.1:' + this.pid.port} value={this.pid.url} onChange={e => { this.pid.url = e; this.forceUpdate() }}></Input></div>

                <div><label>服务:</label></div>
                <div className="flex gap-t-5 gap-b-10">
                    <SelectBox style={{ width: '100%' }} border
                        multiple
                        onChange={e => { this.pid.types = e as string[]; this.forceUpdate() }}
                        value={this.pid.types}
                        options={PidTypeOptions}
                    ></SelectBox>
                </div>

                {this.pid.types?.includes('file') && <><div><label>本地文件存储:</label><span className="remark f-12">(如果为空会存到系统盘)</span></div>
                    <div className="flex gap-t-5 gap-b-10">
                        <div className="flex-auto">
                            <Input value={this.pid.storeDir} readonly></Input>
                        </div>
                        <Button onMouseDown={e => this.selectDir()} className="flex-fixed">选择文件夹</Button>
                    </div></>}
                <div><label>其它:</label></div>
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
                <Button className="gap-r-10" onClick={e => this.onSave()}>保存</Button>
                <Button onClick={e => this.onCancel()} ghost>取消</Button>
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
        if (!(this.pid.port >= 2000 && this.pid.port <= 60000)) this.error = '端口号位于2000~60000,不要与其它程序有冲突'
        if (this.pid.types.length == 0) this.error = '请至少选择一项服务'
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