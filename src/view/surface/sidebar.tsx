
import React from "react";
import { Icon } from "rich/component/view/icon";
import { surface } from ".";
import { Avatar } from "../../components/face";
export function SideBar() {
    return <div className='shy-sidebar'>
        <div className='shy-sidebar-top'>
            <Avatar size={30} icon={surface.workspace.icon} text={surface.workspace.text}></Avatar>
            <Icon className='hover' size={40} fontSize={30} icon={"yingyong:sy"}></Icon>
        </div>
        <div className='shy-sidebar-bottom'>
            <Icon size={40} fontSize={30} icon={"help:sy"}></Icon>
            <Avatar circle size={30} icon={surface.user.avatar} text={surface.user.name}></Avatar>
        </div>
    </div>
}