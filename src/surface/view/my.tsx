
import { observer } from "mobx-react";
import { Loading } from "rich/component/view/loading";
import React from 'react';
import { sCache, CacheKey } from "../../../net/cache";
import { UrlRoute, ShyUrl } from "../../history";
import { channel } from "rich/net/channel";
import { Workspace } from "../workspace";
import { surface } from "../store";
import { masterSock } from "../../../net/sock";
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
            if (surface.user.isAutoCreateWorkspace === false) await autoCreateWorkspaceAndJoinWorkspace()
            else return UrlRoute.push(ShyUrl.workCreate);
        }
    }
    async function autoCreateWorkspaceAndJoinWorkspace() {
        var g = await masterSock.get<{ id: string, text: string, url: string, file: { url: string } }>('/get/auto/create/workspace/template');
        if (g.ok) {
            var templateUrl = g.data.url || g.data.file?.url;
            if (templateUrl) {
                /**
                 * 自动创建空间
                 */
                var rr = await channel.put('/ws/create', {
                    text: surface.user.name + '的空间',
                    templateUrl: templateUrl
                });
                var ms = Workspace.getWsSock(rr.data.pids, 'ws');
                var robot = await masterSock.get('/recommend/robot', { id: '' });
                await ms.put('/ws/member/add/robot', {
                    wsId: rr.data.workspace.id,
                    robotInfo: robot.data
                });

                /**
                 * 自动加到诗云的云云社区
                 */
                var ws = await channel.get('/ws/query', { name: '1' });
                var sock = Workspace.getWsSock(ws.data.pids, 'ws')
                await channel.put('/user/join/ws', { wsId: ws.data.workspace.id });
                await channel.put('/ws/invite/join', { wsId: ws.data.workspace.id, sock, agree: false });

                await channel.patch('/user/patch', { data: { isAutoCreateWorkspace: true } });

                return UrlRoute.pushToWs(rr.data.workspace.sn, true);
            }
        }
    }
    React.useEffect(() => { load(); })
    return <Loading></Loading>
})