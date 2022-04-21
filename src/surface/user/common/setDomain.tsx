import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Button } from "rich/component/view/button";
import { Dialoug, Row, Col } from "rich/component/view/grid";
import { Input } from "rich/component/view/input";
import { ErrorText, Remark } from "rich/component/view/text";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import { channel } from "rich/net/channel";

class WsDomain extends EventsComponent {
    render() {
        return <Dialoug className={'shy-ws-set-domain'} head={<span>设置空间域名</span>}>
            <Row>
                <Remark>空间域名设置后不可更改，域名不能为纯数字，仅限数字和字母组合</Remark>
            </Row>
            <Row>
                <Col>域名</Col>
                <Col valign="middle">https://<Input style={{ width: 120 }} value={this.name} onChange={e => this.name = e}></Input>.shy.live</Col>
            </Row>
            <Row style={{ marginTop: 10 }}>
                <Col><Button block ref={e => this.button = e} onClick={e => this.save()}>保存</Button></Col>
            </Row>
            <div>
                {this.error && <ErrorText >{this.error}</ErrorText>}
            </div>
        </Dialoug>
    }
    wsId: string;
    name: string = '';
    error: string = '';
    button: Button;
    async save() {
        this.error = '';
        this.forceUpdate();
        this.button.loading = true;
        try {
            var r = await channel.patch('/ws/set/domain', { wsId: this.wsId, domain: this.name });
            if (r?.data?.exists) {
                this.error = '域名被占用'
            }
            if (r?.data.illegal) {
                this.error = '域名输入不合法'
            }
            if (r.ok && !r.data?.exists && !r.data?.illegal) {
                this.emit('close', this.name);
                return;
            }
        }
        catch (ex) {

        }
        finally {
            if (this.button) this.button.loading = false;
            this.forceUpdate();
        }
    }
    open(wsId: string, domain: string) {
        this.name = domain;
        this.forceUpdate()
    }
}
export async function useSetWsDomain(wsId: string, wsDomain: string) {
    let popover = await PopoverSingleton(WsDomain, { mask: true });
    let fv = await popover.open({ center: true });
    fv.open(wsId, wsDomain);
    return new Promise((resolve: (name: string) => void, reject) => {
        fv.only('close', (name: string) => {
            popover.close();
            resolve(name || null);
        });
        popover.only('close', () => {
            resolve(null);
        });
    })
}