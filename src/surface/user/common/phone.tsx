import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Button } from "rich/component/view/button";
import { Col, Dialoug, Row } from "rich/component/view/grid";
import { Input } from "rich/component/view/input";
import { PopoverSingleton } from "rich/component/popover/popover";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";
import { masterSock } from "../../../../net/sock";
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import { PhoneRegex } from "../../../../services/common/base";

@observer
class UserUpdatePhone extends EventsComponent {
    constructor(props) {
        super(props);
        makeObservable(this, {
            sendCount: observable,
            phone: observable,
            code: observable,
            error: observable
        })
    }
    render() {
        return <Dialoug style={{ width: 400 }} className={'shy-join-friend'}>
            <div className="gap-b-10">
                <Row>
                    <Col style={{ marginBottom: 5 }}><S>手机</S></Col>
                    <Col><Input value={this.phone} onChange={e => this.phone = e}></Input></Col>
                </Row>
                <Row style={{ margin: '10px 0px' }}>
                    <Col style={{ marginBottom: 5 }}><S>验证码</S></Col>
                    <Col span={14}><Input value={this.code} onChange={e => this.code = e}></Input></Col>
                    <Col span={8} style={{ marginLeft: 20 }}><Button block ref={e => this.sendButton = e} onClick={e => this.sendCode()}>{this.sendCount > -1 ? lst(`已发送{sendCount}s`, { sendCount: this.sendCount }) : lst(`获取短信验证码`)}</Button></Col>
                </Row>
            </div>
            <Row>
                <Col><Button block ref={e => this.button = e} onClick={e => this.save()}><S>保存</S></Button></Col>
            </Row>
           {this.error&& <div className="error gap-h-10">
                {this.error}
            </div>}
        </Dialoug>
    }
    sendCount: number = -1;
    sendTime: any;
    sendButton: Button;
    async sendCode() {
        if (!this.phone) {
            this.error = lst('手机号不能为空');
            return;
        }
        if (!PhoneRegex.test(this.phone)) {
            this.error = lst('手机号格式不正确');
            return;
        }
        if (this.sendCount == -1) {
            this.sendButton.loading = true;
            try {
                var r = await masterSock.post('/account/send/verify/code', { account: this.phone });
                if (r.ok) {
                    if (r.data?.sended) {
                        this.error = lst('验证码已发送');
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
                else {
                    this.error = r.warn;
                }
            }
            catch (ex) {

            }
            finally {
                this.sendButton.loading = false;
            }

        }
        else return;
    }
    phone: string = '';
    code: string = '';
    error: string = '';
    button: Button;
    async save() {
        try {
            this.error = '';

            this.button.loading = true;
            if (!this.phone) {
                this.error = lst('手机号不能为空');

                return;
            }
            if (!PhoneRegex.test(this.phone)) {
                this.error = lst('手机号格式不正确');
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
            var re = await masterSock.patch('/account/verify/update', { account: this.phone, code: this.code });
            if (re.data?.reged) {
                this.error = lst('手机号已注册');
                return;
            }
            if (re.ok) this.emit('save', this.phone);
            else this.error = re.warn;
        }
        catch (ex) {

        }
        finally {
            this.button.loading = false;
        }
    }
    open(options: { phone: string }) {
        this.phone = options.phone;
        this.forceUpdate()
    }
    clear() {
        if (this.sendTime) {
            clearInterval(this.sendTime);
            this.sendTime = null;
        }
    }
}

export async function useUpdatePhone(options: { phone: string }) {
    let popover = await PopoverSingleton(UserUpdatePhone, { mask: true });
    let fv = await popover.open({ center: true });
    fv.open(options);
    return new Promise((resolve: (phone: string) => void, reject) => {
        fv.only('save', (phone: string) => {
            fv.clear();
            popover.close();
            resolve(phone);
        });
        popover.only('close', () => {
            fv.clear();
            resolve(null);
        });
    })
}
