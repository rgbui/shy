import React from "react";
import { Rect } from "rich/src/common/vector/point";
import { surface } from "../../store";
import { observer } from "mobx-react";
import { useSelectMenuItem } from "rich/component/view/menu";
import { MenuItem, MenuItemType } from "rich/component/view/menu/declare";
import { ChevronDownSvg, EditSvg, MenuSvg, SettingsSvg, LogoutSvg, AddUserSvg, MenuFolderSvg, TreeListSvg, FolderPlusSvg, } from "rich/component/svgs";
import { useOpenWorkspaceSettings } from "../settings";
import { Icon } from "rich/component/view/icon";
import { autoImageUrl } from "rich/net/element.type";
import { AtomPermission } from "rich/src/page/permission";
import { isMobileOnly } from "react-device-detect";
import { useForm } from "rich/component/view/form/dialoug";

export var WorkspaceProfile = observer(function () {
    async function mousedown(event: React.MouseEvent) {
        if (!surface.workspace.isMember) return;
        if (isMobileOnly) return;
        var ele = event.currentTarget as HTMLElement;
        ele = ele.querySelector('.shy-ws-profile-info') as HTMLElement;
        var rect = Rect.from(ele.getBoundingClientRect());
        var menus: MenuItem<string>[] = [];
        if (surface.workspace.isOwner) {
            menus = [
                { name: 'setting', icon: SettingsSvg, text: '空间设置' },
                { name: 'createFolder', icon: MenuFolderSvg, text: '创建类别' },
                { type: MenuItemType.divide },
                { text: '风格', type: MenuItemType.text },
                { name: 'showMenu', icon: FolderPlusSvg, text: '菜单' },
                { name: 'showNote', icon: TreeListSvg, text: '目录' },
                { type: MenuItemType.divide },
                { name: 'invite', text: '邀请其ta人', icon: AddUserSvg },
                // { name: 'edit', text: '编辑个人空间资料', icon: EditSvg },
            ]
        }
        else if (surface.workspace.isAllow(AtomPermission.wsEdit, AtomPermission.wsMemeberPermissions)) {
            menus = [
                { name: 'setting', icon: SettingsSvg, text: '空间设置' },
                { name: 'createFolder', icon: MenuFolderSvg, text: '创建类别' },
                { type: MenuItemType.divide },
                { text: '风格', type: MenuItemType.text },
                { name: 'showMenu', icon: MenuFolderSvg, text: '菜单' },
                { name: 'showNote', icon: TreeListSvg, text: '目录' },
                { type: MenuItemType.divide },
                { name: 'invite', text: '邀请其ta人', icon: AddUserSvg },
                // { name: 'edit', text: '编辑个人空间资料', icon: EditSvg },
                { type: MenuItemType.divide },
                { name: 'exit', text: '退出空间', icon: LogoutSvg }
            ]
        }
        else {
            menus = [
                { name: 'invite', text: '邀请其ta人', icon: AddUserSvg },
                // { name: 'edit', text: '编辑个人空间资料', icon: EditSvg },
                { type: MenuItemType.divide },
                { name: 'exit', text: '退出空间', icon: LogoutSvg }
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
            else if (se.item.name == 'invite') {
                surface.workspace.onCreateInvite(true);
            }
            else if (se.item.name == 'edit') {

            }
            else if (se.item.name == 'setting') {
                useOpenWorkspaceSettings()
            }
            else if (se.item.name == 'createFolder') {
                var r = await useForm({
                    title: '创建分类',
                    fields: [{ name: 'text', text: '分类名称', type: 'input' }],
                    async checkModel(model) {
                        if (!model.text) return '分类名称不能为空'
                        if (model.text.length > 30) return '分类名称过长'
                        return '';
                    }
                });
                if (r?.text) {
                    surface.sln.onCreateFolder(r.text)
                }
            }
            else if (se.item.name == 'showMenu' || se.item.name == 'showNote') {

            }
        }
    }
    return <div className={'shy-ws-profile' + (surface.workspace?.cover?.url ? " cover" : "")} onMouseDown={e => mousedown(e)}>
        <div className={'shy-ws-profile-info flex'}>
            {isMobileOnly && <span className="flex-fixed flex-center size-24 round cursor item-hover">
                <Icon size={16} icon={MenuSvg}></Icon>
            </span>}
            <span className="flex-auto bold f-16 text-overflow gap-r-5">{surface.workspace.text}</span>
            <Icon icon={ChevronDownSvg} size={16} className={'padding-r-10 remark flex-fixed'}></Icon>
        </div>
        {surface.workspace.cover && <div className="shy-ws-profile-cover">
            <img src={autoImageUrl(surface.workspace.cover.url, 500)} />
        </div>}
    </div>
})

