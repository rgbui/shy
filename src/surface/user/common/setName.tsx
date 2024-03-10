import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Button } from "rich/component/view/button";
import { Dialoug, Row, Col } from "rich/component/view/grid";
import { Input } from "rich/component/view/input";
import { ErrorText } from "rich/component/view/text";
import { PopoverSingleton } from "rich/component/popover/popover";
import { surface } from "../../store";
import { S } from "rich/i18n/view";
import { observer } from "mobx-react";
import { makeObservable, observable } from "mobx";

@observer
class UserModifyName extends EventsComponent {
    constructor(props) {
        super(props);
        makeObservable(this, {
            name: observable,
            error: observable
        })
    }
    render() {
        return <Dialoug style={{ width: 300 }} className={'shy-join-friend'}>
            <div className="gap-h-10">
            <Row style={{ marginBottom: 10 }}>
                <Col className="remark f-12"  style={{ marginBottom: 5 }}><S>用户名</S></Col>
                <Col><Input value={this.name} onChange={e => this.name = e}></Input></Col>
            </Row>
            <Row style={{ marginTop: 10 }}>
                <Col><Button block ref={e => this.button = e} onClick={e => this.save()}><S>保存</S></Button></Col>
            </Row>
            {this.error&& <div className="error gap-h-10">
                {this.error}
            </div>}
            </div>
          
        </Dialoug>
    }
    name: string = '';
    error: string = '';
    button: Button;
    async save() {
        try {
            this.button.loading = true;
            this.error = '';
            if (!this.name) {
                this.error = '用户名不能为空';
                return;
            }
            if (this.name.length > 20) {
                this.error = '用户名不能超过20个字符';
                return;
            }
            await surface.user.onUpdateUserInfo({ name: this.name });
            this.emit('close');
        }
        catch (ex) {

        }
        finally {
            this.button.loading = false;
        }
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