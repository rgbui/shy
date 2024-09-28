import { PageLayoutType } from "rich/src/page/declare";
import { PageItem } from ".";
import { ElementType, getElementUrl } from "rich/net/element.type";
import { AtomPermission, PageSourcePermission, getCommonPermission, getDenyPermission, getEditOwnPerssions, mergeAtomPermission } from "rich/src/page/permission";
import { Surface } from "../../app/store";
import lodash from "lodash";
import { Mime } from "../declare";

export function getPageItemElementUrl(item: PageItem) {
    if (item.mime == Mime.tableForm) {
        return getElementUrl(ElementType.SchemaRecordView, item.refTableId, item.id);
    }
    else if (item.pageType == PageLayoutType.db) {
        return getElementUrl(ElementType.Schema, item.id);
    }
    else if (item.pageType == PageLayoutType.doc || item.pageType == PageLayoutType.board || item.pageType == PageLayoutType.ppt) {
        return getElementUrl(ElementType.PageItem, item.id);
    }
    else if (item.pageType == PageLayoutType.textChannel) {
        return getElementUrl(ElementType.Room, item.id);
    }
    else return getElementUrl(ElementType.PageItem, item.id);
}

export function itemIsPermissons(surface: Surface, data: {
    share?: "net" | "nas" | "local",
    netPermissions?: AtomPermission[],
    inviteUsersPermissions?: { userid: string, permissions: AtomPermission[] }[],
    memberPermissions?: { roleId: string, permissions: AtomPermission[] }[]
}, isEnd = true
): PageSourcePermission {
    if (!surface.user.isSign) {
        //用户没有登录时，需要先判断知识库是否为公开的
        if (surface.workspace?.access == 1) {
            //这个得从当前往上查找，是否是继承的
            if (data && data.share == 'net' && data.netPermissions.length > 0) {
                return {
                    source: 'pageItem',
                    data: data,
                    permissions: lodash.cloneDeep(data.netPermissions)
                }
            }
            if (isEnd) return {
                source: 'workspacePublicAccess',
                data: { access: surface.workspace.access },
                permissions: getCommonPermission()

            }
        }
        if (isEnd)
            return {
                source: 'workspacePublicAccess',
                data: { access: surface.workspace.access },
                permissions: getDenyPermission()
            }
    }


    else {
        if (surface.workspace.isOwner) {
            return { source: 'wsOwner', permissions: getEditOwnPerssions() }
        }

        if (data && data.inviteUsersPermissions && data.inviteUsersPermissions.some(s => s.userid == surface.user.id)) {
            return {
                source: 'pageItem',
                data: data,
                permissions: lodash.cloneDeep(data.inviteUsersPermissions.find(s => s.userid == surface.user.id).permissions)
            }
        }

        //用户登录,判断用户是否为空间成员
        if (surface.workspace.isMember) {
            if (data && Array.isArray(data.memberPermissions) && data.memberPermissions.some(s => s.roleId && (surface.workspace.member.roleIds || []).includes(s.roleId))
            ) {
                var mps = data.memberPermissions.filter(s => s.roleId && (surface.workspace.member.roleIds || []).includes(s.roleId))
                var ns = mps[0].permissions;
                for (var i = 1; i < mps.length; i++) {
                    ns = mergeAtomPermission(ns, mps[i].permissions)
                }
                return {
                    source: 'pageItem',
                    data: data,
                    permissions: ns
                }
            }
            else if (data && Array.isArray(data.memberPermissions) && data.memberPermissions.some(s => s.roleId == 'all')) {
                return { source: 'pageItem', data: data, permissions: lodash.cloneDeep(data.memberPermissions.find(s => s.roleId == 'all').permissions) }
            }
        }
        else {
            if (data && data.share == 'net' && Array.isArray(data.netPermissions) && data.netPermissions.length > 0) {
                return {
                    source: 'pageItem',
                    data: data,
                    permissions: lodash.cloneDeep(data.netPermissions)
                }
            }
            if (surface.workspace.access == 1) {
                if (isEnd) return {
                    source: 'workspacePublicAccess',
                    data: { access: surface.workspace.access },
                    permissions: getCommonPermission()

                }
            }
            if (isEnd)
                return {
                    source: 'workspacePublicAccess',
                    data: { access: surface.workspace.access },
                    permissions: getDenyPermission()
                }
        }
    }
}

export async function findItemPermisson(surface: Surface, id: string): Promise<PageSourcePermission> {
    var item = surface.workspace.find(c => c.id == id);
    if (item) return item.getUserPermissions();
    if (surface.workspace.isOwner) return {
        source: 'wsOwner',
        permissions: getEditOwnPerssions()
    }
    var r = await surface.workspace.sock.get('/page/permission', {
        wsId: surface.workspace.id,
        id: id,
        roleIds: surface.workspace.member?.roleIds || [],
        isMember: surface.workspace.isMember
    })
    if (r.ok) {
        if (r.data.item) {
            return {
                source: 'pageItem',
                data: r.data.item,
                permissions: r.data.permissions
            }
        }
        else {
            if (surface.workspace.isMember)
                return surface.workspace.memberPermissions;
            else {
                if (surface.workspace.access == 1) {
                    return {
                        source: 'workspacePublicAccess',
                        data: { access: surface.workspace.access },
                        permissions: getCommonPermission()
                    }
                }
                else {
                    return {
                        source: 'workspacePublicAccess',
                        data: { access: surface.workspace.access },
                        permissions: getDenyPermission()
                    }
                }
            }
        }
    }
}