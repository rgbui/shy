import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Button } from "rich/component/view/button";
import { Dialoug, Row, Col } from "rich/component/view/grid";
import { Input } from "rich/component/view/input";
import { PopoverSingleton } from "rich/component/popover/popover";
import { S } from "rich/i18n/view";
import { channel } from "rich/net/channel";
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import { lst } from "rich/i18n/store";

@observer
class UserUpdatePaw extends EventsComponent {
    constructor(props) {
        super(props);
        makeObservable(this, {
            oldPaw: observable,
            newPaw: observable,
            confirmPaw: observable,
            error: observable,
            checkPaw: observable
        })
    }
    render() {
        return <Dialoug style={{ width: 300 }} className={'shy-join-friend'}>

            <div className="gap-h-10">
                <div className="gap-h-10">{this.checkPaw && <Row>
                    <Col style={{ marginBottom: 5 }}><S>老密码</S></Col>
                    <Col><Input type="password" value={this.oldPaw} onChange={e => this.oldPaw = e}></Input></Col>
                </Row>}
                    <Row style={{ margin: '10px 0px' }}>
                        <Col style={{ marginBottom: 5 }}><S>新密码</S></Col>
                        <Col><Input type="password" value={this.newPaw} onChange={e => this.newPaw = e}></Input></Col>
                    </Row>
                    <Row style={{ margin: '10px 0px' }}>
                        <Col style={{ marginBottom: 5 }}><S>确认新密码</S></Col>
                        <Col><Input type="password" value={this.confirmPaw} onChange={e => this.confirmPaw = e}></Input></Col>
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
    oldPaw: string = '';
    newPaw: string = '';
    confirmPaw: string = '';
    error: string = '';
    button: Button;
    async save() {
        this.button.loading = true;
        this.error = '';
        try {
            if (this.checkPaw) {
                if (!this.oldPaw) {
                    this.error = lst('老密码不能为空');
                    return;
                }
                if (this.oldPaw.length < 6) {
                    this.error = lst('老密码不能少于6个字符');
                    return;
                }
                if (this.oldPaw.length > 20) {
                    this.error = lst('老密码不能超过20个字符');
                    return;
                }
            }
            if (!this.newPaw) {
                this.error = lst('新密码不能为空');
                return;
            }
            if (this.newPaw.length < 6) {
                this.error = lst('新密码不能少于6个字符');
                return;
            }
            if (this.newPaw.length > 20) {
                this.error = lst('新密码不能超过20个字符');
                return;
            }
            if (this.newPaw != this.confirmPaw) {
                this.error = lst('两次密码输入不一致');
                return;
            }
            var re = await channel.patch('/user/set/paw', { oldPaw: this.oldPaw, newPaw: this.newPaw, confirmPaw: this.confirmPaw });
            if (re.ok) {
                this.emit('save', true);
                return;
            }
            else this.error = re.warn;
        }
        catch (ex) {

        }
        finally {
            if (this.button)
                this.button.loading = false;
        }
    }
    checkPaw: boolean = false;
    open(options: { checkPaw: boolean }) {
        this.checkPaw = options.checkPaw;
        this.forceUpdate()
    }
}

export async function useUpdatePaw(options: { checkPaw: boolean }) {
    let popover = await PopoverSingleton(UserUpdatePaw);
    let fv = await popover.open({ center: true });
    fv.open(options);
    return new Promise((resolve, reject) => {
        fv.only('save', () => {
            popover.close();
            resolve(true);
        });
        popover.only('close', () => {
            resolve(false);
        });
    })
}