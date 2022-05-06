
import { observer } from "mobx-react";
import { Loading } from "rich/component/view/loading";
import React from 'react';
import { sCache, CacheKey } from "../../../net/cache";
import { UrlRoute, ShyUrl } from "../../history";
import { channel } from "rich/net/channel";
import { Workspace } from "../workspace";

export var MyWorkSpace = observer(function () {
    async function load() {
        var wsHost = await sCache.get(CacheKey.wsHost);
        if (wsHost) {
            var r = await channel.get('/ws/basic', { name: wsHost });
            var ws = r.data?.workspace as Workspace;
            if (ws?.id) return UrlRoute.pushToWs(ws?.customSiteDomain || ws.sn, true);
        }
        var latest = await channel.get('/ws/latest');
        if (latest.ok) {
            var ws = latest.data?.workspace as Workspace;
            if (ws) return UrlRoute.pushToWs(ws?.customSiteDomain || ws.sn, true);
            else return UrlRoute.push(ShyUrl.workCreate);
        }
    }
    React.useEffect(() => { load(); })
    return <Loading></Loading>
})