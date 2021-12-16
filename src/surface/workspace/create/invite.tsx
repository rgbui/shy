
import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { Button } from "rich/component/view/button";
import { Row, Space } from "rich/component/view/grid";
import { Loading } from "rich/component/view/loading";
import { Workspace } from "..";
import { surface } from "../..";
import { memberWorkspaceService } from "../../../../services/member";
import { Avatar } from "../../../components/face";
import { ShyUrl, UrlRoute } from "../../../history";
export var InviteView = observer(function () {
    var local = useLocalObservable<{ ws: Workspace, loading: boolean }>(() => {
        return {
            ws: null,
            loading: false
        }
    })
    async function trySign() {
        var inviteCode = UrlRoute.match(ShyUrl.invite)?.id;
        if (!surface.user.isSign) {
            var url = '/invite/' + inviteCode;
            UrlRoute.push(ShyUrl.signIn, { back: url });
            return;
        }
        var w = await memberWorkspaceService.isInvite(inviteCode, surface.user.id);
        if (w.ok) {
            if (w.data.memeber == true) return UrlRoute.pushToWs(w.data.customizeSecondDomain || w.data.sn);
            local.ws = w.data as any;
        }
    }
    async function join() {
        var r = await memberWorkspaceService.inviteJoin(local.ws.id);
        return UrlRoute.pushToWs(local.ws.customizeSecondDomain || local.ws.sn);
    }
    async function refuse() {
        UrlRoute.push(ShyUrl.myWorkspace);
    }
    React.useEffect(() => {
        trySign();
    }, [])

    if (local.loading == true) return <Loading></Loading>
    return <div className="shy-invite">
        <Row align="center">
            <Avatar icon={local.ws.icon} text={local.ws.text}> </Avatar>
        </Row>
        <Row>邀请您加入他们的空间</Row>
        <Row><Space><Button onClick={e => join()}>加入</Button><Button onClick={e => refuse()} ghost>拒绝</Button></Space></Row>
    </div>
})