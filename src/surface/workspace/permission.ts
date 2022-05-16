


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

export enum PagePermission {
    /**
     * 可以浏览
     */
    canView = 1000,
    /**
     * 可以编辑
     */
    canEdit = 1001,
    /**
     * 可以交互
     */
    canInteraction = 1002,
}