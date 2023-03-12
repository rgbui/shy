import lodash from "lodash";
import { EventsComponent } from "rich/component/lib/events.component";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import { Pid } from "../declare";
import React from "react";
import { Button } from "rich/component/view/button";
import { Input } from "rich/component/view/input";
import { SelectBox } from "rich/component/view/select/box";

export class PidView extends EventsComponent {
    pid: Pid;
    oldPid: Pid;
    render() {
        return <div>

            <div><label></label></div>
            <div className="flex"><Input value={this.pid.name} onChange={e => { this.pid.name = e; this.forceUpdate() }}></Input></div>

            <div><label></label></div>
            <div className="flex"><Input value={this.pid.port.toString()} onChange={e => { this.pid.port = parseFloat(e); this.forceUpdate() }}></Input></div>

            <div><label></label></div>
            <div className="flex">
                <SelectBox
                    multiple
                    onChange={e => this.pid.types = e as string[]}
                    value={this.pid.types}
                    options={[
                        { text: 'ws', value: 'ws' },
                        { text: 'tim', value: 'tim' },
                        { text: 'file', value: 'file' },
                        { text: 'search', value: 'search' }
                    ]}
                ></SelectBox>
            </div>
            <div className="flex-center">
                <Button onClick={e => this.onSave()}>保存</Button>
                <Button onClick={e => this.onCancel()} ghost>取消</Button>
            </div>
        </div>
    }

    open(pid: Partial<Pid>) {
        this.pid = Object.assign({}, pid || {}) as any;
        this.oldPid = lodash.cloneDeep(this.pid);
        this.forceUpdate()
    }
    onSave() {
        if (!lodash.isEqual(this.pid, this.oldPid)) {
            this.emit('save', lodash.cloneDeep(this.pid))
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