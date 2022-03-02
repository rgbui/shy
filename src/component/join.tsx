import { EventsComponent } from "rich/component/lib/events.component";
import { Button } from "rich/component/view/button";
import { Input } from "rich/component/view/input";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import { PopoverPosition } from "rich/extensions/popover/position";
import React from "rich/node_modules/@types/react";

class JoinFriend extends EventsComponent {
    render() {
        return <div className="shy-join-friend">
            <div className="shy-join-friend-head"><span>添加好友</span></div>
            <div className="shy-join-friend-content">
                <Input value={this.name} onEnter={e => this.sendFriend()} onChange={e => this.name = e}></Input>
                <Button onClick={e => this.sendFriend()}>发送好友请求</Button>
            </div>
        </div>
    }
    name: string = '';
    sendFriend() {

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
