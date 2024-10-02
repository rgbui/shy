import axios, { AxiosInstance, AxiosResponse } from "axios";
import { CacheKey, sCache } from "../cache";
import { SockResponse, SockType } from "./type";
import { FileMd5 } from "../../src/util/file";
import { GenreConsistency } from "rich/net/genre";
import { surface } from "../../src/surface/app/store";

import lodash from 'lodash';


export class Sock {
    private wsId: string;
    private remoteUrl: string;
    private type: SockType;
    private headers?: Record<string, any>;
    constructor(type: SockType, remoteUrl?: string, header?: Record<string, any>,) {
        this.type = type;
        this.remoteUrl = remoteUrl;
        if (window.shyConfig.isDev) {
            if (this.remoteUrl?.startsWith('http://localhost')) {
                var su = STATIC_URL.slice(0, STATIC_URL.lastIndexOf(':'));
                //console.log('su', su);
                this.remoteUrl = this.remoteUrl.replace('http://localhost', su);
            }
            if (this.remoteUrl?.startsWith('http://127.0.0.1')) {
                var su = STATIC_URL.slice(0, STATIC_URL.lastIndexOf(':'));
                //console.log('su', su);
                this.remoteUrl = this.remoteUrl.replace('http://127.0.0.1', su);
            }
        }
        this.headers = header;
    }
    async baseUrl() {
        if (this.remoteUrl) return this.remoteUrl;
        switch (this.type) {
            case SockType.master:
                var urls: string[] = API_MASTER_URLS;
                if (typeof urls == 'string') urls = JSON.parse(urls);
                return urls.randomOf();
            case SockType.api:
                var urls: string[] = API_URLS;
                if (typeof urls == 'string') urls = JSON.parse(urls);
                return urls.randomOf();
            case SockType.file:
                var urls: string[] = FILE_URLS;
                if (typeof urls == 'string') urls = JSON.parse(urls);
                return urls.randomOf();
        }
    }
    setHeaders(headers: Record<string, any>) {
        if (headers) {
            this.headers = Object.assign(this.headers, headers);
        }
    }
    private async config() {
        var device = await sCache.get(CacheKey.device);
        var token = await sCache.get(CacheKey.token);
        var lang = await sCache.get(CacheKey.lang);
        var headers: Record<string, any> = {};
        headers['shy-device'] = device || 'anonymous';
        if (token) headers['shy-token'] = token;
        if (lang) headers['shy-lang'] = lang;
        if (this.type == SockType.master || this.type == SockType.api || this.type == SockType.file) {
            if (surface.user?.tim) headers['shy-sockId'] = surface.user?.tim.id;
            if (surface.workspace) headers['shy-wsId'] = surface.workspace.id;
        }
        if (this.headers) {
            headers = { ...headers, ...this.headers };
        }
        return {
            headers: headers
        }
    }
    private _remote: AxiosInstance
    private get remote() {
        if (this._remote) return this._remote;
        else {
            this._remote = axios.create();
            if (window.shyConfig.isDev) this._remote.defaults.timeout = 1000 * 60 * 10;
            else if (window.shyConfig.isBeta || window.shyConfig.isPro) {
                // if (this.type != SockType.file)
                this._remote.defaults.timeout = 1000 * 60 * 20;
            }
            if (this.type == SockType.file) this._remote.defaults.timeout = 1000 * 60 * 60;
            this._remote.defaults.validateStatus = function (status) {
                return status < 500
            };
            return this._remote;
        }
    }
    private handleResponse<T, U = any>(data: AxiosResponse<any>) {
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
        if (data) data = lodash.cloneDeep(data);
        var baseUrl = await this.baseUrl();
        url = Sock.urlJoint(url, data);
        GenreConsistency.transform(data);
        var r = await this.remote.post(Sock.resolve(baseUrl, API_VERSION, url), data, await this.config());
        return this.handleResponse<T, U>(r);
    }
    async get<T = any, U = any>(url: string, querys?: Record<string, any>) {
        if (querys) querys = lodash.cloneDeep(querys);
        var baseUrl = await this.baseUrl();
        url = Sock.urlJoint(url, querys);
        GenreConsistency.transform(querys);
        var resolveUrl = Sock.resolve(baseUrl, API_VERSION, url);
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
        var r = await this.remote.get(resolveUrl, await this.config());
        return this.handleResponse<T, U>(r);
    }
    async delete<T = any, U = any>(url: string, querys?: Record<string, any>) {
        if (querys) querys = lodash.cloneDeep(querys);
        var baseUrl = await this.baseUrl();
        url = Sock.urlJoint(url, querys);
        GenreConsistency.transform(querys);
        var resolveUrl = Sock.resolve(baseUrl, API_VERSION, url);
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
        var r = await this.remote.delete(resolveUrl, await this.config());
        return this.handleResponse<T, U>(r);
    }
    async put<T = any, U = any>(url: string, data: Record<string, any>) {
        if (data) data = lodash.cloneDeep(data);
        var baseUrl = await this.baseUrl();
        url = Sock.urlJoint(url, data);
        GenreConsistency.transform(data);
        var r = await this.remote.put(Sock.resolve(baseUrl, API_VERSION, url), data, await this.config());
        return this.handleResponse<T, U>(r);
    }
    async patch<T = any, U = any>(url: string, data: Record<string, any>) {
        if (data) { data = lodash.cloneDeep(data); }
        var baseUrl = await this.baseUrl();
        url = Sock.urlJoint(url, data);
        GenreConsistency.transform(data);
        var r = await this.remote.patch(Sock.resolve(baseUrl, API_VERSION, url), data, await this.config());
        return this.handleResponse<T, U>(r);
    }
    private static urlJoint(url: string, data: Record<string, any>) {
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
    /**
     * 上传文件对象
     * @param file 
     * @param options 
     * @returns 
     */
    async upload<T = any, U = any>(file: Blob | File, options?: {
        url?: string,
        data?: Record<string, any>,
        uploadProgress?: (event: ProgressEvent) => void
    }) {
        if (options.data) { options.data = lodash.cloneDeep(options.data); GenreConsistency.transform(options.data); }

        var baseUrl = await this.baseUrl();
        var url = Sock.resolve(baseUrl, API_VERSION, options.url || '/file/upload');
        var configs = await this.config();
        configs.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        if (options?.uploadProgress) (configs as any).onUploadProgress = options.uploadProgress;
        var forms = new FormData();
        forms.append('file', file);
        if (options.data) for (let n in options.data) {
            forms.append(n, options.data[n]);
        }
        else {
            if (!(file as File).md5) {
                (file as File).md5 = await FileMd5((file as File));
            }
            forms.append('md5', (file as File).md5);
        }
        var r = await this.remote.put(url, forms, configs);
        return this.handleResponse<T, U>(r);
    }
    static resolve(...urls: string[]) {
        var url: string = urls[0];
        for (let i = 1; i < urls.length; i++) {
            var current = urls[i];
            if (current.startsWith('http')) {
                url = current;
                continue;
            }
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
    async fetchStream(options: {
        url: string,
        data?: Record<string, any>,
        method: string
    },
        callback: (chunk: any, done?: boolean, controller?: AbortController,abort?:boolean) => void) {
        if (options.data) {
            options.data = lodash.cloneDeep(options.data)
            GenreConsistency.transform(options.data);
        }
        var resolveUrl = await this.getUrlData(options.url, options.data || {}, options?.method?.toLowerCase() == 'get');
        var headers = await this.config() as any;
        headers = {
            "Content-Type": "application/json",
            ...headers.headers
        }
        let controller = new AbortController();
      
        const res = await fetch(resolveUrl, {
            signal: controller.signal,
            method: (options.method || "POST").toUpperCase(),
            body: options.data ? JSON.stringify(options.data) : undefined,
            mode: 'cors',
            headers: headers
        })
        if (callback) callback(undefined, undefined, controller)
        // Create a reader for the response body
        const reader = res.body.getReader();
        // Create a decoder for UTF-8 encoded text
        const decoder = new TextDecoder("utf-8");
        const readChunk = async () => {
            try {
                var rg = await reader.read();
                if (!rg.done) {
                    const dataString = decoder.decode(rg.value);
                    if (typeof callback == 'function') callback(dataString)
                    readChunk();
                }
                else {
                    callback(undefined, true);
                }
            }
            catch (ex) {
                callback(undefined, true, undefined, true);
            }
        }
        await readChunk()
    }
    async getUrlData(url: string, querys: Record<string, any>, isGet = false) {
        if (querys) querys = lodash.cloneDeep(querys);
        var baseUrl = await this.baseUrl();
        url = Sock.urlJoint(url, querys);
        GenreConsistency.transform(querys);
        var resolveUrl = Sock.resolve(baseUrl, API_VERSION, url);
        if (isGet) {
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
        }
        return resolveUrl;
    }
    static createSock(url: string, type: SockType = SockType.none, headers?: Record<string, any>) {
        return new Sock(type, url, headers);
    }

}

/**
 * 主服务（主要用来服务于整个系统的的业务）
 */
export var masterSock = new Sock(SockType.master);
/**
 * 主要是用来上传文件
 * 暂时弃用
 */
// export var fileSock = new Sock(SockType.file);
/**
 * 调用一些公共的api服务
 * 暂时弃用
 */
// export var apiSock = new Sock(SockType.api);