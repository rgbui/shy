
import { iframeChannel } from "../auth/iframe";
export class DbService<T extends { id: string }>{
    constructor(private name: string) { }
    private async channelStore(d) {
        return await iframeChannel('dbStore', d);
    }
    async findOne(where: Partial<T>): Promise<T> {
        return await this.channelStore({ key: 'findOne', name: this.name, where }) as any;
    }
    async getOne(id: string): Promise<T> {
        return await this.channelStore({ key: 'getOne', name: this.name, id }) as any;
    }
    async insertOne(data: Partial<T>) {
        return await this.channelStore({ key: 'insertOne', data }) as any;
    }
    async update(where: Partial<T>, data: Partial<T>) {
        return await this.channelStore({ key: 'update', where, data }) as any;
    }
    async save(where: Partial<T>, data: Partial<T>, defaultValue?: Partial<T>) {
        return await this.channelStore({ key: 'save', name: this.name, where, data, defaultValue }) as any;
    }
}