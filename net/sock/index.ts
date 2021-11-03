import axios, { AxiosInstance, AxiosResponse } from "axios";
import { CacheKey, sCache } from "../cache";
import { SockResponse, SockType } from "./type";
import { config } from "../../src/common/config";
import { FileMd5 } from "../../src/util/file";
import { GenreConsistency } from "./genre";

class Sock {
    private type: SockType;
    constructor(type: SockType) {
        this.type = type;
    }
    private remoteUrl: string;
    async baseUrl() {
        switch (this.type) {
            case SockType.master:
                var urls: string[] = API_MASTER_URLS as any;
                if (typeof urls == 'string') urls = JSON.parse(urls);
                return urls.randomOf();
                break;
            case SockType.user:
                if (this.remoteUrl) return this.remoteUrl;
                var ms = await masterSock.get<{ url: string }, string>('/pid/tim');
                if (ms.ok) {
                    this.remoteUrl = ms.data.url;
                    return this.remoteUrl;
                }
                else window.Toast.error('没有找到可用的tim连接')
                break;
            case SockType.api:
                if (this.remoteUrl) return this.remoteUrl;
                var ms = await masterSock.get<{ url: string }, string>('/pid/server/api');
                if (ms.ok) {
                    this.remoteUrl = ms.data.url;
                    return this.remoteUrl;
                }
                else window.Toast.error('没有找到可用的api连接')
                break;
            case SockType.file:
                if (this.remoteUrl) return this.remoteUrl;
                var ms = await masterSock.get<{ url: string }, string>('/pid/server/file');
                if (ms.ok) {
                    this.remoteUrl = ms.data.url;
                    return this.remoteUrl;
                }
                else window.Toast.error('没有找到可用的file连接')
                break;
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
        return {
            headers: headers
        }
    }
    private _remote: AxiosInstance
    private get remote() {
        if (this._remote) return this._remote;
        else {
            this._remote = axios.create();
            if (config.isDev) this._remote.defaults.timeout = 1000;
            else if (config.isBeta || config.isPro) {
                if (this.type != SockType.file)
                    this._remote.defaults.timeout = 1000;
            }
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
        var baseUrl = await this.baseUrl();
        url = this.urlJoint(url, data);
        GenreConsistency.transform(data);
        var r = await this.remote.post(this.resolve(baseUrl, API_VERSION, url), data, await this.config());
        return this.handleResponse<T, U>(r);
    }
    async get<T = any, U = any>(url: string, querys?: Record<string, any>) {
        var baseUrl = await this.baseUrl();
        url = this.urlJoint(url, querys);
        GenreConsistency.transform(querys);
        var resolveUrl = this.resolve(baseUrl, API_VERSION, url);
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
    async delete<T = any, U = any>(url: string, data?: Record<string, any>) {
        var baseUrl = await this.baseUrl();
        url = this.urlJoint(url, data);
        var r = await this.remote.delete(this.resolve(baseUrl, API_VERSION, url), await this.config());
        return this.handleResponse<T, U>(r);
    }
    async put<T = any, U = any>(url: string, data: Record<string, any>) {
        var baseUrl = await this.baseUrl();
        url = this.urlJoint(url, data);
        GenreConsistency.transform(data);
        var r = await this.remote.put(this.resolve(baseUrl, API_VERSION, url), data, await this.config());
        return this.handleResponse<T, U>(r);
    }
    resolve(...urls: string[]) {
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
    /**
     * 上传文件对象
     * @param file 
     * @param options 
     * @returns 
     */
    async upload<T = any, U = any>(file: File, options?: {
        uploadProgress?: (event: ProgressEvent) => void
    }) {
        var baseUrl = await this.baseUrl();
        var url = this.resolve(baseUrl, API_VERSION, '/storage/file');
        var configs = await this.config();
        configs.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        if (options?.uploadProgress) (configs as any).onUploadProgress = options.uploadProgress;
        var forms = new FormData()
        forms.append('file', file)
        if (!file.md5) {
            file.md5 = await FileMd5(file);
        }
        forms.append('md5', file.md5);
        var r = await this.remote.post(url, forms, configs);
        return this.handleResponse<T, U>(r);
    }
}

/**
 * 主服务（主要用来服务于整个系统的的业务）
 */
export var masterSock = new Sock(SockType.master);
/**
 * 用户协作
 */
export var userSock = new Sock(SockType.user);
/**
 * 主要是用来上传文件
 */
export var fileSock = new Sock(SockType.file);
/**
 * 调用一些公共的api服务
 */
export var apiSock = new Sock(SockType.api);