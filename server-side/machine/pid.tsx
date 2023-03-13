import lodash from "lodash";
import { EventsComponent } from "rich/component/lib/events.component";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import { Pid } from "../declare";
import React from "react";
import { Button } from "rich/component/view/button";
import { Input } from "rich/component/view/input";
import { SelectBox } from "rich/component/view/select/box";
import { InputNumber } from "rich/component/view/input/number";
import { Divider } from "rich/component/view/grid";

export class PidView extends EventsComponent {
    pid: Partial<Pid> = {};
    render() {
        return <div className=" round  min-w-300">

            <div className="padding-14">
                <div><label>进程:</label></div>
                <div className="flex"><Input value={this.pid.name} onChange={e => { this.pid.name = e; this.forceUpdate() }}></Input></div>

                <div><label>端口:</label></div>
                <div className="flex"><InputNumber value={this.pid.port} onChange={e => { this.pid.port = e; this.forceUpdate() }}></InputNumber></div>

                <div><label>服务:</label></div>
                <div className="flex">
                    <SelectBox
                        multiple
                        onChange={e => { this.pid.types = e as string[]; this.forceUpdate() }}
                        value={this.pid.types}
                        options={[
                            { text: 'ws', value: 'ws' },
                            { text: 'tim', value: 'tim' },
                            { text: 'file', value: 'file' },
                            { text: 'search', value: 'search' }
                        ]}
                    ></SelectBox>
                </div>
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
        if (!this.pid.name) this.error = '进程名不能为空'
        if (!(this.pid.port > 1000 && this.pid.port < 60000)) this.error = '端口号不合法'
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