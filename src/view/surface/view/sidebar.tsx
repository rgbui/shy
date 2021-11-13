
import { observer } from "mobx-react-lite";
import React from "react";
import { Icon } from "rich/component/view/icon";
import { surface } from "..";
import { Avatar } from "../../../components/face";
export var SideBar = observer(function () {
    return <div className='shy-sidebar'>
        <div className='shy-sidebar-top'>
            <Avatar size={30} onClick={e => surface.workspace.onOpenWorkspaceSettings(e)} icon={surface.workspace.icon} text={surface.workspace.text}></Avatar>
            <Icon className='hover' size={40} fontSize={30} icon={"yingyong:sy"}></Icon>
        </div>
        <div className='shy-sidebar-bottom'>
            <Icon size={40} fontSize={30} icon={"help:sy"}></Icon>
            <Avatar circle size={30} onClick={e=>surface.workspace.onOpenUserSettings(e)} icon={surface.user.avatar} text={surface.user.name}></Avatar>
        </div>
    </div>
})