import { Dexie } from "dexie";
export var db = new Dexie("shy");
db.version(3).stores({
    page_snapshoot: 'id,creater,createDate,page_url,sequence,begin_sequence,end_sequence,file,content',
    page_current_sequence: 'id,creater,createDate,page_url,page_snapshoot_id,operator_sequence,page_sequence',
    log: 'id,creater,createDate,level,msg,remark,isReport'
});
export interface page_snapshoot {
    id: string;
    creater: string;
    createDate: number;
    page_url: string;
    sequence: number;
    begin_sequence: number;
    end_sequence: number;
    file?: string;
    content?: Blob
}
export interface page_current_sequence {
    id: string;
    creater: string;
    createDate: number;
    page_url: string;
    page_snapshoot_id: string;
    operator_sequence: number;
    page_sequence: number;
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


