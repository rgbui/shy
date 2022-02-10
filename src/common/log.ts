import { util } from "rich/util/util";
import { db } from "../../net/db";
import { surface } from "../surface";


export async function logStore(type: 'info' | 'error' | 'warn', message: string | Error, remark?: string) {
    (db as any).log.add({
        id: util.guid(),
        creater: surface?.user?.id,
        createDate: Date.now(),
        level: type,
        msg: typeof message == 'string' ? message : message.toString(),
        remark: remark,
        isReport: false
    });
}


export var log = {
    info(message: string | Error, remark?: string) {
        logStore('info', message, remark);
    },
    error(error: string | Error, remark?: string) {
        logStore('error', error, remark);
    },
    warn(error: string | Error, remark?: string) {
        logStore('warn', error, remark);
    }
}

window.onerror = function (err) {
    if (typeof err == 'string')
        log.error(err);
    else {
        log.error(err as any);
    }
}