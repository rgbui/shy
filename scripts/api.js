
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
import { TableSchema } from "../blocks/data-grid/schema/meta";
import { LinkPageItem } from "../extensions/at/declare";
import { GalleryType, OuterPic } from "../extensions/image/declare";
import { StatusCode } from "./status.code";
import { UserAction } from "../src/history/action";
import { UserBasic, UserStatus } from "../types/user";
import { ResourceArguments } from "../extensions/icon/declare";
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
push('/page/update/info', `{id?: string,elementUrl?:string, pageInfo:LinkPageItem}`, `void`, ['air']);
push('/page/query/info', `{id?: string,elementUrl?:string}`, `SockResponse<LinkPageItem>`, ['get']);
push('/page/open', `{item?: string | { id: string }, elementUrl?: string,config?:{isTemplate?:boolean}}`, `void`, ['air']);
push('/page/dialog', '{elementUrl:string,config?:{isTemplate?:boolean}}', 'any', ['air']);
push('/page/slide', '{elementUrl:string,config?:{isTemplate?:boolean}}', 'any', ['air']);
push('/page/notify/toggle', `{id: string,visible:boolean}`, `void`, ['shy', 'air']);
push('/page/remove', '{item:string|{id:string}}', `void`, ['air']);
push('/current/workspace', '', '{id:string,sn:number,text:string}', ['query'])
push('/update/user', '{user: Record<string, any>}', 'void', ['air']);
push('/query/current/user', '', 'UserBasic', ['query']);
push('/page/create/sub', '{pageId:string,text:string}', 'LinkPageItem', ['air'])
push('/cache/get', '{key:string}', 'Promise<any>', ['query']);
push('/cache/set', '{key:string,value:any}', 'Promise<void>', ['act']);

push('/schema/create', '{text:string,url:string,templateId?:string}', '{ ok: boolean, data: { schema:Partial<TableSchema> },warn:string }', ['put', 'workspace', 'rich']);
push('/schema/query', '{id:string}', '{ok:boolean,data:{schema:Partial<TableSchema>},warn:string}', ['get']);
push('/schema/operate', '{operate:{operate?:string,schemaId:string,date?:Date,actions:any[]}}', 'SockResponse<{actions:any[]}>', ['put']);
push('/schema/list', '{page?:number,size?:number}', 'SockResponse<{total:number,list:Partial<TableSchema>[],page:number,size:number}>', ['get']);
push('/schema/ids/list', '{ids:string[]}', 'SockResponse<{list:Partial<TableSchema>[]}>', ['get'])
push('/schema/delete', '{wsId?:string,id:string}', 'SockResponse<void>', ['del']);
push('/datastore/add', '{schemaId:string,data:Record<string, any>,pos:{id:string,pos:"before"|"after"}}', 'SockResponse<{isCacSort:boolean,data:Record<string,any>}>', ['put']);
push('/datastore/batch/add', '{schemaId:string,list:any[]}', '{ok:boolean,data:{list:any[]},warn:string}', ['put']);
push('/datastore/remove', '{schemaId:string,dataId:string}', '{ok:boolean,warn:string}', ['del']);
push('/datastore/update', '{schemaId:string,dataId:string,data:Record<string, any>}', 'SockResponse<void>', ['patch']);
push('/datastore/query', '{schemaId:string,id:string}', '{ok:boolean,data:{data:Record<string, any>},warn:string}', ['get']);
push('/datastore/query/list', '{schemaId:string,page?:number,size?:number,filter?:Record<string, any>,sorts?:Record<string, 1|-1>}', '{ok:boolean,data:{list:any[],total:number,page:number,size:number},warn:string}', ['get']);
push('/datastore/query/ids', '{schemaId:string,ids:string[]}', '{ok:boolean,data:{list:any[]},warn:string}', ['get']);
push('/datastore/query/all', '{schemaId:string,page?:number,size?:number,filter?:Record<string, any>,sorts?:Record<string, 1|-1>}', '{ok:boolean,data:{list:any[],total:number,page:number,size:number},warn:string}', ['get']);
push('/datastore/group', '{schemaId:string,page?:number,size?:number,filter?:Record<string, any>,sorts?:Record<string, 1|-1>,group:string}', '{ok:boolean,data:{list:any[],total:number,page:number,size:number},warn:string}', ['get']);
push('/datastore/statistics', '{schemaId:string,page?:number,size?:number,filter?:Record<string, any>,having?:Record<string, any>,sorts?:Record<string, 1|-1>,groups:string[],aggregate?: Record<string, any>}', '{ok:boolean,data:{list:any[],total:number,page:number,size:number},warn:string}', ['get']);
push('/datastore/statistics/value', '{schemaId:string,filter?:Record<string, any>,indicator:string}', '{ok:boolean,data:{value:number},warn:string}', ['get']);
push('/datastore/rank', '{schemaId:string,wsId?:string,id:string,pos:{id:string,pos:"before"|"after"}}', 'SockResponse<{isCacSort:boolean,sort:number}>', ['put']);
push('/datastore/row/object/update', '{schemaId: string, rowId: string, fieldName: string,data: Record<string, any>}', 'SockResponse<void>', ['put']);
push('/datastore/remove/ids', '{schemaId: string,ids:string[]}', 'SockResponse<void>', ['del']);
push('/device/sign', '', 'void', ['put']);
push('/device/query', '', 'string', ['shy', 'query', 'await']);

push('/sign', '', 'SockResponse<{user:Record<string,any>,guid:string,token:string}>', ['get'])
push('/sign/out', '', 'SockResponse<void>', ['get'])
push('/paw/sign', '{phone:string,paw:string,inviteCode:string,weixinOpen:Record<string,any>}', 'SockResponse<{user:Record<string,any>,guid:string,token:string}>', ['put'])
push(`/sign/patch`, '{name: string, paw: string}', 'SockResponse<{list:any[]}>', ['patch']);
push('/phone/sign', '{phone:string,code:string,inviteCode:string,weixinOpen:Record<string,any>}', 'SockResponse<{user:Record<string,any>,guid:string,token:string}>', ['put'])
push('/phone/sms/code', '{phone:string}', '{ok:boolean,warn:string,data:{success:boolean,code?:string}}', ['post'])
push('/phone/check/sign', '{phone:string}', '{ok:boolean,warn:string,data:{sign:boolean}}', ['get'])
push('/phone/check/update', '{phone:string,code:string}', 'SockResponse<void>', ['patch'])
push('/email/check/update', '{email:string,code:string}', 'SockResponse<void>', ['patch'])
push('/email/send/code', '{email:string}', 'SockResponse<{code?:string}>', ['post'])
push('/user/set/paw', '{oldPaw?:string,newPaw:string,confirmPaw:string}', 'SockResponse<void>', ['patch'])
push('/user/query', '', 'SockResponse<{user:Record<string,any>}>', ['get']);
push('/user/patch', '{data:Record<string,any>}', 'SockResponse<void>', ['patch'])
push('/user/patch/status', '{status:UserStatus,customStatus?:{overDue: Date, text: string}}', 'SockResponse<void>', ['patch'])
push('/user/basic', '{userid:string}', 'SockResponse<{user:UserBasic}>', ['get'])
push('/users/basic', '{ids:string[]}', 'SockResponse<{list:UserBasic[]}>', ['get']);
push('/user/basic/sync', '{id:string}', 'void', ['air'])
push('/user/upload/file', '{file:File,uploadProgress: (event: ProgressEvent) => void}', 'SockResponse<{file:{url:string}}>', ['post'])
push('/user/wss', '', 'SockResponse<{list:any[]}>', ['get'])
push('/user/channels', '{page?:number,size?:number}', 'SockResponse<{list:any[],total:number,page:number,size:number,rooms:any[]}>', ['get'])
push('/user/channel/delete', '{id:string}', 'SockResponse<void>', ['del'])
push('/user/channel/active', '{id:string}', 'SockResponse<void>', ['patch'])
push('/user/channel/join', '{roomName?:string,userids:string[]}', 'SockResponse<{room:Record<string,any>,channel:Record<string,any>}>', ['put'])
push('/user/channel/create', '{roomId:string}', 'SockResponse<{channel:any,room:any}>', ['get'])
push('/user/write/off', '{sn:number}', 'SockResponse<void>', ['del'])
push('/user/join/ws', '{wsId:string}', 'SockResponse<void>', ['put']);
push('/user/exit/ws', '{wsId:string}', 'SockResponse<void>', ['del']);
push('/user/onlines', '{users:Set<string>}', 'void', ['air']);
push('/user/view/onlines', '{viewId:string,users:Set<string>}', 'void', ['air']);
push('/user/get/onlines', '{wsId?:string}', '{users:Set<string>}', ['query']);
push('/user/get/view/onlines', '{viewId:string}', '{users:Set<string>}', ['query']);
push('/user/word/query', '{word:string}', 'SockResponse<{list:{id:string}[]}>', ['get']);

push('/friend/join', '{userid?:string,sn?:number}', 'SockResponse<{exists?:boolean,send?:boolean,refuse?:boolean,black?:boolean}>', ['put'])
push('/friends', '{page?:number,size?:number}', 'SockResponse<{list:any[],total:number,page:number,size:number}>', ['get'])
push('/friend/delete', '{id:string}', 'SockResponse<void>', ['del'])
push('/friends/pending', '{page?:number,size?:number}', 'SockResponse<{list:any[],total:number,page:number,size:number}>', ['get'])
push('/search/friends', '{name:string,size?:number}', 'SockResponse<{list:UserBasic[],size:number}>', ['get'])
push('/search/friends/pending', '{name:string,size?:number}', 'SockResponse<{list:UserBasic[],size:number}>', ['get'])
push('/search/blacklist', '{name:string,size?:number}', 'SockResponse<{list:UserBasic[],size:number}>', ['get'])

push('/user/blacklist', '{page?:number,size?:number}', 'SockResponse<{list:any[],total:number,page:number,size:number}>', ['get'])
push('/user/blacklist/delete', '{id:string}', 'SockResponse<void>', ['del'])
push('/blacklist/join', '{otherId:string}', 'SockResponse<void>', ['put'])
push('/friend/is', '{friendId:string}', 'SockResponse<{is:boolean}>', ['get'])
push('/friend/agree', '{id:string}', 'SockResponse<{userFriend:Record<string,any>}>', ['put'])
push('/user/chat/list', '{roomId:string,seq?:number,size?:number}', 'SockResponse<{list:any[]}>', ['get'])
push('/user/chat/send', '{roomId:string,content?:string,file?:any,tos:string[],replyId?:string}', 'SockResponse<{id:string,seq:number,createDate:Date}>', ['put'])
push('/user/chat/cancel', '{id:string,roomId:string}', 'SockResponse<void>', ['del']);
push('/user/chat/patch', '{id:string,roomId:string,content?:string,file?:any}', 'SockResponse<void>', ['patch']);
push('/user/chat/emoji', '{id:string,roomId:string,emoji:{emojiId: string, code?: string}}', 'SockResponse<{emoji:{emojiId: string, code?: string,count:number}}>', ['put']);
push('/user/room/unread', '{unrooms: { roomId: string, seq: number }[]}', 'SockResponse<{unreads:{roomId:string,count:number}[]}>', ['get']);
push('/create/qr_pay/order', `{subject: string,body: string,price: number,count: number,amount?: number,kind: string}`, 'SockResponse<{orderId:string,code:string}>', ['put'])
push('/repeat/qr_pay/order', '{orderId:string,platform:string}', 'SockResponse<{orderId:string,code:string}>', ['get'])
push('/user/order/list', '{page?: number, size?: number, word?: string, status?: string,deal?:boolean}', 'SockResponse<{page:number,size:number,list:any[],total:number}>', ['get']);
push('/user/del/order', '{orderId:string}', 'SockResponse<void>', ['del']);
push('/user/wallet', '{}', 'SockResponse<{money:number,meal:string}>', ['get']);


push('/open/weixin/bind', '{weixinOpen:any}', 'SockResponse<void>', ['put'])
push('/open/weixin/unbind', '{id:string}', 'SockResponse<void>', ['del'])
push('/open/list', '', 'SockResponse<{list:any[]}>', ['get'])
push('/open/sign', '{}', 'SockResponse<{user:Record<string,any>,guid:string,token:string}>', ['put'])

push('/amap/key_pair', '', '{key:string,pair:string}', ['shy', 'query']);
push('/ws/basic', '{name?:string,wsId?:string}', 'SockResponse<{workspace:Record<string,any>}>', ['get'])
push('/ws/info', '{name?:string|number,wsId?:string}', 'SockResponse<{workspace:Record<string,any>}>', ['get'])
push('/ws/access/info', '{wsId:string,pageId?:string,sock?:any}', 'SockResponse<{roles:any[],member:Record<string,any>,page:any,onlineUsers:string[]}>', ['get'])
push('/ws/query', '{wsId?:string}', 'SockResponse<{workspace:Record<string,any>}>', ['get'])
push('/ws/latest', '', 'SockResponse<{workspace:Record<string,any>}>', ['get'])
push('/ws/create', '{text:string,templateId?:string}', 'SockResponse<{workspace:Record<string,any>}>', ['put'])
push('/ws/invite/create', '', 'SockResponse<{code:string}>', ['put']);
push('/ws/invite/check', '{invite:string}', 'SockResponse<{workspace:Record<string,any>}>', ['get']);
push('/ws/invite/join', '{wsId:string,sock?:any}', 'SockResponse<void>', ['put']);
push('/ws/patch', '{wsId?:string,sockId?:string,data:Record<string,any>}', 'SockResponse<void>', ['patch']);
push('/ws/upload/file', '{file:File,uploadProgress: (event: ProgressEvent) => void}', 'SockResponse<{ file:{url:string,name:string,size:number} }>', ['post'])
push('/ws/download/url', '{url:string}', 'SockResponse<{ file:{url:string,name:string,size:number} }>', ['post'])
push('/ws/channel/list', '{roomId:string,seq?:number,page?:number,size?:number}', 'SockResponse<{list:any[],unreadCount?:number}>', ['get'])
push('/ws/channel/send', '{ sockId?: string,wsId?: string,roomId: string,content?: string,replyId?: string, file?:any}', 'SockResponse<{id:string,seq:number,createDate:Date}>', ['put'])
push('/ws/channel/cancel', '{roomId: string, id: string, wsId?: string, sockId?: string}', 'SockResponse<void>', ['del']);
push('/ws/channel/patch', `{id: string,sockId?: string,wsId?: string,roomId: string,content?: string,replyId?: string,file?:any}`, 'SockResponse<void>', ['patch'])
push('/ws/channel/emoji', `{elementUrl: string,sockId?: string, wsId?: string, emoji: { emojiId: string, code?: string }}`, `SockResponse<{emoji:{emojiId:string,code?:string,count:number}}>`, ['put']);
push('/ws/random/online/users', '{wsId:string,size?:number}', 'SockResponse<{count:number,users:string[]}>', ['get'])
push('/ws/online/users', '{wsId:string}', 'SockResponse<{users:string[]}>', ['get'])
push('/ws/channel/notify', '{id:string,workspaceId:string,roomId:string}', 'void', ['air']);
push('/ws/channel/patch/notify', '{ workspaceId: string,roomId: string,content: string,file: any,isEdited:boolean}', 'void', ['air']);
push('/ws/channel/deleted/notify', '{ workspaceId: string,id:string,roomId:string}', 'void', ['air']);
push('/ws/channel/emoji/notify', '{workspaceId: string,id: string,roomId: string,emoji:{ emojiId: string, code?: string }}', 'void', ['air']);
push('/ws/channel/abled/send', '{wsId?:string,roomId:string,pageId:string}', 'SockResponse<{abled:boolean}>', ['get']);
push('/ws/view/operate/notify', '{id:string,directive:number,operators:any[],elementUrl:string,workspaceId:string,userid:string}', 'void', ['air']);
push('/ws/page/item/operate/notify', '{id:string,workspaceId:string,roomId:string}', 'void', ['air']);
push('/ws/datagrid/schema/operate/notify', '{id:string,workspaceId:string,roomId:string}', 'void', ['air']);

push('/ws/member/exit', '{wsId:string,sock:any}', 'SockResponse<void>', ['del']);
push('/ws/member/word/query', '{word:string}', 'SockResponse<{page:number,size:number,total:number,list:any[]}>', ['get']);
push('/ws/members', '{page:number,size:number,word?:string,roleId?:string}', 'SockResponse<{page:number,size:number,total:number,list:any[]}>', ['get']);
push('/ws/member/delete', '{userid:string}', 'SockResponse<void>', ['del']);
push('/ws/is/member', '{sock?:any,wsId:string}', 'SockResponse<{exists:boolean}>', ['get']);
push('/ws/roles', '{}', 'SockResponse<{list:any[]}>', ['get']);
push('/ws/role/patch', '{roleId:string,data:Record<string,any>}', 'SockResponse<void>', ['patch']);
push('/ws/role/create', '{data:Record<string,any>}', 'SockResponse<{role:Record<string,any>}>', ['put']);
push('/ws/role/delete', '{roleId:string}', 'SockResponse<void>', ['del']);
push('/ws/role/members', '{roleId:string,page:number,size:number,word?:string}', 'SockResponse<{page:number,size:number,total:number,list:any[]}>', ['get']);
push('/ws/set/domain', '{wsId?:string,domain:string}', 'SockResponse<{exists?:boolean,illegal?:boolean}>', ['patch'])
push('/ws/patch/member/roles', '{wsId?:string,userid:string,roleIds:string[]}', 'SockResponse<void>', ['patch'])
push('/ws/discovery', '{word?:string,page?:number,size?:number,type?:string}', 'SockResponse<{page:number,size:number,total:number,list:any[]}>', ['get']);
push('/ws/view/online/users', '{viewId:string}', 'SockResponse<{ users:string[] }>', ['get']);
push('/ws/current/pages', '{}', 'LinkPageItem[]', ['query']);
push('/ws/search', '{page?:number,size?:number,mime?:string,word:string,wsId?:string,isOnlySearchTitle?:boolean,createDate?:number,editDate?:number}', 'SockResponse<{ list:{id:string,title:string,content:string,score:number}[],total:number }>', ['get'])
push('/ws/comment/list', '{elementUrl: string,wsId?: string, parentId: string, sort: \'default\' | \'date\', page: number,size: number}', 'SockResponse<{page:number,size:number,total:number,list:any[]}>', ['get']);
push('/ws/comment/send', '{elementUrl: string,wsId?: string, parentId: string, rootId: string,content: string}', 'SockResponse<{data:any}>', ['put']);
push('/ws/comment/del', '{id:string}', 'SockResponse<void>', ['del']);
push('/ws/comment/emoji', '{wsId?: string, elementUrl: string}', 'SockResponse<{count:number}>', ['put']);


push('/page/items', '{ids:string[],sock?:any,wsId?:string}', 'SockResponse<{ list:any[] }>', ['get'])
push('/page/item/subs', '{id:string}', 'SockResponse<{ list:any[] }>', ['get'])
push('/page/parent/ids', '{wsId?:string,id:string}', 'SockResponse<{ parentIds:string[],exists:boolean }>', ['get'])
push('/page/parent/subs', '{wsId?:string,parentIds:string[]}', 'SockResponse<{ list:any[] }>', ['get'])
push('/page/item', '{id:string}', 'SockResponse<{ item:Record<string,any> }>', ['get'])
push('/page/item/create', '{wsId?:string,data:Record<string,any>}', 'SockResponse<{ item:Record<string,any> }>', ['put'])
push('/page/word/query', '{word:string}', 'SockResponse<{list:LinkPageItem[],total:number,page:number,size:number}>', ['get']);
push('/guid', '', 'string', ['query']);
//push(`/page/query/permissions`, '{pageId:string}', 'AtomPermission[]', ['query'])

push('/view/snap/query', '{ elementUrl: string}', 'SockResponse<{content:string,operates:any[]}>', ['get'])
push('/view/snap/operator', '{ elementUrl: string, operate: Partial<UserAction> }', 'Promise<{seq: number,id: string;}>', ['act'])
push('/view/snap/store', '{  elementUrl: string, seq: number, content: any }', 'Promise<void>', ['act'])


push('/view/snap/list', '{wsId?: string, elementUrl: string, page: number, size: number}', 'SockResponse<{list:any[],total:number,size:number,page:number}>', ['get'])
push('/view/snap/content', '{wsId?:string,id:string}', 'SockResponse<{id:string,content:string}>', ['get'])
push('/view/snap/patch', '{id:string,data:Record<string,any>}', 'SockResponse<void>', ['patch']);
push('/view/snap/del', '{id:string}', 'SockResponse<void>', ['del']);
push('/view/snap/rollup', '{id:string,elementUrl:string,wsId?:string,bakeTitle?:string,pageTitle?:string}', 'SockResponse<{seq:number,id:string}>', ['post']);

push(`/block/ref/pages`, '{wsId?:string,pageId:string}', 'SockResponse<{list:any[],total:number,size:number,page:number}>', ['get'])
push(`/block/ref/add`, '{wsId?:string,pageId:string,data:{blockId: string, rowBlockId: string, text: string, refPageId: string}}', 'SockResponse<void>', ['put'])
push(`/block/ref/sync`, '{wsId?:string,data:{deleteBlockIds: string[], updates: { rowBlockId: string, text: string }[]}}', 'SockResponse<void>', ['patch'])


push(`/interactive/emoji`, '{elementUrl:string,fieldName:string}', 'SockResponse<{count:number,exists:boolean,otherCount?:number,otherExists:boolean}>', ['patch'])
push(`/user/interactives`, '{wsId?:string,schemaId:string,ids:string[],es:string[]}', 'SockResponse<{list:Record<string,string[]>}>', ['get'])

push(`/bookmark/url`, '{url:string}', 'SockResponse<{title:string,description:string,image:ResourceArguments,icon:ResourceArguments}>', ['put']);



build(path.join(__dirname, "../../rich/net/declare.ts"), 'rich');
//build(path.join(__dirname, "../net/declare.ts"), 'shy');