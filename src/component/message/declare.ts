

export enum WsMessageType {
    pageMention = 'pageMention',
    pageComment = 'pageComment',
    administratorAnnouncement = 'administratorAnnouncement',
    systemMessage = 'systemMessage'

}

export type WsMessage = {


    id: string;



    createDate: Date;


    creater: string;



    text: string;


    html: string;


    workspaceId: string;

    /**
     * 消息接收者
     * 如果是所有人，则receiver=='all'
     */


    receiver: string

    /**
     * 消息序号
     */

    seq: number;

    /**
     * 消息定时推送时间
     * 如果为空，则表示不需要定时推送
     * 如果不为空，则表示需要定时推送，此时seq为空
     * 当需要定时推送时，seq置为实际的推送序号
     */

    timingPush: Date;

    /**
     * 消息类型
     * pageMention 页面@某人的消息
     * pageComment 页面评论时@某人的消息
     * administratorAnnouncement 管理员公告
     * systemMessage 系统消息 由诗云系统发送的消息
     */


    type: WsMessageType;

    /**
     * 消息来源的资源地址
     * 如果是页面@某人，则是页面地址 ElementType.Block
     * 如果是页面评论@某人，则是页面评论地址 ElementType.Page
     * 
     */


    elementUrl: string;

    /**
     * 当type为pageMention，pageComment时，此字段为页面id
     */


    pageId: string;



    deleted: boolean;

    deletedDate: Date;
    deletedUserid: string;

}
