
import { observer } from "mobx-react";
import { Loading } from "rich/component/view/loading";
import React from 'react';
import { sCache, CacheKey } from "../../../net/cache";
import { UrlRoute, ShyUrl } from "../../history";
import { channel } from "rich/net/channel";
import { Workspace } from "../workspace";
import { surface } from "../store";

export var MyWorkSpace = observer(function () {
    async function load() {
        if (!surface.user.isSign) {
            return UrlRoute.push(ShyUrl.signIn);
        }
        var wsHost = await sCache.get(CacheKey.wsHost);
        var latest = await channel.get('/ws/latest', { name: wsHost ? wsHost : undefined });
        if (latest.data?.workspace) {
            var ws = latest.data?.workspace as Workspace;
            if (ws) {
                await surface.loadWorkspaceList();
                return UrlRoute.pushToWs(ws?.siteDomain || ws.sn, true);
            }
            else return UrlRoute.push(ShyUrl.workCreate);
        } else return UrlRoute.push(ShyUrl.workCreate);
    }
    React.useEffect(() => { load(); })
    return <Loading></Loading>
})