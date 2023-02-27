import { EventsComponent } from "rich/component/lib/events.component";
import React from "react";
import { ServiceNumber } from "../declare";
import { Input } from "rich/component/view/input";
import { Textarea } from "rich/component/view/input/textarea";
import { Divider } from "rich/component/view/grid";
import { Button } from "rich/component/view/button";
import lodash from "lodash";
import { PopoverSingleton } from "rich/extensions/popover/popover";

export class ServerNumberView extends EventsComponent {
    sn: ServiceNumber;
    oldSn: ServiceNumber;
    render() {
        return <div>

            <div className="flex"><label></label></div>
            <div className="flex"><Input value={this.sn.serviceNumber} onChange={e => { this.sn.serviceNumber = e; this.forceUpdate() }}></Input></div>

            <div className="flex"><label></label></div>
            <div className="flex"><Input value={this.sn.verifyCode} onChange={e => { this.sn.verifyCode = e; this.forceUpdate() }}></Input></div>

            <div className="flex"><label></label></div>
            <div className="flex"><Input value={this.sn.serviceProvider} onChange={e => { this.sn.serviceProvider = e; this.forceUpdate() }}></Input></div>

            <div className="flex"><label></label></div>
            <div className="flex"><Textarea value={this.sn.remark} onChange={e => { this.sn.remark = e; this.forceUpdate() }}></Textarea></div>

            <Divider></Divider>
            <div className="flex"><label></label></div>
            <div>
                <div className="r-flex flex">
                    <div><span></span><Input value={this.sn.mongodb.account} onChange={e => this.sn.mongodb.account = e}></Input></div>
                    <div><span></span ><Input value={this.sn.mongodb.paw} onChange={e => this.sn.mongodb.paw.port = e}></Input></div>

                    <div><span></span><Input value={this.sn.mongodb.ip} onChange={e => this.sn.mongodb.ip = e}></Input></div>
                    <div><span></span ><Input value={this.sn.mongodb.port} onChange={e => this.sn.mongodb.port = e}></Input></div>
                </div>
            </div>

            <Divider></Divider>
            <div className="flex"><label></label></div>
            <div>
                <div className="r-flex flex">

                    <div><span></span><Input value={this.sn.redis.ip} onChange={e => this.sn.redis.ip = e}></Input></div>
                    <div><span></span ><Input value={this.sn.redis.port} onChange={e => this.sn.redis.port = e}></Input></div>

                    <div><span></span><Input value={this.sn.redis.account} onChange={e => this.sn.mongodb.account = e}></Input></div>
                    <div><span></span ><Input value={this.sn.redis.paw} onChange={e => this.sn.redis.paw.port = e}></Input></div>

                </div>
            </div>

            <Divider></Divider>
            <div className="flex"><label></label></div>
            <div>
                <div className="r-flex flex">

                    <div><span></span><Input value={this.sn.search.ip} onChange={e => this.sn.search.ip = e}></Input></div>
                    <div><span></span ><Input value={this.sn.search.port} onChange={e => this.sn.search.port = e}></Input></div>

                </div>
            </div>

            <div className="flex-center">
                <Button>保存</Button><Button ghost>取消</Button>
            </div>

        </div>
    }

    open(sn: ServiceNumber) {
        this.sn = Object.assign({}, sn || {}) as any;
        this.oldSn = lodash.cloneDeep(this.sn);
        this.forceUpdate()
    }
    onSave() {
        if (!lodash.isEqual(this.sn, this.oldSn)) {
            this.emit('save', lodash.cloneDeep(this.sn))
        }
    }
    onCancel() {
        this.emit('cancel')
    }
}

export async function useServerNumberView(sn: ServiceNumber) {
    let popover = await PopoverSingleton(ServerNumberView);
    let serverNumberView = await popover.open({ center: true, centerTop: 100 });
    serverNumberView.open(sn);
    return new Promise((resolve: (data:  ServiceNumber) => void, reject) => {
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