
export interface WikiDoc {
    id: string;
    spread?: boolean,
    at?: number,
    createDate: Date;
    creater: string;
    contents: { id: string, tokenCount?: number, content: string, date?: Date }[];
    wikiId: string;
    text: string;
    url: string;
    tokenCount: number;
    embedding: boolean,
    workspaceId: string;
    parentId: string;
    childs: WikiDoc[];
    elementUrl: string
}
