
var apis = [];
var path = require('path');
var fs = require('fs');
function push(url, args, returnType, methods, remark) {
    var objectUrl = {};
    if (Array.isArray(url)) { objectUrl.url = url[0]; objectUrl.syncUrl = url[1] }
    else objectUrl.url = url;
    if (typeof returnType == 'string') apis.push({ ...objectUrl, args, returnType, methods, remark });
    else if (Array.isArray(returnType)) apis.push({ ...objectUrl, args, returnType: returnType[0], syncType: returnType[1], methods, remark });
}

function build(fileName) {
    var ps = apis;
    var syncs = [];
    var onlys = [];
    var onces = [];
    var offs = [];
    var fires = [];
    var puts = [];
    var dels = [];
    var posts = [];
    var gets = [];
    var querys = [];
    var acts = [];
    var airs = [];
    function rt(type, isAsync) {
        if (isAsync) return `Promise<${type || 'void'}>`
        else return type;
    }
    function is(name, p) {
        if (Array.isArray(name)) {
            return p.methods.some(s => name.includes(s));
        }
        return p.methods.some(s => s == name);
    }

    function getP(args, isD) {
        if (args) return args;
        else return 'any';
    }
    ps.forEach(p => {
        var isAsync = false;
        if (p.methods.some(s => ['get', 'put', 'del', 'post'].includes(s))) var isHttp = true;
        if (p.methods.includes('await')) isAsync = true;
        if (!isHttp && !p.methods.includes('query') && !p.methods.includes('act') || p.methods.includes('air')) {
            syncs.push(`"${p.url}":{args:(r:${getP(p.args)})=>${rt(p.returnType, isAsync)},returnType:void}`);
            onlys.push(`"${p.url}":{args:(r:${getP(p.args)})=>${rt(p.returnType, isAsync)},returnType:void}`);
            onces.push(`"${p.url}":{args:(r:${getP(p.args)})=>${rt(p.returnType, isAsync)},returnType:void}`);
            offs.push(`"${p.url}":{args:(r:${getP(p.args)})=>${rt(p.returnType, isAsync)},returnType:void}`);
            fires.push(`"${p.url}":{args:${getP(p.args)},returnType:${rt(p.returnType, isAsync)}}`);
        }
        if (isHttp) isAsync = true;
        if (is('put', p))
            puts.push(`"${p.url}":{args:${getP(p.args)},returnType:${rt(p.returnType, isAsync)}}`);
        if (is('del', p))
            dels.push(`"${p.url}":{args:${getP(p.args)},returnType:${rt(p.returnType, isAsync)}}`);
        if (is('post', p))
            posts.push(`"${p.url}":{args:${getP(p.args)},returnType:${rt(p.returnType, isAsync)}}`);
        if (is('get', p))
            gets.push(`"${p.url}":{args:${getP(p.args)},returnType:${rt(p.returnType, isAsync)}}`);
        if (is('query', p))
            querys.push(`"${p.url}":{args:${getP(p.args)},returnType:${rt(p.returnType, isAsync)}}`);
        if (is('act', p))
            acts.push(`"${p.url}":{args:${getP(p.args)},returnType:${rt(p.returnType, isAsync)}}`);
        if (is('air', p))
            airs.push(`"${p.url}":{args:${getP(p.args)},returnType:${rt(p.returnType, isAsync)}}`);
        // if (!isHttp) strs.push(`fire(url:'${p.url}'${getP(p.args, true)}):${rt(p.returnType, isAsync)};`);

    })

    fs.writeFileSync(fileName, `
import { Field } from "../blocks/data-grid/schema/field";
import { TableSchema } from "../blocks/data-grid/schema/meta";
import { FieldType } from "../blocks/data-grid/schema/type";
import { LinkPage } from "../extensions/at/declare";
import { IconArguments } from "../extensions/icon/declare";
import { GalleryType, OuterPic } from "../extensions/image/declare";
import { User } from "../src/types/user";
export interface ChannelSyncMapUrls {
    ${syncs.join(",\n\t")}
}
export interface ChannelOnlyMapUrls {
    ${onlys.join(",\n\t")}
}
export interface ChannelOnceMapUrls {
    ${onces.join(",\n\t")}
}
export interface ChannelOffMapUrls {
    ${offs.join(",\n\t")}
}
export interface ChannelFireMapUrls {
    ${fires.join(",\n\t")}
}
export interface ChannelDelMapUrls {
    ${dels.join(",\n\t")}
}
export interface ChannelPostMapUrls {
    ${posts.join(",\n\t")}
}
export interface ChannelPutMapUrls {
    ${puts.join(",\n\t")}
}
export interface ChannelGetMapUrls {
    ${gets.join(",\n\t")}
}
export interface ChannelQueryMapUrls {
    ${querys.join(",\n\t")}
}
export interface ChannelActMapUrls {
    ${acts.join(",\n\t")}
}
export interface ChannelAirMapUrls {
    ${airs.join(",\n\t")}
}
    `);

}
push('/log', `{type:"error"|"warn"|"info",message:string|Error}`, 'void', ['rich'])
push('/upload/file', '{file:File,uploadProgress: (event: ProgressEvent) => void}', '{ ok: boolean, data: { url: string },warn:string }', ['post', 'shy'])
push('/workspace/upload/file', '{file:File,uploadProgress: (event: ProgressEvent) => void}', '{ ok: boolean, data: { url: string },warn:string }', ['post', 'workspace', 'rich'])
push('/workspace/upload/file/url', '{url:string}', '{ ok: boolean, data: { url: string },warn:string }', ['post', 'workspace', 'rich'])

push('/gallery/query', `{type: GalleryType, word: string}`, `{ok:boolean,data:OuterPic[],warn:string}`, ['get', 'rich'])
push('/page/query/links', '{word:string}', '{ok:boolean,data:LinkPage[],warn:string}', ['rich', 'get']);
push('/page/create/by_text', '{word:string}', '{ok:boolean,data:LinkPage,warn:string}', ['rich', 'act']);
push('/page/update/info', `{id: string, pageInfo: { text: string, icon?: IconArguments }}`, `void`, ['rich', 'air']);
push('/page/query/info', `{id: string}`, `{ok:boolean,data:LinkPage,warn:string}`, ['rich', 'get']);
push('/page/open', `{item:string|{id:string}}`, `void`, ['rich', 'act']);
push('/page/notify/toggle', `{id: string,visible:boolean}`, `void`, ['shy', 'act']);

push('/workspace/query/users', '', `User[]`, ['rich', 'query'])
push('/update/user', '{user: Record<string, any>}', 'void', ['rich', 'air']);
push('/query/current/user', '', 'User', ['rich', 'query']);

push('/workspace/query/schemas', '{page?:number,size?:number}', '{ok:boolean,data:{total:number,list:Partial<TableSchema>[],page:number,size:number},warn:string}', ['rich', 'get']);
push('/schema/create', '{text:string,templateId?:string}', '{ ok: boolean, data: { schema:Partial<TableSchema> },warn:string }', ['put', 'workspace', 'rich']);
push('/schema/query', '{id:string}', '{ok:boolean,data:{schema:Partial<TableSchema>},warn:string}', ['rich', 'get']);
push('/schema/field/add', '{schemaId:string,text:string,type:FieldType}', '{ok:boolean,data:{field:Partial<Field>},warn:string}', ['rich', 'put']);
push('/schema/field/remove', '{schemaId:string,fieldId:string}', '{ok:boolean,warn:string}', ['rich', 'del']);
push('/schema/field/update', '{schemaId:string,fieldId:string,data:Partial<Field>}', '{ok:boolean,data:{field:Partial<Field>},warn:string}', ['rich', 'post']);
push('/schema/field/turn', '{schemaId:string,fieldId:string,type:FieldType}', '{ok:boolean,data:{field:Partial<Field>},warn:string}', ['rich', 'post']);

push('/datastore/add', '{schemaId:string,data:Record<string, any>,pos:{dataId:string,pos:"before"|"after"}}', '{ok:boolean,data:{data:Record<string, any>},warn:string}', ['rich', 'put']);
push('/datastore/batch/add', '{schemaId:string,list:any[]}', '{ok:boolean,data:{list:any[]},warn:string}', ['rich', 'put']);
push('/datastore/remove', '{schemaId:string,dataId:string}', '{ok:boolean,warn:string}', ['rich', 'del']);
push('/datastore/update', '{schemaId:string,dataId:string,data:Record<string, any>}', '{ok:boolean,warn:string}', ['rich', 'post']);
push('/datastore/query', '{schemaId:string,id:string}', '{ok:boolean,data:{data:Record<string, any>},warn:string}', ['rich', 'get']);
push('/datastore/query/list', '{schemaId:string,page?:number,size?:number,filter?:Record<string, any>,sorts?:Record<string, 1|-1>}', '{ok:boolean,data:{list:any[],total:number,page:number,size:number},warn:string}', ['rich', 'get']);
push('/datastore/query/ids', '{schemaId:string,ids:string[]}', '{ok:boolean,data:{list:any[]},warn:string}', ['rich', 'put']);
push('/datastore/query/all', '{schemaId:string,page?:number,size?:number,filter?:Record<string, any>,sorts?:Record<string, 1|-1>}', '{ok:boolean,data:{list:any[],total:number,page:number,size:number},warn:string}', ['rich', 'get']);
push('/datastore/group', '{schemaId:string,page?:number,size?:number,filter?:Record<string, any>,sorts?:Record<string, 1|-1>,group:string}', '{ok:boolean,data:{list:any[],total:number,page:number,size:number},warn:string}', ['rich', 'get']);
push('/datastore/statistics', '{schemaId:string,page?:number,size?:number,filter?:Record<string, any>,having?:Record<string, any>,sorts?:Record<string, 1|-1>,groups:string[],aggregate:string[]}', '{ok:boolean,data:{list:any[],total:number,page:number,size:number},warn:string}', ['rich', 'get']);
push('/datastore/statistics/value', '{schemaId:string,filter?:Record<string, any>,indicator:string}', '{ok:boolean,data:{value:number},warn:string}', ['rich', 'get']);

push('/device/register', '', 'void', ['shy', 'act', 'await']);
push('/device/query', '', 'string', ['shy', 'query', 'await']);
push('/user/ping', '', '{ok:boolean,warn:string}', ['shy', 'get', 'await'])
push('/amap/key_pair', '', '{key:string,pair:string}', ['shy', 'query'])

build(path.join(__dirname, "../../rich/net/declare.ts"), 'rich');
//build(path.join(__dirname, "../net/declare.ts"), 'shy');