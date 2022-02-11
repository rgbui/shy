import { Dexie } from "dexie";
export var db = new Dexie("shy");
db.version(4).stores({
    view_snap: 'id,seq,file,content,creater,createDate',
    log: 'id,creater,createDate,level,msg,remark,isReport'
});

export interface view_snap {
    id: string;
    seq: number,
    file: Blob,
    content
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


