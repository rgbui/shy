import { util } from 'rich/util/util';
import { config } from '../../src/common/config';
import { log, logStore } from '../../src/common/log';
import { CacheKey, sCache } from '../cache';
import { masterSock, Sock } from '../sock';
import { GenreConsistency } from '../sock/genre';
import { SockResponse } from '../sock/type';
import { HttpMethod, SubscribeType } from './http';
import { loadPrimus } from './load';
export class Tim {
    public isConncted: boolean = false;
    private primus;
    id: string;
    url: string;
    async load(url: string) {
        this.url = url;
        var self = this;
        this.id = config.guid();
        var Primus = await loadPrimus();
        var primus = new Primus(url, {});
        this.primus = primus;
        primus.on('data', function message(data) {
            try {
                var json = JSON.parse(data);
                if (json.rid) {
                    var se = self.sendEvents.find(g => g.rid == json.rid)
                    if (se) {
                        se.callback(json);
                    }
                }
                else {
                    var d = data.data;
                    var ses = self.events.findAll(g => g.url == d.url);
                    for (let i = 0; i < ses.length; i++) {
                        try {
                            ses[i].fn(d.data);
                        }
                        catch (ex) {

                        }
                    }
                }
            }
            catch (ex) {
                log.error(ex);
            }
        });
        primus.on('reconnect', function (opts) {
            console.log('It took %d ms to reconnect', opts.duration);
        });
        primus.on('reconnect timeout', function (err, opts) {
            console.log('Timeout expired: %s', err.message);
        });
        primus.on('reconnect failed', function (err, opts) {
            console.log('The reconnection failed: %s', err.message);
        });
        primus.on('end', function () {
            self.isConncted = false;
            console.log('Connection closed');
        });
        return new Promise((resolve, reject) => {
            primus.on('open', function open() {
                console.log('Connection is alive and kicking');
                self.isConncted = true;
                resolve(true);
                // var device = await sCache.get(CacheKey.device);
                // var token = await sCache.get(CacheKey.token);
                // var lang = await sCache.get(CacheKey.lang);
                // var r = await self.post('/user/online', { token, device, lang, sock: self.id });
                // console.log('user online r:', r.data);
            });
            primus.on('error', function error(err) {
                self.isConncted = false;
                log.error(err);
                reject(err);
                console.error('Something horrible has happened', err.stack);
            });
            primus.open();
        })
    }
    close() {
        if (this.primus) {
            this.primus.destroy()
        }
    }
    async getId() {
        return util.guid();
    }
    private sendEvents: { rid: string, isTimeOut?: boolean, timeout: number, callback: (data) => void }[] = [];
    /**
     * 同步发送，即发送一个消息，然后返回一个值
     * @param method 
     * @param url 
     * @param data 
     */
    async syncSend(method: HttpMethod, url: string, data?: any) {
        var id = await this.getId();
        url = Sock.resolve('/' + API_VERSION, url);
        return new Promise((resolve, reject) => {
            this.sendEvents.push({
                rid: id,
                callback: (data) => {
                    var se = this.sendEvents.find(g => g.rid == id);
                    if (se && se.isTimeOut) return;
                    if (se && se.timeout) {
                        clearTimeout(se.timeout);
                        delete se.timeout;
                    }
                    this.sendEvents.remove(g => g.rid == id);
                    resolve(data);
                },
                timeout: setTimeout(() => {
                    var se = this.sendEvents.find(g => g.rid == id);
                    if (se && se.timeout) {
                        clearTimeout(se.timeout);
                        delete se.timeout;
                        se.isTimeOut = true;
                    }
                    this.sendEvents.remove(g => g.rid == id);
                    reject(new Error('response time out'))
                }, 2e3) as any
            });
            if (data) GenreConsistency.transform(data);
            this.primus.write({ rid: id, method, url, data });
        })
    }
    /**
     * 这里只管发送，不管是否有回应
     * @param method 
     * @param url 
     * @param data 
     */
    send(method: HttpMethod, url: string, data: Record<string, any>) {
        url = Sock.resolve('/' + API_VERSION, url);
        this.primus.write({ method, url, data });
    }
    subscribe(type: SubscribeType, id: string) {
        this.send(HttpMethod.post, '/user/subscribe', { type, id });
    }
    unsubscribe(type: SubscribeType, id: string) {
        this.send(HttpMethod.post, '/user/unsubscribe', { type, id });
    }
    private handleResponse<T, U = any>(data) {
        var response: SockResponse<T, U> = {
            code: data.status,
            data: data.data,
            ok: data.status >= 200 && data.status < 300 ? true : false
        };
        if (response.data && typeof response.data == 'object') {
            GenreConsistency.parse(response.data);
        }
        if (response.ok == false) {
            response.warn = data.data;
        }
        return response;
    }
    async post<T = any, U = any>(url: string, data?: Record<string, any>) {
        var url = this.urlJoint(url, data);
        var r = await this.syncSend(HttpMethod.post, url, data);
        return this.handleResponse<T, U>(r);
    }
    async get<T = any, U = any>(url: string, querys?: Record<string, any>) {
        var url = this.urlJoint(url, querys);
        GenreConsistency.transform(querys);
        var resolveUrl = url;
        if (querys && Object.keys(querys).length > 0) {
            var ps: string[] = [];
            for (let q in querys) {
                if (typeof querys[q] != 'undefined') {
                    var value = querys[q];
                    if (typeof value == 'object') value = JSON.stringify(value);
                    ps.push(q + '=' + encodeURIComponent(value));
                }
            }
            resolveUrl = resolveUrl + (resolveUrl.indexOf('?') == -1 ? "?" : "&") + ps.join("&");
        }
        var r = await this.syncSend(HttpMethod.get, url);
        return this.handleResponse<T, U>(r);
    }
    async delete<T = any, U = any>(url: string, data?: Record<string, any>) {
        var url = this.urlJoint(url, data);
        var r = await this.syncSend(HttpMethod.delete, url);
        return this.handleResponse<T, U>(r);
    }
    async put<T = any, U = any>(url: string, data: Record<string, any>) {
        var url = this.urlJoint(url, data);
        var r = await this.syncSend(HttpMethod.put, url, data);
        return this.handleResponse<T, U>(r);
    }
    resolve(...urls: string[]) {
        var url: string = urls[0];
        for (let i = 1; i < urls.length; i++) {
            var current = urls[i];
            if (url.endsWith('/') && current.startsWith('/')) {
                url = url + current.slice(1);
            }
            else if (!url.endsWith('/') && !current.startsWith('/')) {
                url = url + '/' + current;
            }
            else {
                url += current;
            }
        }
        return url;
    }
    private urlJoint(url: string, data: Record<string, any>) {
        if (!data) return url;
        url = url.replace(/(:[\w\-]+)/g, (_, $) => {
            var key = $.substring(1);
            if (typeof data[key] != 'undefined') {
                var value = data[key];
                delete data[key];
                if (typeof value == 'object') return JSON.stringify(value)
                return value;
            }
            else return $
        });
        return url;
    }
    private events: { url: string, fn: (...args: any[]) => void }[] = [];
    on(url: string, fn: (...args: any[]) => void) {
        this.events.push({ url, fn });
    }
    off(url: string, fn?: (...args: any[]) => void) {
        if (typeof fn == 'function') this.events.removeAll(e => e.url == url && e.fn == fn);
        else this.events.removeAll(e => e.url == url);
    }
}
export var userTim = new Tim();
