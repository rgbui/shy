

import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { Button } from "rich/component/view/button";
import { channel } from "rich/net/channel";
import { Workspace } from "..";
import { surface } from "../../store";
import { ShyUrl, UrlRoute } from "../../../history";
import { WsAvatar } from "rich/component/view/avator/ws";
import { Sock } from "../../../../net/sock";
import { Pid } from "../declare";
import { Spin } from "rich/component/view/spin";
import { isMobileOnly } from "react-device-detect";
import { Confirm } from "rich/component/lib/confirm";
import { useJoinWorkspaceProtocol } from "./protocol";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";

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
        var w = await channel.get('/ws/invite/check', { invite: inviteCode });
        if (w.ok) {
            var rg = {} as any;
            if (surface.user.isSign) rg = await channel.get('/ws/is/member', {
                sock: Sock.createSock(Workspace.getWsSockUrl(w.data.pids, 'ws')),
                wsId: w.data.workspace.id
            })
            if (rg?.data?.exists) return UrlRoute.pushToWs(w.data.workspace.siteDomain || w.data.workspace.sn);
            local.ws = Object.assign({}, w.data.workspace || {}, rg?.data?.workspace || {});
            local.pids = w.data.pids;
            local.loading = false;
        }
    }
    async function join() {
        if (!surface.user.isSign) {
            if (await Confirm(lst('您还未登录，是否登录后加入？'))) {
                var inviteCode = UrlRoute.match(ShyUrl.invite)?.id;
                var url = '/invite/' + inviteCode;
                UrlRoute.push(ShyUrl.signIn, { back: url });
            }
            return;
        }
        var agree = false;
        if (local.ws?.accessProfile?.checkJoinProtocol) {
            var rg = await useJoinWorkspaceProtocol({ center: true, centerTop: 100 }, local.ws);
            if (!rg) return;
            agree = true;
        }
        var sock = Workspace.getWsSock(local.pids, 'ws')
        await channel.put('/user/join/ws', { wsId: local.ws.id });
        var r = await channel.put('/ws/invite/join', {
            wsId: local.ws.id,
            username: surface.user.name,
            sock,
            agree
        });
        await surface.loadWorkspaceList();
        return UrlRoute.pushToWs(local.ws.siteDomain || local.ws.sn);
    }
    async function refuse() {
        UrlRoute.push(ShyUrl.home);
    }
    React.useEffect(() => {
        loadInviteWorkspace();
    }, [])

    if (local.loading == true) return <div className="gap-h-30 flex-center">
        <Spin></Spin>
    </div>
    return <div className="shy-invite padding-w-80 padding-b-40 round-16" style={{ width: isMobileOnly ? "calc(100vw - 40px)" : 350 }}>
        {local.ws.accessProfile?.disabledJoin && <div>
            <div className="flex-center  gap-h-30">
                <span className="error-bg round padding-w-5 padding-h-2"><S>您无法加入，该空间已禁止成员加入</S></span>
            </div>
            <div>
                <WsAvatar wsId={local.ws.id}></WsAvatar>
            </div>
        </div>}
        {!local.ws.accessProfile.disabledJoin && <div>
            <div className="flex-center f-16 bold gap-h-20">
                <S>邀请您加入</S>{local.ws.text}
            </div>
            <div >
                <WsAvatar wsId={local.ws.id}></WsAvatar>
            </div>
            <div className="gap-h-10">
                <Button size="larger" block onClick={e => join()}><S>接受邀请</S></Button>
            </div>

        </div>}

    </div>
})