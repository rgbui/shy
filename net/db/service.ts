import { db } from ".";

export class DbService<T extends { id: string }>{
    constructor(private name: string) { }
    async findOne(where: Partial<T>): Promise<T> {
        return await (db as any)[this.name].where(where).first();
    }
    async getOne(id: string): Promise<T> {
        return await (db as any)[this.name].where({ id }).first() as T;
    }
    async insertOne(data: Partial<T>) {
        await (db as any)[this.name].add(data);
    }
    async update(where: Partial<T>, data: Partial<T>) {
        var r = await this.findOne(where);
        if (r) {
            await (db as any)[this.name].where('id').equals(r.id).modify(data);
        }
    }
    async save(where: Partial<T>, data: Partial<T>, defaultValue?: Partial<T>) {
        var r = await this.findOne(where);
        if (r) {
            await (db as any)[this.name].where('id').equals(r.id).modify(data);
        }
        else await this.insertOne(Object.assign(defaultValue || {}, data));
    }
}