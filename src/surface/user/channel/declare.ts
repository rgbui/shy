import { IconArguments } from "rich/extensions/icon/declare";

export interface UserChannel {
    id: string;
    createDate: Date;
    userid: string;
    roomId: string;
    lastDate: Date;
    isDeleted: boolean;
    deletedDate: Date;
    deletedUser: string;
    room: UserRoom;
    readedSeq?: number;
    unreadCount?: number
}

export interface UserRoom {
    id: string;
    creater: string;
    createDate: Date;
    users: { userid: string, createDate: Date, role?: 'member' | 'admin' }[];
    other: string;
    single: boolean,
    name: string;
    currentnSeq: number;

    chats?: UserCommunicate[];
    isLoadChat?: boolean;
    isLoadAllChats?: boolean,
    uploadFileds: { id: string, speed: string, text: string }[]
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
