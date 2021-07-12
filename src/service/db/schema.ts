

export class TableSchema {
    name: string;
    fields: FieldSchema[] = [];
    get key() {
        return this.fields.find(f => f.isKey)
    }
    get indexs() {
        return this.fields.findAll(x => x.isIndex)
    }
}
/**
 * 主键一般不会变，
 * 其它的可以更新
 */
export class FieldSchema {
    name: string;
    type: 'string' | 'int';
    isKey: boolean;
    isIndex: boolean;
}