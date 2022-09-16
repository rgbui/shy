import { IconArguments } from "rich/extensions/icon/declare";

export interface UserChannel {
    id: string;
    createDate: Date;
    userid: string;
    roomId: string;
    lastDate: Date;
    isDeleted: boolean;
    deletedDate: Date;
    deletedUser: string
}

export interface UserRoom {
    id: string;
    creater: string;
    createDate: Date;
    users: { userid: string, createDate: Date, role?: 'member' | 'admin' }[];
    other: string;
    single: boolean,
    name: string;
}

export interface UserCommunicate {
    id: string;
    createDate: Date;
    userid: string;
    roomId: string;
    seq: number;
    file?: IconArguments;
    content?: string;
    isDeleted?: boolean;
    deletedDate?: Date;
    deletedUser?: string;
    editDate?: Date;
    isEdited?: boolean;
    replyId?: string;
    reply?: UserCommunicate;
    emojis?: { emojiId: string, code?: string, count: number }[];
}
