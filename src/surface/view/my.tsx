
import { observer } from "mobx-react";
import { Loading } from "rich/component/view/loading";
import React from 'react';
import { sCache, CacheKey } from "../../../net/cache";
import { UrlRoute, ShyUrl } from "../../history";
import { channel } from "rich/net/channel";
import { Workspace } from "../workspace";
import { surface } from "..";
import { Sock } from "../../../net/sock";

export var MyWorkSpace = observer(function () {
    async function load() {
        if (!surface.user.isSign) {
            return UrlRoute.push(ShyUrl.signIn);
        }
        var wsHost = await sCache.get(CacheKey.wsHost);
        var latest = await channel.get('/ws/latest', { name: wsHost ? wsHost : undefined });
        if (latest.ok) {
            var ws = latest.data?.workspace as Workspace;
            if (ws.access == 0 || typeof ws.access == 'undefined') {
                if (ws.owner != surface.user?.id) {
                    var r = await channel.get('/ws/is/member', { sock: Sock.createWorkspaceSock(ws), wsId: ws.id });
                    if (!(r.data?.exists)) {
                        await sCache.set(CacheKey.wsHost, null);
                        return UrlRoute.push(ShyUrl.myWorkspace);
                    }
                }
            }
            if (ws) return UrlRoute.pushToWs(ws?.siteDomain || ws.sn, true);
            else return UrlRoute.push(ShyUrl.workCreate);
        }
    }
    React.useEffect(() => { load(); })
    return <Loading></Loading>
})