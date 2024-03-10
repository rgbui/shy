import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { PopoverSingleton } from "rich/component/popover/popover";
import { Button } from "rich/component/view/button";
import { Col, Dialoug, Row } from "rich/component/view/grid";
import { Input } from "rich/component/view/input";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";
import { masterSock } from "../../../../net/sock";
import { observer } from "mobx-react";
import { makeObservable, observable } from "mobx";
import { EmailRegex } from "../../../../services/common/base";

@observer
class UserUpdateEmail extends EventsComponent {
    constructor(props) {
        super(props);
        makeObservable(this, {
            sendCount: observable,
            email: observable,
            code: observable,
            error: observable
        })
    }
    render() {
        return <Dialoug style={{ width: 300 }} className={'shy-join-friend'}>
            <div className="gap-h-10">
                <div className="gap-b-10">
                    <Row>
                        <Col  className="remark f-12" style={{ marginBottom: 5 }}><S>邮箱</S></Col>
                        <Col><Input value={this.email} onChange={e => this.email = e}></Input></Col>
                    </Row>
                    <Row style={{ margin: '10px 0px' }}>
                        <Col  className="remark f-12" style={{ marginBottom: 5 }}><S>验证码</S></Col>
                        <Col span={14}><Input value={this.code} onChange={e => this.code = e}></Input></Col>
                        <Col span={8} style={{ marginLeft: 20 }}><Button block ref={e => this.sendButton = e} onClick={e => this.sendCode()}>{this.sendCount > -1 ? lst(`已发送{sendCount}s`, { sendCount: this.sendCount }) : lst(`获取验证码`)}</Button></Col>
                    </Row>
                </div>
                <Row>
                    <Col><Button block ref={e => this.button = e} onClick={e => this.save()}><S>保存</S></Button></Col>
                </Row>
                {this.error && <div className="error gap-h-10">
                    {this.error}
                </div>}
            </div>
        </Dialoug>
    }
    sendCount: number = -1;
    sendTime: any;
    sendButton: Button;
    async sendCode() {
        this.error = '';
        if (!this.email) {
            this.error = lst('邮箱不能为空');
            return;
        }
        if (!EmailRegex.test(this.email)) {
            this.error = lst('邮箱格式不正确');
            return;
        }
        if (this.sendCount == -1) {
            try {
                this.sendButton.loading = true;
                var r = await masterSock.post('/account/send/verify/code', { account: this.email });
                if (r.data?.sended) {
                    this.error = lst('邮箱校验码已发送');
                    return;
                }
                if (r.ok && r.data.code) this.code = r.data.code;
                this.sendCount = 120;
                this.sendTime = setInterval(() => {
                    this.sendCount -= 1;
                    if (this.sendCount == -1) {
                        clearInterval(this.sendTime);
                        this.sendTime = null;
                    }
                }, 1000);
            }
            catch (ex) {

            }
            finally {
                this.sendButton.loading = false;
            }
        }
        else return;
    }
    email: string = '';
    code: string = '';
    error: string = '';
    button: Button;
    async save() {
        try {
            this.button.loading = true;
            this.error = '';
            if (!this.email) {
                this.error = lst('邮箱不能为空');
                return;
            }
            if (!EmailRegex.test(this.email)) {
                this.error = lst('邮箱格式不正确');
                return;
            }
            if (!this.code) {
                this.error = lst('验证码不能为空');
                return;
            }
            if (this.code.length !== 4) {
                this.error = lst('验证码不正确');
                return;
            }
            var re = await masterSock.patch('/account/verify/update', { account: this.email, code: this.code });
            if (re.data?.reged) {
                this.error = lst('邮箱已注册');
                return;
            }
            else if (re.warn) {
                this.error = re.warn;
                return;
            }
            else if (re?.ok) {
                this.emit('save', this.email)
            }
        }
        catch (ex) {

        }
        finally {
            this.button.loading = false
        }
    }
    open(options: { email: string }) {
        this.email = options.email;
        this.forceUpdate()
    }
    clear() {
        if (this.sendTime) {
            clearInterval(this.sendTime);
            this.sendTime = null;
        }
    }
}

export async function useUpdateEmail(options: { email: string }) {
    let popover = await PopoverSingleton(UserUpdateEmail, { mask: true });
    let fv = await popover.open({ center: true });
    fv.open(options);
    return new Promise((resolve: (emal: string) => void, reject) => {
        fv.only('save', (email: string) => {
            fv.clear();
            popover.close();
            resolve(email);
        });
        popover.only('close', () => {
            fv.clear();
            resolve(null);
        });
    })
}
