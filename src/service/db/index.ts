import { TableSchema } from "./schema";
export class DB {
    name: string = '';
    constructor(name: string) {
        this.name = name;
    }
    db: IDBDatabase;
    async open() {
        return new Promise((resolve, reject) => {
            var self = this;
            var request = window.indexedDB.open(self.name);
            function willOpen(db: IDBDatabase) {
                if (!self.db) { self.db = db; resolve(self.db); }
                else return;
            }
            request.onerror = function (event) {
                reject('数据库连接失败')
            };
            request.onsuccess = function (event) {
                var r = request.result;
                if (r) willOpen(r);
            };
            request.onupgradeneeded = function (event) {
                var r = (event.target as any).result;
                if (r) willOpen(r);
            }
        })
    }
    /**
     * 注意indexdb索引一旦创建，后续将不能再创建了
     * 考虑每个字段都创建索引（除了特殊类型的）
     * @param schemas 
     */
    async create(schemas: TableSchema[]) {
        var self = this;
        async function table(ts: TableSchema) {
            var store: IDBObjectStore;
            if (!self.db.objectStoreNames.contains(ts.name)) {
                store = self.db.createObjectStore(ts.name, { keyPath: ts.key.name });
                ts.indexs.each(index => {
                    store.createIndex(index.name, index.name, { unique: false })
                })
            }
        }
        await schemas.eachAsync(async ts => await table(ts))
    }
    async insertOne(tableName: string, data: Record<string, any>) {
        return new Promise((resolve, reject) => {
            var trans = this.db.transaction(tableName, "readwrite");
            var store = trans.objectStore(tableName);
            var request = store.add(data);
            request.onerror = (ev) => {
                reject(ev);
            }
            request.onsuccess = function (ev) {
                resolve(ev);
            }
        })
    }
    async insertMany(tableName: string, datas: Record<string, any>[]) {
        var trans = this.db.transaction(tableName, "readwrite");
        var store = trans.objectStore(tableName);
        async function insertOne(data) {
            return new Promise((resolve, reject) => {
                var request = store.add(data);
                request.onerror = (ev) => {
                    reject(ev);
                }
                request.onsuccess = function (ev) {
                    resolve(ev);
                }
            })
        }
        await datas.eachAsync(async d => {
            await insertOne(d);
        })
    }
    async updateOne(tableName: string, id: string, data: Record<string, any>) {
        return new Promise((resolve, reject) => {
            var trans = this.db.transaction(tableName, "readwrite");
            var store = trans.objectStore(tableName);
            var request = store.put(data, id)
            request.onerror = (ev) => {
                reject(ev);
            }
            request.onsuccess = function (ev) {
                resolve(ev);
            }
        })
    }
    async deleteOne(tableName: string, id: string) {
        return new Promise((resolve, reject) => {
            var trans = this.db.transaction(tableName, "readwrite");
            var store = trans.objectStore(tableName);
            var request = store.delete(id)
            request.onerror = (ev) => {
                reject(ev);
            }
            request.onsuccess = function (ev) {
                resolve(ev);
            }
        })
    }
    async findOne(tableName: string, id: string) {
        return new Promise((resolve, reject) => {
            var trans = this.db.transaction(tableName, "readwrite");
            var store = trans.objectStore(tableName);
            var request = store.get(id)
            request.onerror = (ev) => {
                reject(ev);
            }
            request.onsuccess = function (ev) {
                resolve((ev.target as any).result);
            }
        })
    }
    /**
     * 
     * @param tableName 
     * @param query 只能是and查询，不能是or,且查询条件限制为 等于某个值或处于某个值的范围内
     * @returns 
     */
    async findAll(tableName: string, query: Record<string, any>) {
        var self = this;
        var ps: any[] = [];
        return new Promise((resolve, reject) => {
            var transaction = self.db.transaction([tableName], 'readwrite');
            var objectStore = transaction.objectStore(tableName);
            var keys = Object.keys(query);
            var key = keys.first();
            var value = query[key];
            var index = objectStore.index(key);
            var range: IDBKeyRange;
            if (typeof value == 'object' && Object.keys(value).exists(g => g.startsWith('$'))) {
                var vks = Object.assign(value);
                if (vks.length == 2) {
                    var args: any[] = [];
                    args.push(vks.exists('$gt') ? value.$gt : value.$gte);
                    args.push(vks.exists('$lt') ? value.$lt : value.$lte);
                    args.push(vks.exists('$gt') ? true : false);
                    args.push(vks.exists('$lt') ? true : false);
                    range = IDBKeyRange.bound.apply(IDBKeyRange, args);
                }
                else if (vks.length == 1) {
                    if (vks[0] == '$gt') {
                        range = IDBKeyRange.lowerBound(value, true);
                    }
                    else if (vks[0] == '$gte') {
                        range = IDBKeyRange.lowerBound(value);
                    }
                    else if (vks[0] == '$lt') {
                        range = IDBKeyRange.upperBound(value, true);
                    } else if (vks[0] == '$lte') {
                        range = IDBKeyRange.upperBound(value);
                    }
                }
            }
            else {
                range = IDBKeyRange.only(value);
            }
            var request = index.openCursor(range);
            request.onsuccess = function (event) {
                var cursor = (event.target as any).result as IDBCursorWithValue;
                if (cursor) {
                    // 使用Object.assign方法是为了避免控制台打印时出错
                    console.log(Object.assign(cursor.value));
                    if (self.filter(query, cursor.value)) {
                        ps.push(cursor.value);
                    }
                    cursor.continue();
                }
                else {
                    resolve(ps);
                }
            };
            request.onerror = function (event) {
                // 错误处理!
                reject(event);
            };
        })
    }
    private filter(query: Record<string, any>, data: Record<string, any>) {
        for (var n in query) {
            var value = query[n];
            if (typeof value == 'object' && Object.keys(value).exists(g => g.startsWith('$'))) {
                var keys = Object.keys(value);
                for (let k of keys) {
                    if (k == '$gt' && !(value[k] > data[n])) return false;
                    else if (k == '$gte' && !(value[k] >= data[n])) return false;
                    else if (k == '$lt' && !(value[k] < data[n])) return false;
                    else if (k == '$lte' && !(value[k] <= data[n])) return false;
                }
            }
            else {
                if (value != data[n]) return false;
            }
        }
        return true;
    }
}