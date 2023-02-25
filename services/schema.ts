




import { put, get, del } from "rich/net/annotation";
import { surface } from "../src/surface";

class SchemaService {
    @put('/schema/create')
    async createSchema() {
        var data = { ...arguments[0] };
        data.workspaceId = surface.workspace.id;
        return await surface.workspace.sock.put('/schema/create', data);
    }
    @get('/schema/query')
    async searchSchema() {
        return await surface.workspace.sock.get('/schema/query', arguments[0]);
    }
    @put('/schema/operate')
    async schemaOperate(args: { operate: Record<string, any> }) {
        return await surface.workspace.sock.put<{ result: { actions: any[] } }>('/view/operate/sync', {
            wsId: surface.workspace.id,
            operate: args.operate,
            schema: 'DataGridSchema',
            sockId: surface.workspace.tim.id
        })
    }
    @get('/schema/list')
    async getSchemas(args: Record<string, any>) {
        return await surface.workspace.sock.get('/schema/list', {
            wsId: surface.workspace.id,
            ...(args || {})
        })
    }
    @get('/schema/ids/list')
    async getSchemasByIds(args: Record<string, any>) {
        return await surface.workspace.sock.get('/schema/ids/list', {
            wsId: surface.workspace.id,
            ...(args || {})
        })
    }
    @del('/schema/delete')
    async deleteSchema(args: Record<string, any>) {
        return await surface.workspace.sock.delete('/schema/delete', {
            wsId: surface.workspace.id,
            ...(args || {})
        })
    }
    @put('/datastore/rank')
    async dataSchemaRank(args: Record<string, any>) {
        return await surface.workspace.sock.put('/datastore/rank', {
            wsId: surface.workspace.id,
            ...(args || {})
        })
    }
}
