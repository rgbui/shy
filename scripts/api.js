
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

function build(fileName, project) {
    var ps = apis.filter(g => g.methods.some(s => s == project));
    var strs = [];
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
        if (args) { return (isD ? "," : "") + `parameter:${args}` }
        else return '';
    }
    ps.forEach(p => {
        var isAsync = false;
        if (p.methods.some(s => ['get', 'put', 'del', 'post'].includes(s))) var isHttp = true;
        if (p.methods.includes('await')) isAsync = true;
        if (!isHttp && !p.methods.includes('query') && !p.methods.includes('act') || p.methods.includes('air')) {
            strs.push(`sync(url:'${p.url}',handle:(${getP(p.args)})=>${rt(p.returnType, isAsync)});`);
            strs.push(`only(url:'${p.url}',handle:(${getP(p.args)})=>${rt(p.returnType, isAsync)});`);
            strs.push(`once(url:'${p.url}',handle:(${getP(p.args)})=>${rt(p.returnType, isAsync)});`);
            strs.push(`off(url:'${p.url}',handle?:(${getP(p.args)})=>${rt(p.returnType, isAsync)});`);
            strs.push(`fire(url:'${p.url}'${getP(p.args, true)}):${rt(p.returnType, isAsync)};`);
        }
        if (isHttp) isAsync = true;
        if (is('put', p))
            strs.push(`put(url:'${p.url}'${getP(p.args, true)}):${rt(p.returnType, isAsync)};`);
        if (is('del', p))
            strs.push(`del(url:'${p.url}'${getP(p.args, true)}):${rt(p.returnType, isAsync)};`);
        if (is('post', p))
            strs.push(`post(url:'${p.url}'${getP(p.args, true)}):${rt(p.returnType, isAsync)};`);
        if (is('get', p))
            strs.push(`get(url:'${p.url}'${getP(p.args, true)}):${rt(p.returnType, isAsync)};`);
        if (is('query', p))
            strs.push(`query(url:'${p.url}'${getP(p.args, true)}):${rt(p.returnType, isAsync)};`);
        if (is('act', p))
            strs.push(`act(url:'${p.url}'${getP(p.args, true)}):${rt(p.returnType, isAsync)};`);
        if (is('air', p))
            strs.push(`air(url:'${p.url}'${getP(p.args, true)}):${rt(p.returnType, isAsync)};`);
        // if (!isHttp) strs.push(`fire(url:'${p.url}'${getP(p.args, true)}):${rt(p.returnType, isAsync)};`);

    })
    if (project == 'rich')
        fs.writeFileSync(fileName, `
import { Field } from "../blocks/table-store/schema/field";
import { FieldType } from "../blocks/table-store/schema/field.type";
import { TableSchema } from "../blocks/table-store/schema/meta";
import { LinkPage } from "../extensions/at/declare";
import { IconArguments } from "../extensions/icon/declare";
import { GalleryType, OuterPic } from "../extensions/image/declare";
import { User } from "../src/types/user";
export interface Channel {
    ${strs.join("\n\t")}
}
    `);
    else {
        fs.writeFileSync(fileName, `
export interface Channel {
    ${strs.join("\n\t")}
}
            `);
    }
}

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
push('/schema/query', '{id:string}', '{ok:boolean,data:Partial<TableSchema>,warn:string}', ['rich', 'get']);
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
push('/datastore/statistics/value', '{schemaId:string,filter:Record<string, any>,indicator:string[]}', '{ok:boolean,data:{value:number},warn:string}', ['rich', 'get']);

push('/device/register', '', 'void', ['shy', 'act', 'await']);
push('/device/get', '', 'string', ['shy', 'query', 'await']);
push('/user/ping', 'void', '{ok:boolean,warn:string}', ['shy', 'get', 'await'])

build(path.join(__dirname, "../../rich/net/declare.d.ts"), 'rich');
build(path.join(__dirname, "../net/declare.ts"), 'shy');