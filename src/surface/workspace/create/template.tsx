import { ShyAlert, CloseShyAlert } from "rich/component/lib/alert";
import { channel } from "rich/net/channel";
import { masterSock } from "../../../../net/sock";
import { surface } from "../../store";
import { Workspace } from "..";
import { UserBasic } from "rich/types/user";
import { config } from "../../../../common/config";

export async function autoCreateWorkspaceAndJoinWorkspace(text?: string) {
    ShyAlert('正在初始化创建空间', 'success', 1000 * 60 * 5);
    try {
        var g = await masterSock.get<{ template: { id: string, text: string, url: string, file: { url: string } } }>('/get/auto/create/workspace/template');
        if (g.ok) {
            var templateUrl = g.data.template.url || g.data.template.file?.url;
            if (templateUrl)
            {
                /**
                 * 自动创建空间
                 */
                var rr = await channel.put('/ws/create', {
                    text: text || (surface.user.name + '的空间'),
                    templateUrl: templateUrl
                });
                var robotId = '9096421bfe01464fafcd10a7dc93b038';
                if (config.isDev) robotId = '3703b4ee85694df89aa76b39aac6ba7f';
                var ms = Workspace.getWsSock(rr.data.pids, 'ws');
                var d = await masterSock.get<{ robot: UserBasic }>('/get/robot', { id: robotId });
                await ms.put('/ws/member/add/robot', {
                    wsId: rr.data.workspace.id,
                    robotInfo: d.data.robot
                });
                /**
                 * 自动加到诗云的云云社区
                 */
                var wsName = '1'
                if (config.isDev) wsName = '34';
                var ws = await channel.get('/ws/query', { name: wsName });
                var sock = Workspace.getWsSock(ws.data.pids, 'ws')
                await channel.put('/user/join/ws', { wsId: ws.data.workspace.id });
                await channel.put('/ws/invite/join', { wsId: ws.data.workspace.id,username:surface.user.name, sock, agree: false });
                await channel.patch('/user/patch', { data: { isAutoCreateWorkspace: true } });
                return rr.data;
            }
        }
    }
    catch (ex) {

    }
    finally {
        CloseShyAlert()
    }
}