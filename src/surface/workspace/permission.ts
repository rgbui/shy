


export function getCommonPerssions() {
    return [
        WorkspacePermission.sendMessageByChannel
    ]
}


export enum WorkspacePermission {
    /**
     * 是否可以编辑文档
     */
    editDoc = 100,
    /**
     * 创建文档
     * 删除文档
     */
    createOrDeleteDoc = 101,

    /**
     * 允许发言
     */
    sendMessageByChannel = 110,
    /***
     * 允许创建或删除文本频道
     */
    createOrDeleteChannel = 111,

}