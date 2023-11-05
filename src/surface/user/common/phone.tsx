import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Button } from "rich/component/view/button";
import { Col, Dialoug, Row } from "rich/component/view/grid";
import { Input } from "rich/component/view/input";
import { ErrorText } from "rich/component/view/text";
import { PopoverSingleton } from "rich/component/popover/popover";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";
import { channel } from "rich/net/channel";

class UserUpdatePhone extends EventsComponent {
    render() {
        return <Dialoug className={'shy-join-friend'}>
            <div className="gap-b-10">
                <Row>
                    <Col style={{marginBottom:5}}><S>手机</S></Col>
                    <Col><Input value={this.phone} onChange={e => this.phone = e}></Input></Col>
                </Row>
                <Row style={{ margin: '10px 0px' }}>
                    <Col style={{marginBottom:5}}><S>验证码</S></Col>
                    <Col span={14}><Input value={this.code} onChange={e => this.code = e}></Input></Col>
                    <Col span={8} style={{ marginLeft: 20 }}><Button block ref={e => this.sendButton = e} onClick={e => this.sendCode()}>{this.sendCount > -1 ? lst(`已发送{sendCount}s`,{sendCount:this.sendCount})  : lst(`获取短信验证码`)}</Button></Col>
                </Row>
            </div>
            <Row>
                <Col><Button block ref={e => this.button = e} onClick={e => this.save()}><S>保存</S></Button></Col>
            </Row>
            <div>
                {this.error && <ErrorText >{this.error}</ErrorText>}
            </div>
        </Dialoug>
    }
    sendCount: number = -1;
    sendTime: any;
    sendButton: Button;
    async sendCode() {
        if (this.sendCount == -1) {
            this.sendButton.loading = true;
            var r = await channel.post('/phone/sms/code', { phone: this.phone });
            this.sendButton.loading = false;
            if (r.ok && r.data.code) this.code = r.data.code;
            this.sendCount = 120;
            this.forceUpdate()
            this.sendTime = setInterval(() => {
                this.sendCount -= 1;
                if (this.sendCount == -1) {
                    clearInterval(this.sendTime);
                    this.sendTime = null;
                }
                this.forceUpdate()
            }, 1000);
        }
        else return;
    }
    phone: string = '';
    code: string = '';
    error: string = '';
    button: Button;
    async save() {
        this.error = '';
        this.forceUpdate();
        this.button.loading = true;
        var re = await channel.patch('/phone/check/update', { phone: this.phone, code: this.code });
        this.button.loading = false;
        if (re.ok) this.emit('save', this.phone);
        else this.error = re.warn;
        this.forceUpdate();
    }
    open(options: { phone: string }) {
        this.phone = options.phone;
        this.forceUpdate()
    }
}

export async function useUpdatePhone(options: { phone: string }) {
    let popover = await PopoverSingleton(UserUpdatePhone, { mask: true });
    let fv = await popover.open({ center: true });
    fv.open(options);
    return new Promise((resolve: (phone: string) => void, reject) => {
        fv.only('save', (phone: string) => {
            popover.close();
            resolve(phone);
        });
        popover.only('close', () => {
            resolve(null);
        });
    })
}
