import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Button } from "rich/component/view/button";
import { Dialoug, Row, Col } from "rich/component/view/grid";
import { Input } from "rich/component/view/input";
import { ErrorText } from "rich/component/view/text";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import { PopoverPosition } from "rich/extensions/popover/position";
import { channel } from "rich/net/channel";

class UserUpdatePaw extends EventsComponent {
    render() {
        return <Dialoug className={'shy-join-friend'}
            head={<span>设置手机号</span>}
        >
            {this.checkPaw && <Row>
                <Col>老密码</Col>
                <Col><Input value={this.oldPaw} onChange={e => this.oldPaw = e}></Input></Col>
            </Row>}
            <Row>
                <Col>新密码</Col>
                <Col><Input value={this.newPaw} onChange={e => this.newPaw = e}></Input></Col>
            </Row>
            <Row>
                <Col>确认新密码</Col>
                <Col><Input value={this.confirmPaw} onChange={e => this.confirmPaw = e}></Input></Col>
            </Row>
            <Row>
                <Col><Button ref={e => this.button = e} onClick={e => this.save()}>保存</Button></Col>
            </Row>
            <div>
                {this.error && <ErrorText >{this.error}</ErrorText>}
            </div>
        </Dialoug>
    }
    oldPaw: string = '';
    newPaw: string = '';
    confirmPaw: string = '';
    error: string = '';
    button: Button;
    async save() {
        this.error = '';
        this.forceUpdate();
        this.button.loading = true;
        var re = await channel.patch('/user/set/paw', { oldPaw: this.oldPaw, newPaw: this.newPaw, confirmPaw: this.confirmPaw });
        this.button.loading = false;
        if (re.ok) this.emit('close')
        else this.error = re.warn;
        this.forceUpdate();
    }
    checkPaw: boolean = false;
    open(options: { checkPaw: boolean }) {
        this.checkPaw = options.checkPaw;
        this.forceUpdate()
    }
}

export async function useUpdatePaw(pos: PopoverPosition, options: { checkPaw: boolean }) {
    let popover = await PopoverSingleton(UserUpdatePaw);
    let fv = await popover.open(pos);
    fv.open(options);
    return new Promise((resolve, reject) => {
        fv.only('close', () => {
            popover.close();
            resolve(true);
        });
        popover.only('close', () => {
            resolve(true);
        });
    })
}