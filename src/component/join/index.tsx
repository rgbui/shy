import { Alert } from "rich/component/lib/alert";
import { EventsComponent } from "rich/component/lib/events.component";
import { Button } from "rich/component/view/button";
import { Input } from "rich/component/view/input";
import { ErrorText, Remark } from "rich/component/view/text";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import { PopoverPosition } from "rich/extensions/popover/position";
import { channel } from "rich/net/channel";
import React from "react";
import { Dialoug } from "rich/component/view/grid";
import "./style.less";

class JoinFriend extends EventsComponent {
    render() {
        return <Dialoug className={'shy-join-friend'}
            head={<span>添加好友</span>}
        >
            <Remark>请输入用户的诗云号(数字）</Remark>
            <div className="shy-join-friend-input">
                <Input value={this.name} onEnter={e => this.sendFriend()} onChange={e => this.name = e}></Input>
                <Button ref={e => this.button = e} onClick={e => this.sendFriend()}>发送好友请求</Button>
            </div>
            <div>
                {this.error && <ErrorText >{this.error}</ErrorText>}
            </div>
        </Dialoug>
    }
    name: string = '';
    error: string = '';
    button: Button;
    async sendFriend() {
        this.error = '';
        this.forceUpdate();
        if (this.name && /^[\d]+$/g.test(this.name)) {
            this.button.loading = true;
            var r = await channel.put('/friend/join', { sn: parseInt(this.name) });
            this.button.loading = false;
            if (r.ok) {
                if (r.data.exists) {
                    await Alert('好友请求已发送')
                }
                else if (r.data.exists == false) {
                    await Alert('帐号不存在')
                }
                else if (r.data.send) {
                    this.emit('close')
                }
            }
        }
        else this.error = '请输入合法的诗云号';
        this.forceUpdate();
    }
    open() {

    }
}

export async function useJoinFriend(pos: PopoverPosition) {
    let popover = await PopoverSingleton(JoinFriend);
    let fv = await popover.open(pos);
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
