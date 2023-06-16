import { observer } from "mobx-react";
import React from "react";
import { Button } from "rich/component/view/button";
import { Divider } from "rich/component/view/grid";
import { Input } from "rich/component/view/input";
import { surface } from "../../../store";
@observer
export class WorkspaceInvite extends React.Component {
    async createInvite(force?: boolean) {
        await surface.workspace.onCreateInvite(true, force);
        if (this.input) this.input.updateValue(surface.workspace.getInviteUrl());
    }
    input: Input;
    render() {

        return <div className='shy-ws-invites'>
            <div className="h2">邀请</div>
            <Divider></Divider>
            <div className="bold f-14 gap-t-10">通用的邀请链接</div>
            <div className="remark f-12 gap-h-10">
                任何得到此链接的人均可以加入这个空间(空间没有人数上限的限制)，你也可以<a className="link undeline cursor" onMouseDown={e => this.createInvite(true)}>重置链接</a>
            </div>
            <div className="flex max-w-500">
                <Input ref={e => this.input = e}
                    readonly={true}
                    value={surface.workspace.getInviteUrl()}></Input>
                <Button className="gap-l-10"
                    onClick={e => this.createInvite()}
                    ghost>{surface.workspace.invite ? '复制链接' : '创建链接'}</Button>
            </div>

        </div>
    }
}