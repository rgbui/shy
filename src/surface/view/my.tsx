
import { observer } from "mobx-react";
import React from 'react';
import { sCache, CacheKey } from "../../../net/cache";
import { UrlRoute, ShyUrl } from "../../history";
import { channel } from "rich/net/channel";
import { Workspace } from "../workspace";
import { surface } from "../store";
import { autoCreateWorkspaceAndJoinWorkspace } from "../workspace/create/template";
import { Spin } from "rich/component/view/spin";
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
        } else {
            if (surface.user.isAutoCreateWorkspace === false) {
                var rr = await autoCreateWorkspaceAndJoinWorkspace()
                return UrlRoute.pushToWs(rr.workspace.sn, true);
            }
            else return UrlRoute.push(ShyUrl.workCreate);
        }
    }

    React.useEffect(() => { load(); })
    return <div><Spin></Spin></div>
})