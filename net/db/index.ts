import { Dexie } from "dexie";
export var db = new Dexie("shy");
db.version(5).stores({
    view_snap: 'id,seq,content,creater,createDate',
    log: 'id,creater,createDate,level,msg,remark,isReport'
});

export interface view_snap {
    id: string;
    seq: number,
    content:string,
    creater:string,
    createDate:Date
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


