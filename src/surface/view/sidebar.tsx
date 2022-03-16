
import { observer } from "mobx-react-lite";
import React from "react";
import { Icon } from "rich/component/view/icon";
import { surface } from "..";
import PubWorkspace from "../../assert/svg/pubWorkspace.svg";
import DownloadSvg from "../../assert/svg/download.svg";
import { PlusSvg } from "rich/component/svgs";
import { Workspace } from "../workspace";
import HomeSrc from "../../assert/img/shy.256.png";
export var SideBar = observer(function () {
    async function changeWorkspace(ws: Partial<Workspace>) {
        surface.showUserChannel = false;
        surface.onChangeWorkspace(ws);
    }
    function renderWs(workspace: Partial<Workspace>) {
        if (workspace.icon) return <a className="shy-sidebar-ws-icon"><img
            src={workspace?.icon.url} style={{ width: 48, height: 48 }} />
        </a>
        else return <a className="shy-sidebar-ws-name"><span style={{ fontSize: 18 }}>{workspace?.text?.slice(0, 2)}</span></a>
    }
    return <div className='shy-sidebar'>
        <a className="shy-sidebar-operator" onMouseDown={e => surface.showUserChannel = true}>
            <img src={HomeSrc} style={{ width: 48, height: 48, borderRadius: 16 }} />
        </a>
        <div className="shy-sidebar-divider"></div>
        {surface.wss.map(ws => {
            return <div onMouseDown={e => changeWorkspace(ws)} key={ws.id} className={'shy-sidebar-ws' + (surface.workspace.id == ws.id ? " hover" : "")}>{renderWs(ws)}</div>
        })}
        <a className="shy-sidebar-operator"><Icon size={24} icon={PlusSvg}></Icon></a>
        <a className="shy-sidebar-operator"><Icon size={24} icon={PubWorkspace}></Icon></a>
        <div className="shy-sidebar-divider"></div>
        <a className="shy-sidebar-operator"><Icon size={24} icon={DownloadSvg}></Icon></a>
        <a className="shy-sidebar-operator"><Icon size={40} fontSize={30} icon={"help:sy"}></Icon></a>
        {/* <div className='shy-sidebar-top'>
        </div>   */}
        {/* <Icon className='hover' size={30} fontSize={30} icon={SvgComponents}></Icon> */}
        {/* <div className='shy-sidebar-bottom'>
            <Icon size={40} fontSize={30} icon={"help:sy"}></Icon>
            <Avatar circle size={30} onClick={e => surface.workspace.onOpenUserSettings(e)} icon={surface.user.avatar} text={surface.user.name}></Avatar>
        </div> */}
    </div>
})