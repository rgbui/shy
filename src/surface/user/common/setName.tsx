import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Button } from "rich/component/view/button";
import { Dialoug, Row, Col } from "rich/component/view/grid";
import { Input } from "rich/component/view/input";
import { ErrorText } from "rich/component/view/text";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import { surface } from "../../store";

class UserModifyName extends EventsComponent {
    render() {
        return <Dialoug className={'shy-join-friend'} head={<span>设置用户名</span>}>
            <Row>
                <Col>用户名</Col>
                <Col><Input value={this.name} onChange={e => this.name = e}></Input></Col>
            </Row>
            <Row style={{ marginTop: 10 }}>
                <Col><Button block ref={e => this.button = e} onClick={e => this.save()}>保存</Button></Col>
            </Row>
            <div>
                {this.error && <ErrorText >{this.error}</ErrorText>}
            </div>
        </Dialoug>
    }
    name: string = '';
    error: string = '';
    button: Button;
    async save() {
        this.error = '';
        this.forceUpdate();
        this.button.loading = true;
        await surface.user.onUpdateUserInfo({ name: this.name });
        this.button.loading = false;
        this.forceUpdate();
        this.emit('close');
    }
    open() {
        this.name = surface.user.name;
        this.forceUpdate()
    }
}
export async function useModifyName() {
    let popover = await PopoverSingleton(UserModifyName, { mask: true });
    let fv = await popover.open({ center: true });
    fv.open();
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