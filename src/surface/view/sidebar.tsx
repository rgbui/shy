
import { observer } from "mobx-react-lite";
import React from "react";
import { Icon } from "rich/component/view/icon";
import { surface } from "..";
import PubWorkspace from "../../assert/svg/pubWorkspace.svg";
import DownloadSvg from "../../assert/svg/download.svg";
import { PlusSvg } from "rich/component/svgs";
import { LinkWorkspaceOnline, Workspace } from "../workspace";
import HomeSrc from "../../assert/img/shy.256.png";
import { ShyUrl, UrlRoute } from "../../history";
import { autoImageUrl } from "rich/net/element.type";
import { config } from "../../common/config";
import { UA } from "rich/util/ua";
import { ToolTip } from "rich/component/view/tooltip";
import { DotNumber } from "rich/component/view/dot/index";
import { userChannelStore } from "../user/channel/store";
import { UserAvatars } from "rich/component/view/avator/users"
import { channel } from "rich/net/channel";
import { runInAction } from "mobx";
export var SideBar = observer(function () {
    if (!surface.showSlideBar) return <></>
    function renderWs(workspace: Partial<Workspace>) {
        if (workspace.icon) return <a className="shy-sidebar-ws-icon"><img src={autoImageUrl(workspace?.icon.url, 120)} style={{ width: 48, height: 48 }} />
        </a>
        else return <a className="shy-sidebar-ws-name"><span style={{ fontSize: 18 }}>{workspace?.text?.slice(0, 2)}</span></a>
    }
    async function loadWsOnline(workspace: LinkWorkspaceOnline) {
        if (workspace.loadingOnlineUsers) return;
        workspace.loadingOnlineUsers = true;
        var r = await channel.get('/ws/online/users', { wsId: workspace.id, count: 20 });
        runInAction(() => {
            if (r.ok) {
                workspace.randomOnlineUsers = r.data.users;
                workspace.memberOnlineCount = r.data.count;
                workspace.overlayDate = new Date();
            }
            workspace.loadingOnlineUsers = false;
        })
    }
    function renderWsOverlay(workspace: LinkWorkspaceOnline) {
        if (!workspace.overlayDate || workspace.overlayDate && (Date.now() - workspace.overlayDate.getTime() > 2000 * 60)) {
            loadWsOnline(workspace);
        }
        if (!workspace.overlayDate) return <div>
            <div>
                <span>{workspace.text}</span> <span>{workspace.memberCount}成员</span>
            </div>
        </div>
        else return <div>
            <div><span>{workspace.text}</span>
                {workspace.memberOnlineCount > 0 && <span>{workspace.memberOnlineCount}人在线</span>}
                {!workspace.memberOnlineCount && <span>{workspace.memberCount}成员</span>}
            </div>
            {workspace.randomOnlineUsers.length > 0 && <div><UserAvatars users={workspace.randomOnlineUsers}></UserAvatars></div>}
        </div>
    }

    return <div className='shy-sidebar'>
        <a className="shy-sidebar-operator"
            style={{ position: 'relative', marginTop: config.isPc && UA.isMacOs ? 30 : 20 }}
            onMouseDown={e => { UrlRoute.push(ShyUrl.me) }
            }>
            <img src={HomeSrc} style={{ width: 48, height: 48, borderRadius: 16 }} />
            <DotNumber count={userChannelStore.unReadChatCount} ></DotNumber>
        </a>
        <div className="shy-sidebar-divider"></div>
        <div className="shy-sidebar-body">
            {surface.temporaryWs && <ToolTip key={surface.temporaryWs.id} placement="right" overlay={surface.temporaryWs.text}><div onMouseDown={e => surface.onChangeWorkspace(surface.temporaryWs)} key={surface.temporaryWs.id} className={'shy-sidebar-ws' + (surface.workspace.id == surface.temporaryWs.id ? " hover" : "")}>{renderWs(surface.temporaryWs)}</div></ToolTip>}
            {surface.wss.map(ws => {
                return <ToolTip key={ws.id} placement="right" overlay={renderWsOverlay(ws)}><div onMouseDown={e => surface.onChangeWorkspace(ws)} className={'shy-sidebar-ws' + (surface.workspace?.id == ws.id ? " hover" : "")}>{renderWs(ws)}</div></ToolTip>
            })}
            <a className="shy-sidebar-operator" onMouseDown={e => surface.onCreateWorkspace()} ><Icon size={24} icon={PlusSvg}></Icon></a>
            <a className="shy-sidebar-operator" onMouseDown={e => UrlRoute.push(ShyUrl.discovery)}><Icon size={24} icon={PubWorkspace}></Icon></a>
            {/*  <div className="shy-sidebar-divider"></div>
        <a className="shy-sidebar-operator"><Icon size={24} icon={DownloadSvg}></Icon></a> */}
        </div>
    </div>
})