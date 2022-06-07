import { db } from "../net/db";
export async function dbStore(args) {
    switch (args.key) {
        case 'findOne':
            return await (db as any)[args.name].where(args.where).first();
            break;
        case 'getOne':
            return await (db as any)[args.name].where({ id: args.id }).first();
            break;
        case 'insertOne':
            return await (db as any)[args.name].add(args.data);
            break;
        case 'update':
            var r = await (db as any)[args.name].where(args.where).first();
            if (r) await (db as any)[args.name].where('id').equals(r.id).modify(args.data);
            break;
        case 'save':
            var r = await (db as any)[args.name].where(args.where).first();
            if (r) await (db as any)[args.name].where('id').equals(r.id).modify(args.data);
            else await (db as any)[args.name].add(Object.assign(args.defaultValue || {}, args.data));
            break;
    }
}

window.addEventListener('message', async function (event) {
    if (!event.data) return;
    if (!(typeof event.data == 'string' && event.data.startsWith('{'))) return;
    try {
        var json = JSON.parse(event.data);
        if (json.id && json.url) {
            switch (json.url) {
                case 'dbStore':
                    var data = await dbStore(json.args);
                    top.postMessage(JSON.stringify({ id: json.id, data: data }), '*')
                    break;
                case 'localStorage.setItem':
                    localStorage.setItem.apply(localStorage, json.args);
                    top.postMessage(JSON.stringify({ id: json.id, data: null }), '*')
                    break;
                case 'localStorage.getItem':
                    var result = localStorage.getItem.apply(localStorage, json.args);
                    top.postMessage(JSON.stringify({ id: json.id, data: result }), '*')
                    break;
            }
        }
    }
    catch (ex) {
        console.warn(event.data);
        console.error(ex);
    }
}, false);