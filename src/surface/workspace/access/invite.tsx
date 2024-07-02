

import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { Button } from "rich/component/view/button";
import { channel } from "rich/net/channel";
import { Workspace } from "..";
import { surface } from "../../app/store";
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
import { runInAction } from "mobx";
import { getDeskLocalPids } from "../../app/desk";

export var InviteView = observer(function () {
    var local = useLocalObservable<{
        ws: Partial<Workspace>,
        pids: Pid[],
        loading: boolean,
        exists: boolean,
        notFound: boolean

    }>(() => {
        return {
            ws: null,
            pids: [],
            loading: true,
            exists: false,
            notFound: false
        }
    })
    async function loadInviteWorkspace() {
        try {
            var inviteCode = UrlRoute.match(ShyUrl.invite)?.id;
            var w = await channel.get('/ws/invite/check', { invite: inviteCode });
            if (w.ok) {
                var rg = {} as any;
                var pids = w.data.pids;
                if (w.data.workspace?.datasource == 'private-local') {
                    pids = await getDeskLocalPids()
                }
                if (surface.user.isSign) rg = await channel.get('/ws/is/member', {
                    sock: Sock.createSock(Workspace.getWsSockUrl(pids, 'ws')),
                    wsId: w.data.workspace.id
                })
                // if (rg?.data?.exists) return UrlRoute.pushToWs(w.data.workspace.siteDomain || w.data.workspace.sn);
                runInAction(() => {
                    local.exists = rg?.data?.exists;
                    local.ws = Object.assign({}, w.data.workspace || {}, rg?.data?.workspace || {});

                    local.pids = pids;

                })
                if (local.exists) {
                    goto()
                }
            }
            else local.notFound = true;
        }
        catch (ex) {

        }
        finally {
            local.loading = false;
        }

    }
    async function join() {
        if (!surface.user.isSign) {
            if (await Confirm(lst('您还未登录是否登录后加入', '您还未登录，是否登录后加入？'))) {
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
        var sock = Workspace.getWsSock(local.pids, 'ws', local.ws.id)
        await channel.put('/user/join/ws', { wsId: local.ws.id });
        var r = await channel.put('/ws/invite/join', {
            wsId: local.ws.id,
            username: surface.user.name,
            sock,
            agree
        });
        goto();
    }
    async function goto() {
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
        {local.notFound && <div className="padding-t-40">
            <div className="flex-center">
                <span className="error-bg round padding-w-5 padding-h-2"><S>邀请的空间地址不存在或已失效</S></span>
            </div>
            <div className="flex-center gap-t-10">
                <span>返回<a href='https://shy.live'>诗云</a></span>
            </div>
        </div>}
        {local.ws && local.ws.accessProfile?.disabledJoin && <div>
            <div className="flex-center  gap-h-30">
                <span className="error-bg round padding-w-5 padding-h-2"><S>您无法加入，该空间已禁止成员加入</S></span>
            </div>
            <div>
                <WsAvatar wsId={local.ws.id}></WsAvatar>
            </div>
        </div>}
        {local.ws && !local.ws.accessProfile?.disabledJoin && <div>
            <div className="flex-center f-16  gap-h-20">
                <S>邀请您加入</S><span className="bold">{local.ws.text}</span>
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