


export class MergeSock {
    private wait: number = 5;
    private maxCount: number = 10;
    private batchHandle: (datas: { args: any, callback?: (err, data) => void }[]) => Promise<any[]>;
    constructor(handle: MergeSock['batchHandle'], wait?: number, maxCount?: number) {
        this.batchHandle = handle;
        if (typeof wait == 'undefined') this.wait = wait;
        if (typeof maxCount == 'undefined') this.maxCount = maxCount;
    }
    private events: { args: any, callback?: (err, data) => void }[] = [];
    private time;
    async inject<T = any>(ev: { args: any }) {
        return new Promise((resolve: (data: T) => void, reject) => {
            var es = {
                args: ev.args,
                callback(err, data) {
                    if (err) reject(err)
                    else resolve(data);
                }
            };
            this.events.push(es);
            if (this.events.length > this.maxCount) {
                if (this.time) {
                    clearTimeout(this.time);
                    this.time = null;
                }
                this.excute();
            }
            else {
                if (!this.time) {
                    this.time = setTimeout(() => {
                        this.excute();
                    }, this.wait);
                }
            }
        })
    }
    private excute() {
        if (this.time) {
            clearTimeout(this.time);
            this.time = null;
        }
        var events = this.events;
        this.events = [];
        if (this.batchHandle) {
            this.batchHandle(events).then(r => {
                if (events.length == r.length) {
                    for (let i = 0; i < events.length; i++) {
                        events[i].callback(null, r[i]);
                    }
                }
                else {
                    events.each(ev => ev.callback(new Error('batch return is not equal'), undefined))
                }
            }).catch(err => {
                events.each(ev => ev.callback(err, undefined))
            })
        }
    }
}