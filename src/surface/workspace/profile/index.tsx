import React from "react";
import { Rect } from "rich/src/common/vector/point";
import { surface } from "../..";
import { observer } from "mobx-react";
import { useSelectMenuItem } from "rich/component/view/menu";
import { MenuItemType, MenuItemTypeValue } from "rich/component/view/menu/declare";
import { SettingsSvg } from "rich/component/svgs";
import { useOpenWorkspaceSettings } from "../settings";
import { Icon } from "rich/component/view/icon";

export var WorkspaceProfile = observer(function () {
    async function mousedown(event: React.MouseEvent) {
        var ele = event.currentTarget as HTMLElement;
        ele = ele.querySelector('.shy-ws-profile-info') as HTMLElement;
        var rect = Rect.from(ele.getBoundingClientRect());
        var isMananger: boolean = false;
        if (surface.workspace.owner == surface.user.id) {
            isMananger = true;
        }
        var menus: MenuItemType<string>[] = [];
        if (isMananger) {
            menus = [
                { name: 'setting', icon: SettingsSvg, text: '空间设置' },
                { type: MenuItemTypeValue.divide },
                { name: 'invite', text: '邀请其ta人' },
                //{ name: 'edit', text: '编辑个人空间资料' },
            ]
        }
        else {
            menus = [
                { name: 'invite', text: '邀请其ta人' },
                // { name: 'edit', text: '编辑个人空间资料' },
                { type: MenuItemTypeValue.divide },
                { name: 'exit', text: '退出空间' }
            ]
        }
        var se = await useSelectMenuItem(
            { fixPoint: rect.leftBottom.add(0, 0) },
            menus
        );
        if (se) {
            if (se.item.name == 'exit') {
                surface.exitWorkspace();
            }
            else if (se.item.name == 'edit') {

            }
            else if (se.item.name == 'setting') {
                useOpenWorkspaceSettings()
            }
        }
    }
    return <div className={'shy-ws-profile' + (surface.workspace?.cover?.url ? " cover" : "")} onMouseDown={e => mousedown(e)}>
        <div className={'shy-ws-profile-info'}>
            <span>{surface.workspace.text}</span>
            <Icon icon={'arrow-down:sy'}></Icon>
        </div>
        {surface.workspace.cover && <div className="shy-ws-profile-cover">
            <img src={surface.workspace.cover.url} />
        </div>}
    </div>
})

