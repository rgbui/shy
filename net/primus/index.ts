import { util } from 'rich/util/util';
import { log } from '../../src/common/log';
import { CacheKey, sCache } from '../cache';
import { userSock } from '../sock';
import { GenreConsistency } from '../sock/genre';
import { SockResponse } from '../sock/type';
import { HttpMethod } from './http';
export class SockSync {
    private willloading: boolean = false;
    private primus;
    async load() {
        var self = this;
        if (this.willloading == true) return;
        this.willloading = true;
        var r = await import('../../src/assert/js/primus.js');
        var url = await userSock.baseUrl();
        var primus = new (r.default)(url, {});
        this.primus = primus;
        primus.open();
        primus.on('data', function message(data) {
            try {
                var json = JSON.parse(data);
                if (json.rid) {
                    var se = self.sendEvents.find(g => g.rid == json.rid)
                    if (se) {
                        se.callback(json);
                    }
                }
            }
            catch (ex) {
                log.error(ex);
            }
        });
        primus.on('open', async function open() {
            console.log('Connection is alive and kicking');
            var device = await sCache.get(CacheKey.device);
            var token = await sCache.get(CacheKey.token);
            var lang = await sCache.get(CacheKey.lang);
            var r = await self.post('/user/online', { token, device, lang });
            console.log('user online r:', r.data);
        });
        primus.on('error', function error(err) {
            console.error('Something horrible has happened', err.stack);
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
            console.log('Connection closed');
        });
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
}
export var sockSync = new SockSync();
