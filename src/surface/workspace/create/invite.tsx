

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

export var InviteView = observer(function () {
    var local = useLocalObservable<{ ws: Partial<Workspace>, pids: Pid[], loading: boolean }>(() => {
        return {
            ws: null,
            pids: [],
            loading: true
        }
    })
    async function trySign() {
        var inviteCode = UrlRoute.match(ShyUrl.invite)?.id;
        if (!surface.user.isSign) {
            var url = '/invite/' + inviteCode;
            UrlRoute.push(ShyUrl.signIn, { back: url });
            return;
        }
        var w = await channel.get('/ws/invite/check', { invite: inviteCode });
        if (w.ok) {
            var rg = await channel.get('/ws/is/member', { sock: Sock.createSock(Workspace.getWsSockUrl(w.data.pids,'ws')), wsId: w.data.workspace.id })
            if (rg?.data?.exists) return UrlRoute.pushToWs(w.data.workspace.siteDomain || w.data.workspace.sn);
            local.ws = w.data.workspace;
            local.pids = w.data.pids;
            local.loading = false;
        }
    }
    async function join() {
        var sock = Sock.createSock(Workspace.getWsSockUrl(local.pids,'ws'))
        await channel.put('/user/join/ws', { wsId: local.ws.id });
        var r = await channel.put('/ws/invite/join', { wsId: local.ws.id, sock });
        await surface.loadWorkspaceList();
        return UrlRoute.pushToWs(local.ws.siteDomain || local.ws.sn);
    }
    async function refuse() {
        UrlRoute.push(ShyUrl.myWorkspace);
    }
    React.useEffect(() => {
        trySign();
    }, [])

    if (local.loading == true) return <Loading></Loading>
    return <div className="shy-invite">
        <Row align="center">邀请您加入他们的空间</Row>
        <Row align="center" style={{ marginTop: 20, marginBottom: 30 }}><Space><Button onClick={e => join()}>加入</Button><Button onClick={e => refuse()} ghost>拒绝</Button></Space></Row>
        <WsAvatar wsId={local.ws.id}></WsAvatar>
    </div>
})