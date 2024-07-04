import { observer } from "mobx-react";
import React from "react";
import { Button } from "rich/component/view/button";
import { Divider } from "rich/component/view/grid";
import { Input } from "rich/component/view/input";
import { surface } from "../../../app/store";
import { S } from "rich/i18n/view";
import { lst } from "rich/i18n/store";
import { HelpText } from "rich/component/view/text";
import Pic from "../../../../assert/img/invite-user.png";
import { ShyAlert } from "rich/component/lib/alert";

@observer
export class WorkspaceInvite extends React.Component {
    async createInvite(force?: boolean) {
        if(!surface.workspace.isManager) return ShyAlert(lst('你没有权限'));
        await surface.workspace.onCreateInvite(true, force);
        if (this.input) this.input.updateValue(surface.workspace.getInviteUrl());
    }
    input: Input;
    render() {

        return <div className='shy-ws-invites'>
            <div className="h2 flex">
                <span className="flex-fixed"><S>邀请成员</S></span>
                <span className="flex-fixed"><HelpText style={{ fontWeight: 'normal' }} url={window.shyConfig?.isUS ? "https://help.shy.red/page/63" : "https://help.shy.live/page/1896"}>了解如何邀请成员加入空间</HelpText></span>
            </div>
            <Divider></Divider>
            <div className="bold f-14 gap-t-10"><S>通用的邀请链接</S></div>
            <div className="remark f-12 gap-h-10">
                <S text='得到此链接的人均可以加入这个空间'>任何得到此链接的人均可以加入这个空间(空间没有人数上限的限制)，你也可以</S><a className="link undeline cursor" onMouseDown={e => this.createInvite(true)}><S>重置链接</S></a>
            </div>
            
            <div className="flex max-w-500">
                <Input ref={e => this.input = e}
                    readonly={true}
                    value={surface.workspace.getInviteUrl()}></Input>
                <Button className="gap-l-10"
                    onClick={e => this.createInvite()}
                    ghost>{surface.workspace.invite ? lst('复制链接') : lst('创建链接')}</Button>
            </div>

            <div className="flex-center gap-t-50">

                    <img src={Pic} style={{ maxWidth: 400 }} className="object-center" />

                </div>

        </div>
    }
}