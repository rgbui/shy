import { IconArguments } from "rich/extensions/icon/declare";

export type PidType = 'master' | 'org' | 'guard' | 'tim' | "ws" | 'file' | 'api' | 'mail'


export type Pid = {
    id: string;
    types: PidType[],
    url: string
}


export type WorkspaceUser = {
    userid: string;
    role: string;
    nick: string;
}

export type WorkspaceRole = {
    id: string,
    text: string,
    color: string,
    permissions: number[],
    icon?: IconArguments
}

export type WorkspaceMember = {
    id: string;
    createDate: number;
    creater: string;
    userid: string;
    /**
     * 当前空间内用户的呢称
     */
    name: string;
    /**
     * 当前用户的角色
     */
    roleIds: string[];
    workspaceId: string;
    avatar: IconArguments;
    cover: IconArguments;
    totalScore: number;
}

