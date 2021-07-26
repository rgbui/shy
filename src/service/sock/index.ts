import axios, { AxiosInstance, AxiosResponse } from "axios";
import { fingerFlag } from "../../util/finger";
import { CacheKey, sCache } from "../cache";
import { SockType } from "./type";
import { StatusCode } from "./status.code";
import { config } from "../../common/config";
import { FileMd5 } from "../../util/file";

class Sock {
    private type: SockType;
    constructor(type: SockType) {
        this.type = type;
    }
    private masterUrl: string;
    private userPidMap: Map<string, string> = new Map();
    private async getBaseUrl() {
        return 'http://localhost:8888/';
        switch (this.type) {
            case SockType.master:
                if (typeof this.masterUrl == 'undefined') {
                    this.masterUrl = 'http://sy.viewparse.com';
                }
                break;
            case SockType.user:
                var userid = await this.getUserId();
                if (!this.userPidMap.has(userid)) {
                    /**
                     * 查询当前用户分配在那个子进程上面
                     */
                    var data = await axios.get(this.masterUrl + "/assign/" + userid);
                    if (data && data.data) {
                        if (data.data.success == true) {
                            var pidUrl = data.data.pid.url;
                            this.userPidMap.set(userid, pidUrl);
                        }
                    }
                    return this.userPidMap.get(userid);
                }
                else return this.userPidMap.get(userid);
                break;
        }
    }
    /**
     * 获取当前登录的用户userid
     */
    private async getUserId() {
        return '';
    }
    private async config() {
        var id = await fingerFlag();
        var token = await sCache.get(CacheKey.token);
        var headers: Record<string, any> = {};
        if (id) headers['shy-client'] = id;
        if (token) headers['shy-token'] = token;
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
        if (response.ok == false) {
            response.warn = data.data;
        }
        return response;
    }
    async post<T = any, U = any>(url: string, data?: Record<string, any>) {
        var baseUrl = await this.getBaseUrl();
        url = this.urlJoint(baseUrl, data);
        var r = await this.remote.post(this.resolve(baseUrl, url), data, await this.config());
        return this.handleResponse<T, U>(r);
    }
    async get<T = any, U = any>(url: string, querys?: Record<string, any>) {
        var baseUrl = await this.getBaseUrl();
        url = this.urlJoint(url, querys);
        var resolveUrl = this.resolve(baseUrl, url);
        if (querys) {
            var ps: string[] = [];
            for (let q in querys) {
                if (typeof querys[q] != 'undefined')
                    ps.push(q + '=' + encodeURIComponent(querys[q]))
            }
            resolveUrl = resolveUrl + (resolveUrl.indexOf('?') == -1 ? "?" : "&") + ps.join("&");
        }
        var r = await this.remote.get(resolveUrl, await this.config());
        return this.handleResponse<T, U>(r);
    }
    async delete<T = any, U = any>(url: string, data?: Record<string, any>) {
        var baseUrl = await this.getBaseUrl();
        url = this.urlJoint(baseUrl, data);
        var r = await this.remote.delete(this.resolve(baseUrl, url), await this.config());
        return this.handleResponse<T, U>(r);
    }
    async put<T = any, U = any>(url: string, data: Record<string, any>) {
        var baseUrl = await this.getBaseUrl();
        url = this.urlJoint(baseUrl, data);
        var r = await this.remote.put(this.resolve(baseUrl, url), data, await this.config());
        return this.handleResponse<T, U>(r);
    }
    private resolve(...urls: string[]) {
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
        var baseUrl = await this.getBaseUrl();
        var url = this.resolve(baseUrl, '/storage/file');
        var configs = await this.config();
        configs.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        if (options?.uploadProgress) (configs as any).onUploadProgress = options.uploadProgress;
        var forms = new FormData()
        forms.append('file', file)
        if (!(file as any).md5) {
            (file as any).md5 = await FileMd5(file);
        }
        forms.append('md5', (file as any).md5);
        var r = await this.remote.post(url, forms, configs);
        return this.handleResponse<T, U>(r);
    }
}
/**
 * 泛型T表示正常的返回数据
 * 泛型U表示异常返回的数据
 */
export type SockResponse<T, U = any> = {
    /**
     * 返回状态码
     */
    code?: StatusCode,
    /**
     * 表示当前的是否处理正常
     * 通常200~300表示正常处理
     * 大于300小于500表示处理不正常，
     * 返回值是用来提醒处理异常原因的
     */
    ok?: boolean,
    data?: T,
    warn?: U
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