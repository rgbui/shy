import { Dexie } from "dexie";
export var db = new Dexie("shy");
db.version(1).stores({
    page_snapshoot: 'id,creater,createDate,item_url,sequence,preSequence,beginSequence,endSequence,file,content',
    page_local_sequence: 'id,creater,createDate,item_url,page_snapshoot_id,userActionSequence,pageSnapshootSequence',
    log: 'id,creater,createDate,level,msg,remark,isReport'
});
export interface page_snapshoot {
    id: string;
    creater: string;
    createDate: number;
    item_url: string;
    preSequence: number;
    sequence: number;
    beginSequence: number;
    endSequence: number;
    file?: string;
    content?: Blob
}
export interface page_local_sequence {
    id: string;
    creater: string;
    createDate: number;
    item_url: string;
    page_snapshoot_id: string;
    userActionSequence: number;
    pageSnapshootSequence: number;
}
export interface db_log {
    id: string;
    creater: string;
    createDate: number;
    level: string,
    msg: string,
    remark: string,
    isReport: boolean
}


