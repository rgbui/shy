




import { put, get, del, air } from "rich/net/annotation";
import { surface } from "../src/surface/app/store";
import { wss } from "./workspace";
import { channel } from "rich/net/channel";

class SchemaService {
    @put('/schema/create')
    async createSchema(args) {
        args.wsId = surface.workspace.id;
        return await surface.workspace.sock.put('/schema/create', args);
    }
    @put('/schema/create/define')
    async createSchemaDefine(args) {
        args.wsId = surface.workspace.id;
        return await surface.workspace.sock.put('/schema/create/define', args);
    }
    @get('/schema/query')
    async searchSchema(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/schema/query', args);
    }
    @air('/schema/operate')
    async schemaOperate(args: { operate: Record<string, any> }, options: { locationId?: string | number }) {
        var r = await surface.workspace.sock.put<{ result: { actions: any[] } }>('/view/operate/sync', {
            wsId: surface.workspace.id,
            operate: args.operate,
            schema: 'DataGridSchema',
            sockId: surface.workspace.tim.id
        })
        channel.fire('/schema/operate', args as any, options)
        return r;
    }
   

    @get('/schema/list')
    async getSchemas(args: Record<string, any>) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/schema/list', args)
    }
    @get('/schema/ids/list')
    async getSchemasByIds(args: Record<string, any>) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/schema/ids/list', args)
    }
    @del('/schema/delete')
    async deleteSchema(args: Record<string, any>) {
        return await surface.workspace.sock.delete('/schema/delete', {
            wsId: surface.workspace.id,
            ...(args || {})
        })
    }
  
}
