import { StatusCode } from "rich/net/status.code";

export enum SockType {
    /**
     * 诗云服务器
     */
    master,
    file,
    api,


    none,
    /**
     * 诗云工作区服务器（官方）
     * 服务器（私有云）
     */
    workspace,
    /**
    *  本地服务器
    */
    local
}

/**
 * 泛型T表示正常的返回数据
 * 泛型U表示异常返回的数据
 */
export type SockResponse<T, U = any> = {
    /**
     * 返回状态码
     */
    code?: StatusCode,
    /**
     * 表示当前的是否处理正常
     * 通常200~300表示正常处理
     * 大于300小于500表示处理不正常，
     * 500 seriver happend error
     * 返回值是用来提醒处理异常原因的
     */
    ok?: boolean,
    data?: T,
    warn?: U
}