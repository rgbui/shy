




import { put, del, post, get } from "rich/net/annotation";
import { surface } from "../src/surface";

class SchemaService {
    @put('/schema/create')
    async createSchema() {
        var data = { ...arguments[0] };
        data.workspaceId = surface.workspace.id;
        console.log('schema create',data);
        return surface.workspace.sock.put('/schema/create', data);
    }
    @get('/schema/query')
    async searchSchema() {
        return surface.workspace.sock.get('/schema/query', arguments[0]);
    }
    @put('/schema/field/add')
    async createSchemaField() {
        var data = { ...arguments[0] };
        data.workspaceId = surface.workspace.id;
        return surface.workspace.sock.put('/schema/field/add', data);
    }

    @del('/schema/field/remove')
    async removeSchemaField() {
        return surface.workspace.sock.delete('/schema/field/remove', arguments[0]);
    }
    /**
     * 切换字段类型
     * 主要是考虑到有些字段需要转换
     * 如果数据量比较大，这个转换估计会有点慢，
     * 有些直接转换不了，转换不了直接置为空或者取当前默认值
     * @param id 
     * @param name 
     * @param type 
     */

    @post('/schema/field/turn')
    async turnSchemaFieldType() {
        return surface.workspace.sock.post('/schema/field/turn', arguments[0]);
    }

    @post('/schema/field/update')
    async updateSchemaField() {
        return surface.workspace.sock.post('/schema/field/update', arguments[0]);
    }
}
