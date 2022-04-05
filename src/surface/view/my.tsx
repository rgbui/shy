
import { observer } from "mobx-react";
import { Loading } from "rich/component/view/loading";
import React from 'react';
import { sCache, CacheKey } from "../../../net/cache";

import { UrlRoute, ShyUrl } from "../../history";

import { channel } from "rich/net/channel";

export var MyWorkSpace = observer(function () {
    async function load() {
        var wsHost = await sCache.get(CacheKey.wsHost);
        if (wsHost) {
            var r = await channel.get('/ws/basic', { name: wsHost });
            if (r.data?.workspace?.id) return UrlRoute.pushToWs(r.data?.workspace?.sn);
        }
        var latest = await channel.get('/ws/latest');
        if (latest.ok) {
            if (latest.data.workspace) return UrlRoute.pushToWs(latest.data.workspace?.sn);
            else return UrlRoute.push(ShyUrl.workCreate);
        }
    }
    React.useEffect(() => { load(); })
    return <Loading></Loading>
})