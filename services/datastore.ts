import { BaseService } from "./base";
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


    async create<T = any>(sock: Sock, schemaName: string | DataStoreName, data?: Partial<T>, pos?: { id: string, pos: "down" | 'up' }) {

        return (await sock.post<{ ok: boolean, data: Partial<T> }, string>('/datastore/:name/add', {
            name: name,
            data
        })).data;
        // let url = await this.getUrl(schemaId);
        // if (url) {
        //     var newRow = await dataStore.put(url, data);
        //     return this.json({ data: newRow }, StatusCode.Ok);
        // }
        // else return this.json(StatusCode.NotFound)
    }

    async batchAdd(sock: Sock, schemaName: string | DataStoreName, list: any[]) {
        // let url = await this.getUrl(schemaId);
        // if (url) {
        //     var rs = await dataStore.batchPut(url, ...list);
        //     return this.json({ list: rs }, StatusCode.Ok);
        // }
        // else return this.json(StatusCode.NotFound)
    }

    async remove(sock: Sock, schemaName: string | DataStoreName, dataId: string) {
        // let url = await this.getUrl(schemaId);
        // if (url) {
        //     await dataStore.delete(url, dataId);
        //     return this.json(StatusCode.NoContent);
        // }
        // else return this.json(StatusCode.NotFound)
    }

    async update(sock: Sock, schemaName: string | DataStoreName, id: string,  data: Record<string, any>) {
        // let url = await this.getUrl(schemaId);
        // if (url) {
        //     await dataStore.set(url, id, data);
        //     return this.json(StatusCode.NoContent);
        // }
        // else return this.json(StatusCode.NotFound)
    }

    async queryList(schemaId: string,
        page: number,
        size: number,
        filter: Record<string, any>,
        sorts: Record<string, 1 | 0>
    ) {
        // let url = await this.getUrl(schemaId);
        // if (url) {
        //     var result = await dataStore.list(url, filter, {
        //         size: size,
        //         page: page,
        //         sorts: sorts
        //     });
        //     return this.json(result, StatusCode.Ok);
        // }
        // else return this.json(StatusCode.NotFound)
    }

    async queryAll(schemaId: string,
        filter: Record<string, any>,
        size: number,
        sorts: Record<string, 1 | 0>
    ) {
        // let url = await this.getUrl(schemaId);
        // if (url) {
        //     var result = await dataStore.list(url, filter, { sorts, page: 1, size: Math.min(300, size || 300) });
        //     return this.json(result, StatusCode.Ok);
        // }
        // else return this.json(StatusCode.NotFound)
    }

    async queryIds(
        schemaId: string,
        ids: string[]
    ) {
        // let url = await this.getUrl(schemaId);
        // if (url) {
        //     var result = await dataStore.list(url, { id: { $in: ids } }, { page: 1, size: 300 });
        //     return this.json({ list: result }, StatusCode.Ok);
        // }
        // else return this.json(StatusCode.NotFound)
    }

    async group(
        schemaId: string,
        filter: Record<string, any>,
        size: number,
        sorts: Record<string, 1 | 0>,
        group: string) {
        // let url = await this.getUrl(schemaId);
        // if (url) {
        //     var gs = await dataStore.aggregation(url, group, { [group]: '$sum' }, { sorts, filter, size });
        //     return this.json({ list: gs }, StatusCode.Ok);
        // }
        // else return this.json(StatusCode.NotFound)
    }

    async statistics(schemaId: string,
        filter: Record<string, any>,
        having: Record<string, any>,
        groups: string[],
        size: number,
        sorts: Record<string, 1 | 0>,
        aggregate?: Record<string, any>) {
        // let url = await this.getUrl(schemaId);
        // if (url) {
        //     var gs = await dataStore.aggregation(url, groups, aggregate || { count: '$sum' }, { having, sorts, filter, size });
        //     return this.json({ list: gs }, StatusCode.Ok);
        // }
        // else return this.json(StatusCode.NotFound)
    }

    async statisticsValue(sock: Sock, schemaName: string | DataStoreName, filter: Record<string, any>, indicator: string) {
        // let url = await this.getUrl(schemaId);
        // if (url) {
        //     var ind = indicator.startsWith('{') ? JSON.parse(indicator) : { indicator: { $sum: 1 } };
        //     var key = Object.keys(ind).first();
        //     var gs = await dataStore.aggregation(url, key, ind, { filter });
        //     return this.json({ value: gs[0][key] }, StatusCode.Ok);
        // }
        // else return this.json(StatusCode.NotFound)
    }
    // //#region /datastore
    // async allQuery<T = any>(sock: Sock, name: DataStoreName, options: { filter?: Record<string, any> }) {
    //     var result = await sock.get<{ list: T[], total: number }, string>('/datastore/:name/query/all', {
    //         name: name,
    //         filter: options.filter
    //     });
    //     return result.data;
    // }
    // async query<T = any>(sock: Sock, name: DataStoreName, options: { page?: number, size?: number, filter?: Record<string, any> }) {
    //     var result = await sock.get<{ list: T[], total: number }, string>('/datastore/:name/query', {
    //         name: name,
    //         page: options.page,
    //         size: options.size,
    //         filter: options.filter
    //     });
    //     return result.data;
    // }
    // async insertRow<T = any>(sock: Sock, name: DataStoreName, data: Partial<T>, pos?: { id: string, pos: "down" | 'up' }) {
    //     return (await sock.post<{ ok: boolean, data: Partial<T> }, string>('/datastore/:name/add', {
    //         name: name,
    //         data
    //     })).data;
    // }
    // async removeRow(sock: Sock, name: DataStoreName, id: string) {
    //     return (await sock.post<{ ok: boolean }, string>('/datastore/:name/remove', {
    //         name: name,
    //         id
    //     })).data;
    // }
    // async updateRow<T = any>(sock: Sock, name: DataStoreName, id: string, data: Partial<T>) {
    //     return (await sock.post<{ ok: boolean }, string>('/datastore/:name/update', {
    //         name: name,
    //         id,
    //         data
    //     })).data;
    // }
    // //#endregion
}
export var dataStoreService = new DataStoreService()