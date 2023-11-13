import React from "react";
import { Rect } from "rich/src/common/vector/point";
import { surface } from "../../store";
import { observer } from "mobx-react";
import { useSelectMenuItem } from "rich/component/view/menu";
import { MenuItem, MenuItemType } from "rich/component/view/menu/declare";
import { ChevronDownSvg, SettingsSvg, LogoutSvg, AddUserSvg, MenuFolderSvg, TreeListSvg, FolderPlusSvg, FolderCloseSvg, } from "rich/component/svgs";
import { useOpenWorkspaceSettings } from "../settings";
import { Icon } from "rich/component/view/icon";
import { autoImageUrl } from "rich/net/element.type";
import { AtomPermission } from "rich/src/page/permission";
import { isMobileOnly } from "react-device-detect";
import { useForm } from "rich/component/view/form/dialoug";
import { lst } from "rich/i18n/store";

export var WorkspaceProfile = observer(function ()
{
    async function mousedown(event: React.MouseEvent)
    {
        if (!surface.workspace.isMember) return;
        if (isMobileOnly) return;
        var ele = event.currentTarget as HTMLElement;
        ele = ele.querySelector('.shy-ws-profile-info') as HTMLElement;
        var rect = Rect.from(ele.getBoundingClientRect());
        var menus: MenuItem<string>[]=[];
        if (surface.workspace.isOwner)
        {
            menus = [
                { name: 'setting', icon: SettingsSvg, text: lst('空间设置') },
                { name: 'createFolder', icon: FolderPlusSvg, text: lst('创建类别') },
                { type: MenuItemType.divide },
                { name: 'invite', text: lst('邀请其ta人'), icon: AddUserSvg },
                // { name: 'edit', text: '编辑个人空间资料', icon: EditSvg },
            ]
        }
        else if (surface.workspace.isAllow(AtomPermission.wsEdit, AtomPermission.wsMemeberPermissions)) {
            menus = [
                { name: 'setting', icon: SettingsSvg, text: lst('空间设置') },
                { name: 'createFolder', icon: FolderPlusSvg, text: lst('创建类别') },
                { type: MenuItemType.divide },
                { name: 'invite', text: lst('邀请其ta人'), icon: AddUserSvg },
                // { name: 'edit', text: '编辑个人空间资料', icon: EditSvg },
                { type: MenuItemType.divide },
                { name: 'exit', text: lst('退出空间'), icon: LogoutSvg }
            ]
        }
        else {
            menus = [
                { name: 'invite', text: lst('邀请其ta人'), icon: AddUserSvg },
                // { name: 'edit', text: '编辑个人空间资料', icon: EditSvg },
                { type: MenuItemType.divide },
                { name: 'exit', text: lst('退出空间'), icon: LogoutSvg }
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
                    title: lst('创建分类'),
                    fields: [{ name: 'text', text: lst('分类名称'), type: 'input' }],
                    async checkModel(model) {
                        if (!model.text) return lst('分类名称不能为空')
                        if (model.text.length > 30) return lst('分类名称过长')
                        return '';
                    }
                });
                if (r?.text) {
                    surface.sln.onCreateFolder(r.text)
                }
            }
        }
    }
    return <div className={'shy-ws-profile' + (surface.workspace?.cover?.url ? " cover" : "")} onMouseDown={e => mousedown(e)}>
        <div className={'shy-ws-profile-info flex'}>
            {isMobileOnly && <span className="flex-fixed flex-center size-24 round cursor item-hover">
                <Icon size={16} icon={{ name: "bytedance-icon", code: 'hamburger-button' }}></Icon>
            </span>}
            <span className="flex-auto bold f-16 text-overflow gap-r-5">{surface.workspace.text}</span>
            {surface.workspace.isMember && <Icon icon={ChevronDownSvg} size={16} className={'padding-r-10 remark flex-fixed'}></Icon>}
        </div>
        {surface.workspace.cover && <div className="shy-ws-profile-cover">
            <img src={autoImageUrl(surface.workspace.cover.url, 500)} />
        </div>}
    </div>
})

