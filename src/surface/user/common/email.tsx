import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Button } from "rich/component/view/button";
import { Col, Dialoug, Row } from "rich/component/view/grid";
import { Input } from "rich/component/view/input";
import { ErrorText } from "rich/component/view/text";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import { channel } from "rich/net/channel";


class UserUpdateEmail extends EventsComponent {
    render() {
        return <Dialoug className={'shy-join-friend'} head={<span>设置邮箱</span>}>
            <div className="gap-h-30">
                <Row>
                    <Col>邮箱</Col>
                    <Col><Input value={this.email} onChange={e => this.email = e}></Input></Col>
                </Row>
                <Row style={{ margin: '10px 0px' }}>
                    <Col>验证码</Col>
                    <Col span={16}><Input value={this.code} onChange={e => this.code = e}></Input></Col>
                    <Col span={6} style={{ marginLeft: 20 }}><Button block ref={e => this.sendButton = e} onClick={e => this.sendCode()}>{this.sendCount > -1 ? `已发送${this.sendCount}s` : `获取验证码`}</Button></Col>
                </Row>
            </div>
            <Row>
                <Col><Button block ref={e => this.button = e} onClick={e => this.save()}>保存</Button></Col>
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
            var r = await channel.post('/email/send/code', { email: this.email });
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
    email: string = '';
    code: string = '';
    error: string = '';
    button: Button;
    async save() {
        this.error = '';
        this.forceUpdate();
        this.button.loading = true;
        var re = await channel.patch('/email/check/update', { email: this.email, code: this.code });
        this.button.loading = false;
        if (re.ok) this.emit('save', this.email)
        else this.error = re.warn;
        this.forceUpdate();
    }
    open(options: { email: string }) {
        this.email = options.email;
        this.forceUpdate()
    }
}

export async function useUpdateEmail(options: { email: string }) {
    let popover = await PopoverSingleton(UserUpdateEmail, { mask: true });
    let fv = await popover.open({ center: true });
    fv.open(options);
    return new Promise((resolve: (emal: string) => void, reject) => {
        fv.only('save', (email: string) => {
            popover.close();
            resolve(email);
        });
        popover.only('close', () => {
            resolve(null);
        });
    })
}
