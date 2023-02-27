import { observer } from "mobx-react";
import React from "react";
import { channel } from "rich/net/channel";
import { surface } from "..";
export var JoinTip = observer(function () {
    async function mousedown(event: React.MouseEvent) {
        await channel.put('/user/join/ws', {
            wsId: surface.workspace.id
        });
        await channel.put('/ws/invite/join', {
            wsId: surface.workspace.id,
            sock: surface.workspace.sock
        });
        surface.loadWorkspaceList();
        await surface.onLoadWorkspace(surface.workspace.id);
    }
    return <div className='shy-supervisor-join-tip' >
        <span>您当前处于预览模式，加入该空间一起协作吧</span>
        <a onMouseDown={e => mousedown(e)}>加入&nbsp;{surface.workspace?.text}</a>
    </div>
})
