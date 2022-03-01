import React from "react";
import { Icon } from "rich/component/view/icon";
import { Rect } from "rich/src/common/vector/point";
import { Avatar } from "rich/component/view/avator/face";
import { surface } from "../..";
import { useSwitchWorkspace } from "../switch";
import ExpandSvg from "../../../assert/svg/expand.svg";
import DoubleArrow from "../../../assert/svg/doubleRight.svg";
import { AppTip } from "../../../../i18n/tip";
import { AppLang } from "../../../../i18n/enum";
import { observer } from "mobx-react";
import { useSelectMenuItem } from "rich/component/view/menu";
import { MenuItemType, MenuItemTypeValue } from "rich/component/view/menu/declare";
import { SettingsSvg } from "rich/component/svgs";

export var WorkspaceProfile = observer(function () {
    async function mousedown(event: React.MouseEvent) {
        var ele = event.currentTarget as HTMLElement;
        var rect = Rect.from(ele.getBoundingClientRect());
        var isMananger: boolean = false;
        var menus: MenuItemType<string>[] = [];
        if (isMananger) {
            menus = [
                { name: 'setting', icon: SettingsSvg, text: '空间设置' },
                { type: MenuItemTypeValue.divide },
                { name: 'invite', text: '邀请其ta人' },
                { name: 'edit', text: '编辑个人空间资料' },
                { type: MenuItemTypeValue.divide },
                { name: 'exit', text: '退出空间' }
            ]
        }
        else {
            menus = [
                { name: 'invite', text: '邀请其ta人' },
                { name: 'edit', text: '编辑个人空间资料' },
                { type: MenuItemTypeValue.divide },
                { name: 'exit', text: '退出空间' }
            ]
        }
        var se = await useSelectMenuItem(
            { fixPoint: rect.leftBottom.add(30, 0) },
            menus
        );
        if (se) {
            if (se.item.name == 'exit') {

            }
            else if (se.item.name == 'edit') {

            }
            else if (se.item.name == 'setting') {

            }
        }
        // var rect = Rect.from(refEl.current.getBoundingClientRect());
        // var r = await useSwitchWorkspace({ fixPoint: rect.leftBottom.add(30, 0) });
        // if (r) {
        //     surface.onChangeWorkspace(r);
        // }
    }
    return <div className='shy-ws-profile' onMouseDown={e => mousedown(e)}>
        {/* {surface.config.showSideBar != true && <div className='shy-ws-profile-face'>
            <Avatar circle size={30} icon={surface.workspace.icon} text={surface.workspace.text}></Avatar>
        </div>} */}
        <div className='shy-ws-profile-info'>
            <span>{surface.workspace.text}</span>
        </div>
        {surface.workspace.cover && <div className="shy-ws-profile-cover">
            <img src={surface.workspace.cover.url} />
        </div>}
        {/* <Icon size={12} icon={ExpandSvg}></Icon> */}
        {/* <div className='shy-ws-profile-operators'>
            {surface.isShowSln && <a onMouseDown={e => { e.stopPropagation(); surface.onToggleSln(false) }}>
                <AppTip id={AppLang.ShrinkSlide} placement={'bottom'}><Icon size={12} icon={DoubleArrow} style={{ transform: 'scale(-1,1)' }}></Icon></AppTip>
            </a>}
        </div> */}
    </div>
})

