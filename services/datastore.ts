
import { surface } from "../src/surface/app/store";
import { del, put, get, patch, air } from "rich/net/annotation";
import { wss } from "./workspace";
import { channel } from "rich/net/channel";

class DataStoreService {

    @air('/datastore/operate')
    async schemaDataOperate(args: { operate: Record<string, any> }, options: { locationId?: string | number }) {
        var r = await surface.workspace.sock.put<{ result: { actions: any[] } }>('/view/operate/sync', {
            wsId: surface.workspace.id,
            operate: args.operate,
            schema: 'DataStore',
            sockId: surface.workspace.tim.id
        });
        (args as any).result = r.data
        channel.fire('/datastore/operate', args as any, options)
        return r;
    }
    @put('/datastore/rank')
    async dataSchemaRank(args: Record<string, any>) {
        return await surface.workspace.sock.put('/datastore/rank', {
            wsId: surface.workspace.id,
            ...(args || {})
        })
    }
    @put('/datastore/add')
    async add(args) {
        args.wsId = surface.workspace.id;
        return surface.workspace.sock.put('/datastore/add', args)
    }
    @put('/datastore/batch/add')
    async batchAdd(args) {
        args.wsId = surface.workspace.id;
        return surface.workspace.sock.put('/datastore/batch/add', args)
    }
    @del('/datastore/remove')
    async remove(args) {
        args.wsId = surface.workspace.id;
        return surface.workspace.sock.delete('/datastore/remove', args)
    }
    @patch('/datastore/update')
    async update(args) {
        args.wsId = surface.workspace.id;
        return surface.workspace.sock.patch('/datastore/update', args)
    }
    @patch('/datastore/row/update')
    async patchRow(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return surface.workspace.sock.patch('/datastore/row/update', args)
    }
    @get('/datastore/query')
    async query(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/datastore/query', args)
    }
    @get('/datastore/query/pre_next')
    async queryPre(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/datastore/query/pre_next', args)
    }
    @get('/datastore/query/list')
    async queryList(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/datastore/query/list', args)
    }
    @get('/datastore/query/distinct')
    async queryDistinct(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/datastore/query/distinct', args)
    }
    @get('/datastore/query/ids')
    async queryIds(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/datastore/query/ids', args)
    }
    @get('/datastore/query/all')
    async queryAll(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return surface.workspace.sock.get('/datastore/query/all', args)
    }
    @get('/datastore/group')
    async group(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/datastore/group', args)
    }
    @get('/datastore/statistics')
    async statistics(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/datastore/statistics', args)
    }
    @get('/datastore/statistics/value')
    async statisticsValue(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/datastore/statistics/value', args)
    }
    @put('/datastore/row/object/update')
    async datastoreRowObjectUpdate(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return sock.put('/datastore/row/object/update', args)
    }
    @del('/datastore/remove/ids')
    async dateStoreDeleteIds(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return sock.delete('/datastore/remove/ids', args)
    }
    @get('/datastore/exists/user/submit')
    async dataStoreExistsSubmit(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/datastore/exists/user/submit', args);
    }


    @get('/datastore/stat/fields')
    async dataStoreStatFields(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/datastore/stat/fields', args);
    }
    @get('/datastore/board/statistics')
    async dataStoreBoardStat(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/datastore/board/statistics', args);
    }
    @get('/datastore/board/stat/fields')
    async dataStoreBoardStatFields(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/datastore/board/stat/fields', args);
    }
    @get('/datastore/dataGrid/list')
    async dataGridList(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/datastore/dataGrid/list', args);
    }
    @get('/datastore/dataGrid/sub/list')
    async dataGridSubList(args) {
        if (!args) args = {}
        var sock = await wss.getArgsSock(args);
        return await sock.get('/datastore/dataGrid/sub/list', args);
    }
}
