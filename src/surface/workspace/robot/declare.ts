import { UserBasic } from "rich/types/user"

export type RobotTask = {
    id?: string,
    name: string,
    description?: string,
    url?: string,
    method?: string,
    handle?: 'stream' | 'sync' | 'async',
    headers?: { name: string, value: string }[],
    main?: boolean,
    flag: 'append' | 'write',
    args: { id: string, name: string, text: string, type: string }[],
    replys: { id: string, mime: 'text' | 'json' | 'markdown' | 'image' | 'error', template?: string, content?: string, data?: Record<string, any>, images?: { url: string, alt?: string }[] }[]
    /**
     * nextActions[0].args[0].value='$args.name|$replys['name']'
     */
    nextActions: { text: string, task: string, args?: { name: string, value: string }[] }[]
    disabled?: boolean,
    /**
     * args replys
     * ```
     * args.name
     * args.name
     * replys 
     * ```
     */
    template?: string,
}

export type RobotInfo = UserBasic & { remark?: string, basePath?: string, headers?: { name: string, value: string }[], }


export interface WikiDoc {
    id: string;
    createDate: Date;
    creater: string;
    contents: { id: string, tokenCount?: number, content: string, date?: Date }[];
    wikiId: string;
    text: string;
    url: string;
    tokenCount: number;
    workspaceId: string;
    parentId: string;
    childs: WikiDoc[];
    contentChange: boolean
}
