
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
    var patchs = [];
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
        if (p.methods.some(s => ['get', 'patch', 'put', 'del', 'post'].includes(s))) var isHttp = true;
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
        if (is('patch', p))
            patchs.push(`"${p.url}":{args:${getP(p.args)},returnType:${rt(p.returnType, isAsync)}}`);
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
import { LinkPageItem } from "../extensions/at/declare";
import { IconArguments, ResourceArguments } from "../extensions/icon/declare";
import { GalleryType, OuterPic } from "../extensions/image/declare";
import { User } from "../src/types/user";
import { StatusCode } from "./status.code";
export type SockResponse<T, U = string> = {
        /**
         * 返回状态码
         */
        code?: StatusCode,
        /**
         * 表示当前的是否处理正常
         * 通常200~300表示正常处理
         * 大于300小于500表示处理不正常，
         * 500 seriver happend error
         * 返回值是用来提醒处理异常原因的
         */
        ok?: boolean,
        data?: T,
        warn?: U
    }
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
export interface ChannelPatchMapUrls {
    ${patchs.join(",\n\t")}
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

push('/gallery/query', `{type: GalleryType, word: string}`, `{ok:boolean,data:OuterPic[],warn:string}`, ['get', 'rich'])

push('/page/create/by_text', '{word:string}', 'SockResponse<LinkPageItem>', ['act']);
push('/page/update/info', `{id: string, pageInfo:LinkPageItem}`, `void`, ['air']);
push('/page/query/info', `{id: string}`, `SockResponse<LinkPageItem>`, ['get']);
push('/page/open', `{item:string|{id:string}}`, `void`, ['air']);
push('/page/notify/toggle', `{id: string,visible:boolean}`, `void`, ['shy', 'air']);
push('/current/workspace','','{id:string,sn:number,text:string}',['query'])


push('/update/user', '{user: Record<string, any>}', 'void', ['air']);
push('/query/current/user', '', 'User', ['query']);

push('/workspace/query/schemas', '{page?:number,size?:number}', '{ok:boolean,data:{total:number,list:Partial<TableSchema>[],page:number,size:number},warn:string}', ['get']);
push('/schema/create', '{text:string,templateId?:string}', '{ ok: boolean, data: { schema:Partial<TableSchema> },warn:string }', ['put', 'workspace', 'rich']);
push('/schema/query', '{id:string}', '{ok:boolean,data:{schema:Partial<TableSchema>},warn:string}', ['get']);
push('/schema/field/add', '{schemaId:string,text:string,type:FieldType}', '{ok:boolean,data:{field:Partial<Field>},warn:string}', ['put']);
push('/schema/field/remove', '{schemaId:string,fieldId:string}', '{ok:boolean,warn:string}', ['del']);
push('/schema/field/update', '{schemaId:string,fieldId:string,data:Partial<Field>}', '{ok:boolean,data:{field:Partial<Field>},warn:string}', ['post']);
push('/schema/field/turn', '{schemaId:string,fieldId:string,type:FieldType}', '{ok:boolean,data:{field:Partial<Field>},warn:string}', ['post']);

push('/datastore/add', '{schemaId:string,data:Record<string, any>,pos:{dataId:string,pos:"before"|"after"}}', '{ok:boolean,data:{data:Record<string, any>},warn:string}', ['put']);
push('/datastore/batch/add', '{schemaId:string,list:any[]}', '{ok:boolean,data:{list:any[]},warn:string}', ['put']);
push('/datastore/remove', '{schemaId:string,dataId:string}', '{ok:boolean,warn:string}', ['del']);
push('/datastore/update', '{schemaId:string,dataId:string,data:Record<string, any>}', 'SockResponse<void>', ['patch']);
push('/datastore/query', '{schemaId:string,id:string}', '{ok:boolean,data:{data:Record<string, any>},warn:string}', ['get']);
push('/datastore/query/list', '{schemaId:string,page?:number,size?:number,filter?:Record<string, any>,sorts?:Record<string, 1|-1>}', '{ok:boolean,data:{list:any[],total:number,page:number,size:number},warn:string}', ['get']);
push('/datastore/query/ids', '{schemaId:string,ids:string[]}', '{ok:boolean,data:{list:any[]},warn:string}', ['put']);
push('/datastore/query/all', '{schemaId:string,page?:number,size?:number,filter?:Record<string, any>,sorts?:Record<string, 1|-1>}', '{ok:boolean,data:{list:any[],total:number,page:number,size:number},warn:string}', ['get']);
push('/datastore/group', '{schemaId:string,page?:number,size?:number,filter?:Record<string, any>,sorts?:Record<string, 1|-1>,group:string}', '{ok:boolean,data:{list:any[],total:number,page:number,size:number},warn:string}', ['get']);
push('/datastore/statistics', '{schemaId:string,page?:number,size?:number,filter?:Record<string, any>,having?:Record<string, any>,sorts?:Record<string, 1|-1>,groups:string[],aggregate?: Record<string, any>}', '{ok:boolean,data:{list:any[],total:number,page:number,size:number},warn:string}', ['get']);
push('/datastore/statistics/value', '{schemaId:string,filter?:Record<string, any>,indicator:string}', '{ok:boolean,data:{value:number},warn:string}', ['get']);

push('/device/sign', '', 'void', ['put']);
push('/device/query', '', 'string', ['shy', 'query', 'await']);

push('/sign', '', '{ok:boolean,warn:string,data:{user:Record<string,any>,guid:string,token:string}}', ['get'])
push('/sign/out', '', 'SockResponse<void>', ['get'])

push('/phone/sign', '{phone:string,code:string,inviteCode:string}', '{ok:boolean,warn:string,data:{user:Record<string,any>,guid:string,token:string}}', ['put'])
push('/phone/sms/code', '{phone:string}', '{ok:boolean,warn:string,data:{success:boolean,code?:string}}', ['post'])
push('/phone/check/sign', '{phone:string}', '{ok:boolean,warn:string,data:{sign:boolean}}', ['get'])
push('/user/query', '', 'SockResponse<{user:Record<string,any>}>', ['get']);
push('/user/patch', '{data:Record<string,any>}', 'SockResponse<void>', ['patch'])
push('/user/basic', '{userid:string}', 'SockResponse<{user:{sn: number, avatar: ResourceArguments, name: string}}>', ['get'])
push('/user/upload/file', '{file:File,uploadProgress: (event: ProgressEvent) => void}', 'SockResponse<{url:string}>', ['post'])
push('/user/wss', '', 'SockResponse<{list:any[]}>', ['get'])
push('/amap/key_pair', '', '{key:string,pair:string}', ['shy', 'query'])
push('/ws/basic', '{name?:string,wsId?:string}', 'SockResponse<{workspace:Record<string,any>}>', ['get'])
push('/ws/query', '{wsId?:string}', 'SockResponse<{workspace:Record<string,any>}>', ['get'])
push('/ws/latest', '', 'SockResponse<{workspace:Record<string,any>}>', ['get'])
push('/ws/create', '{text:string,templateId?:string}', 'SockResponse<{workspace:Record<string,any>}>', ['put'])
push('/ws/invite/create', '', 'SockResponse<{code:string}>', ['put']);
push('/ws/invite/check', '{invite:string}', 'SockResponse<{member:boolean,workspace:Record<string,any>}>', ['get']);
push('/ws/invite/join', '{wsId:string}', 'SockResponse<{workspace:Record<string,any>}>', ['post']);
push('/ws/sitedomain/patch', '{domain:string}', 'SockResponse<{success:boolean,overflowDue:boolean}>', ['patch']);
push('/ws/patch', '{wsId?:string,sockId?:string,data:Record<string,any>}', 'SockResponse<void>', ['patch']);
push('/ws/upload/file', '{file:File,uploadProgress: (event: ProgressEvent) => void}', 'SockResponse<{ url: string }>', ['post'])
push('/ws/download/url', '{url:string}', 'SockResponse<{ url: string }>', ['post'])

push('/page/items', '{ids:string[]}', 'SockResponse<{ list:any[] }>', ['get'])
push('/page/item/subs', '{id:string}', 'SockResponse<{ list:any[] }>', ['get'])
push('/page/item', '{id:string}', 'SockResponse<{ item:Record<string,any> }>', ['get'])
push('/page/word/query', '{word:string}', 'SockResponse<LinkPageItem[]>', ['get']);

build(path.join(__dirname, "../../rich/net/declare.ts"), 'rich');
//build(path.join(__dirname, "../net/declare.ts"), 'shy');