
import { surface } from "../src/surface/store";
import { del, put, get, patch } from "rich/net/annotation";

class DataStoreService {
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
    @get('/datastore/query')
    async query(args) {
        args.wsId = surface.workspace.id;
        return surface.workspace.sock.get('/datastore/query', args)
    }
    @get('/datastore/query/list')
    async queryList(args) {
        args.wsId = surface.workspace.id;
        return surface.workspace.sock.get('/datastore/query/list', args)
    }
    @get('/datastore/query/ids')
    async queryIds(args) {
        args.wsId = surface.workspace.id;
        return surface.workspace.sock.get('/datastore/query/ids', args)
    }
    @get('/datastore/query/all')
    async queryAll(args) {
        args.wsId = surface.workspace.id;
        return surface.workspace.sock.get('/datastore/query/all', args)
    }
    @get('/datastore/group')
    async group(args) {
        args.wsId = surface.workspace.id;
        return surface.workspace.sock.get('/datastore/group', args)
    }
    @get('/datastore/statistics')
    async statistics(args) {
        args.wsId = surface.workspace.id;
        return surface.workspace.sock.get('/datastore/statistics', args)
    }
    @get('/datastore/statistics/value')
    async statisticsValue(args) {
        args.wsId = surface.workspace.id;
        return surface.workspace.sock.get('/datastore/statistics/value', args)
    }
    @put('/datastore/row/object/update')
    async datastoreRowObjectUpdate(args) {
        args.wsId = surface.workspace.id;
        return surface.workspace.sock.put('/datastore/row/object/update', args)
    }
    @del('/datastore/remove/ids')
    async dateStoreDeleteIds(args) {
        args.wsId = surface.workspace.id;
        return surface.workspace.sock.delete('/datastore/remove/ids', args)
    }
    @get('/datastore/exists/user/submit')
    async dataStoreExistsSubmit(args) {
        args.wsId = surface.workspace.id;
        return surface.workspace.sock.get('/datastore/exists/user/submit', args);
    }
}
