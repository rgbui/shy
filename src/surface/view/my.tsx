
import { observer } from "mobx-react";
import { Loading } from "rich/component/view/loading";
import React from 'react';
import { sCache, CacheKey } from "../../../net/cache";
import { workspaceService } from "../../../services/workspace";
import { UrlRoute, ShyUrl } from "../../history";

export var MyWorkSpace = observer(function () {
    async function load() {
        var wsHost = await sCache.get(CacheKey.wsHost);
        if (wsHost && wsHost.toString().match(/\d+/g)) {
            return UrlRoute.pushToWs(wsHost);
        }
        var my = await workspaceService.loadMyWorkspace();
        if (my?.data?.workspaceId) return UrlRoute.pushToWs(my?.data?.workspaceId);
        else return UrlRoute.push(ShyUrl.workCreate);
    }
    React.useEffect(() => { load(); })
    return <Loading></Loading>
})