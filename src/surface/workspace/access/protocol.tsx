import React from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Dialoug } from "rich/component/view/grid";

import { Workspace } from "..";
import { Button } from "rich/component/view/button";
import { CheckBox } from "rich/component/view/checkbox";
import { ShyAlert } from "rich/component/lib/alert";
import { S } from "rich/i18n/view";
import { lst } from "rich/i18n/store";
import { PopoverSingleton } from "rich/component/popover/popover";
import { PopoverPosition } from "rich/component/popover/position";
import { LazyMarkdown } from "rich/component/view/markdown/lazy";

class JoinWorkspaceProtocol extends EventsComponent {
    render() {
        return <Dialoug className={'shy-join-friend'}
        // head={<span>加入<b className="bold">{this.ws?.text}</b>空间</span>}
        >
            <div className="flex remark">
                <S>您需要同意以下协议才能加入空间</S>
            </div>
            <div className="border gap-h-10 round  padding-10 overlay-y  max-h-300 ">
                <LazyMarkdown md={this.ws?.accessProfile?.joinProtocol}></LazyMarkdown>
            </div>
            <div className="flex">
                <CheckBox checked={this.checked} onChange={e => this.checked = e}><S>我已阅读并同意</S></CheckBox>
            </div>
            <div className="flex-center r-gap-10">
                <Button onClick={e => this.save()}><S>确认</S></Button>
            </div>
        </Dialoug>
    }
    checked: boolean = false;
    ws: Partial<Workspace>
    open(ws: Partial<Workspace>) {
        this.ws = ws;
        this.checked = false;
        this.forceUpdate()
    }
    save() {
        if (this.checked) this.emit('save')
        else ShyAlert(lst('您需要同意才能加入'))
    }
}

export async function useJoinWorkspaceProtocol(pos: PopoverPosition, ws: Partial<Workspace>) {
    let popover = await PopoverSingleton(JoinWorkspaceProtocol, { mask: true, shadow: true });
    let fv = await popover.open(pos);
    fv.open(ws);
    return new Promise((resolve, reject) => {
        fv.only('close', () => {
            popover.close();
            resolve(false);
        });
        fv.only('save', () => {
            popover.close();
            resolve(true);
        })
        popover.only('close', () => {
            resolve(false);
        });
    })
}