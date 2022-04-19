/**
 * 
 * 用户角色
 * 每个成员都有基本的角色身份 @所有人
 * 空间所有者有最高的权限
 * @管理员 辅助管理
 *     能够编排文档
 *     能够编排目录
 * @消费者 服务于空间
 *     能够会话聊天
 *     能够评论
 *     
 * @访客
 * @匿名
 * 
 */

import { observer, useLocalStore } from "mobx-react";
import React from "react";
import { ArrowRightSvg, SettingsSvg, TypesPersonSvg } from "rich/component/svgs";
import { Icon, IconButton } from "rich/component/view/icon";
import { Remark } from "rich/component/view/text";

export var WorkspaceRoles = observer(function () {
    var local = useLocalStore(() => {
        return {
            isEdit: false,
            roles: [],
            mode: 'perssion'
        }
    })
    function editRole(role) {

    }
    function operatorRole(role, event: React.MouseEvent) {

    }
    function renderRoles() {
        return <div className="shy-ws-roles-list">
            <h3>角色</h3>
            <Remark>使用角色来组织你的空间成员并自定义权限</Remark>
            <div className="shy-ws-role-everyone">
                <span><Icon icon={TypesPersonSvg}></Icon><span>@所有人.适用所有空间成员</span></span>
                <Icon icon={ArrowRightSvg}></Icon>
            </div>
            <table>
                <thead><tr><th>角色</th><th></th></tr></thead>
                <tbody>
                    {local.roles.map(r => {
                        return <tr key={r.id}>
                            <td>{r.text}</td>
                            <td>
                                <IconButton onMouseDown={e => editRole(r)}
                                    width={24}
                                    size={14} wrapper
                                    icon={SettingsSvg}
                                ></IconButton>
                                <IconButton width={24} onMouseDown={e => operatorRole(r, e)} size={14} wrapper
                                    icon={'elipsis:sy'}
                                ></IconButton>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    }

    function renderEditRoles() {
        return <div className='shy-ws-roles-edit'>
            <div className="shy-ws-roles-edit-roles">
                <a>@所有人</a>
                {local.roles.map(r => {
                    return <a key={r.id}><span>{r.text}</span></a>
                })}
            </div>
            <div className="shy-ws-roles-edit-tab">
                <div className="shy-ws-roles-edit-tab-head">
                    <a onMouseDown={e => local.mode = 'info'} className={local.mode == 'info' ? "hover" : ""}>显示</a>
                    <a onMouseDown={e => local.mode = 'perssion'} className={local.mode == 'perssion' ? "hover" : ""}>权限</a>
                    <a onMouseDown={e => local.mode = 'info'} className={local.mode == 'user' ? "hover" : ""}>管理成员</a>
                </div>
                <div className="shy-ws-roles-edit-tab-page">
                    <div className="shy-ws-role-info">

                    </div>
                    <div className="shy-ws-role-perssion">

                    </div>
                    <div className="shy-ws-role-users">

                    </div>
                </div>
            </div>
        </div>
    }
    return <div className='shy-ws-roles'>
        {!local.isEdit && renderRoles()}
        {local.isEdit && renderEditRoles()}
    </div>
})