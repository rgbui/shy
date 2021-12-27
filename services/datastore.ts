import { BaseService } from "../net";
import { Sock } from "../net/sock";

/**
 * 数据库为/shy的只存在于主库（主要用来存用户相关的信息）
 * 数据库为/shy_user的存在于每个数据库中（不同设备）
 */
export enum DataStoreName {
    /**
     * 主库
     * 用户id sys
     * 数据库shy
     * 表名 user
     */
    User = 'User',
    UserToken = 'UserToken',
    /**
     * 用户设备
     */
    Device = 'Device',
    UserDevice = 'UserDevice',
    /**
     * 系统中所有用户上传的文件
     */
    ShyFile = 'ShyFile',
    /**
     * 用户当前空间下面存放的文件
     */
    UserFile = 'UserFile',
    /**
     * 服务进程
     */
    Pid = 'Pid',
    Server = 'Server',
    Db = 'Db',
    UserPid = 'UserPid',
    Workspace = 'Workspace',
    WorkspaceUser = 'WorkspaceUser',
    WorkspaceGuest = 'WorkspaceGuest',
    PageItem = 'PageItem',
    /***
     * 用户创建的展示元数据
     */
    UserDefineDataSchema = 'UserDefineDataSchema',
    UserDefineDataSchemaField = 'UserDefineDataSchemaField',
    UserDefineDataSchemaRelation = 'UserDefineDataSchemaRelation',
    /**
     * 用户分配的表
     */
    UserAllotTable = 'UserAllotTable',
    /**
     * 统计系统提供的
     */
    ProviderAllotTable = 'ProviderAllotTable',
    ProviderAllotDb = 'ProviderAllotDb',
    /**
     * 页面块存储
     */
    WorkspaceOperator = 'WorkspaceOperator',
    PageSnapshoot = 'PageSnapshoot'
}


class DataStoreService extends BaseService {
    //#region /datastore
    async allQuery<T = any>(sock: Sock, name: DataStoreName, options: { filter?: Record<string, any> }) {
        var result = await sock.get<{ list: T[], total: number }, string>('/datastore/:name/query/all', {
            name: name,
            filter: options.filter
        });
        return result.data;
    }
    async query<T = any>(sock: Sock, name: DataStoreName, options: { page?: number, size?: number, filter?: Record<string, any> }) {
        var result = await sock.get<{ list: T[], total: number }, string>('/datastore/:name/query', {
            name: name,
            page: options.page,
            size: options.size,
            filter: options.filter
        });
        return result.data;
    }
    async insertRow<T = any>(sock: Sock, name: DataStoreName, data: Partial<T>, pos?: { id: string, pos: "down" | 'up' }) {
        return (await sock.post<{ ok: boolean, data: Partial<T> }, string>('/datastore/:name/add', {
            name: name,
            data
        })).data;
    }
    async removeRow(sock: Sock, name: DataStoreName, id: string) {
        return (await sock.post<{ ok: boolean }, string>('/datastore/:name/remove', {
            name: name,
            id
        })).data;
    }
    async updateRow<T = any>(sock: Sock, name: DataStoreName, id: string, data: Partial<T>) {
        return (await sock.post<{ ok: boolean }, string>('/datastore/:name/update', {
            name: name,
            id,
            data
        })).data;
    }
    //#endregion
}
export var dataStoreService = new DataStoreService()