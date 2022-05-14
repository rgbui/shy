
import { observer } from "mobx-react-lite";
import React from "react";
import { Icon } from "rich/component/view/icon";
import { surface } from "..";
import PubWorkspace from "../../assert/svg/pubWorkspace.svg";
import DownloadSvg from "../../assert/svg/download.svg";
import { PlusSvg } from "rich/component/svgs";
import { Workspace } from "../workspace";
import HomeSrc from "../../assert/img/shy.256.png";
import { ShyUrl, UrlRoute } from "../../history";

export var SideBar = observer(function () {
    function renderWs(workspace: Partial<Workspace>) {
        if (workspace.icon) return <a className="shy-sidebar-ws-icon"><img
            src={workspace?.icon.url} style={{ width: 48, height: 48 }} />
        </a>
        else return <a className="shy-sidebar-ws-name"><span style={{ fontSize: 18 }}>{workspace?.text?.slice(0, 2)}</span></a>
    }
    return <div className='shy-sidebar'>
        <a className="shy-sidebar-operator" onMouseDown={e => {
            //  UrlRoute.push(ShyUrl.me)
        }
        }>
            <img src={HomeSrc} style={{ width: 48, height: 48, borderRadius: 16 }} />
        </a>
        <div className="shy-sidebar-divider"></div>
        {surface.temporaryWs && <div onMouseDown={e => surface.onChangeWorkspace(surface.temporaryWs)} key={surface.temporaryWs.id} className={'shy-sidebar-ws' + (surface.workspace.id == surface.temporaryWs.id ? " hover" : "")}>{renderWs(surface.temporaryWs)}</div>}
        {surface.wss.map(ws => {
            return <div onMouseDown={e => surface.onChangeWorkspace(ws)} key={ws.id} className={'shy-sidebar-ws' + (surface.workspace.id == ws.id ? " hover" : "")}>{renderWs(ws)}</div>
        })}
        <a className="shy-sidebar-operator" onMouseDown={e => surface.onCreateWorkspace()} ><Icon size={24} icon={PlusSvg}></Icon></a>
        <a className="shy-sidebar-operator" onMouseDown={e => UrlRoute.push(ShyUrl.discovery)}><Icon size={24} icon={PubWorkspace}></Icon></a>
        {/*  <div className="shy-sidebar-divider"></div>
        <a className="shy-sidebar-operator"><Icon size={24} icon={DownloadSvg}></Icon></a> */}
    </div>
})