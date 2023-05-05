

import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { Button } from "rich/component/view/button";
import { Row, Space } from "rich/component/view/grid";
import { Loading } from "rich/component/view/loading";
import { channel } from "rich/net/channel";
import { Workspace } from "..";
import { surface } from "../../store";
import { ShyUrl, UrlRoute } from "../../../history";
import { WsAvatar } from "rich/component/view/avator/ws";
import { Sock } from "../../../../net/sock";
import { Pid } from "../declare";
import { Spin } from "rich/component/view/spin";
export var InviteView = observer(function () {
    var local = useLocalObservable<{
        ws: Partial<Workspace>,
        pids: Pid[],
        loading: boolean
    }>(() => {
        return {
            ws: null,
            pids: [],
            loading: true
        }
    })
    async function loadInviteWorkspace() {
        var inviteCode = UrlRoute.match(ShyUrl.invite)?.id;
        if (!surface.user.isSign) {
            var url = '/invite/' + inviteCode;
            UrlRoute.push(ShyUrl.signIn, { back: url });
            return;
        }
        var w = await channel.get('/ws/invite/check', { invite: inviteCode });
        if (w.ok) {
            var rg = await channel.get('/ws/is/member', {
                sock: Sock.createSock(Workspace.getWsSockUrl(w.data.pids, 'ws')),
                wsId: w.data.workspace.id
            })
            if (rg?.data?.exists) return UrlRoute.pushToWs(w.data.workspace.siteDomain || w.data.workspace.sn);
            local.ws = Object.assign({}, w.data.workspace || {}, rg.data.workspace || {});
            local.pids = w.data.pids;
            local.loading = false;
        }
    }
    async function join() {
        var sock = Sock.createSock(Workspace.getWsSockUrl(local.pids, 'ws'))
        await channel.put('/user/join/ws', { wsId: local.ws.id });
        var r = await channel.put('/ws/invite/join', { wsId: local.ws.id, sock });
        await surface.loadWorkspaceList();
        return UrlRoute.pushToWs(local.ws.siteDomain || local.ws.sn);
    }
    async function refuse() {
        UrlRoute.push(ShyUrl.myWorkspace);
    }
    React.useEffect(() => {
        loadInviteWorkspace();
    }, [])

    if (local.loading == true) return <div className="gap-h-30 flex-center">
        <Spin></Spin>
    </div>
    return <div className="shy-invite">
        {local.ws.accessProfile?.disabledJoin && <div className="flex flex-center">
            <div className="flex-center error gap-h-30">
                您无法加入，空间禁止成员加入
            </div>
            <div>
                <WsAvatar wsId={local.ws.id}></WsAvatar>
            </div>
        </div>}
        {!local.ws.accessProfile.disabledJoin && <div>
            <div className="flex-center">
                邀请您加入{local.ws.text}
            </div>
            <div className="flex-center">
                <Button onClick={e => join()}>加入</Button><Button onClick={e => refuse()} ghost>拒绝</Button>
            </div>
            <div className="flex-center">
                <WsAvatar wsId={local.ws.id}></WsAvatar>
            </div>
        </div>}
        
    </div>
})