import { observer } from "mobx-react";
import React from "react";
import { channel } from "rich/net/channel";
import { surface } from "../store";
import { useJoinWorkspaceProtocol } from "../workspace/create/protocol";
import { S } from "rich/i18n/view";
export var JoinTip = observer(function () {
    async function mousedown(event: React.MouseEvent) {
        var agree = false;
        if (surface.workspace?.accessProfile?.checkJoinProtocol) {
            var rg = await useJoinWorkspaceProtocol({ center: true, centerTop: 100 }, surface.workspace);
            if (!rg) return;
            agree = true;
        }
        await channel.put('/user/join/ws', {
            wsId: surface.workspace.id
        });
        await channel.put('/ws/invite/join', {
            wsId: surface.workspace.id,
            sock: surface.workspace.sock,
            agree,
            username: surface.user.name,
        });
        surface.loadWorkspaceList();
        await surface.onLoadWorkspace(surface.workspace.id);
    }
    return <div className='shy-supervisor-join-tip' >
        <span><S text='您当前处于预览模式加入该空间一起协作吧'>您当前处于预览模式，加入该空间一起协作吧</S></span>
        <a onMouseDown={e => mousedown(e)}>加入&nbsp;{surface.workspace?.text}</a>
    </div>
})
