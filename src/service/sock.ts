import axios from "axios";

enum SockType {
    master,
    user
}
class Sock {
    private type: SockType;
    constructor(type: SockType) {
        this.type = type;
    }
    private masterUrl: string;
    private userPidMap: Map<string, string> = new Map();
    private async getBaseUrl() {
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
    async post<T = any>(url: string, data: Record<string, any>): Promise<T> {
        var baseUrl = await this.getBaseUrl();
        var r = await axios.post(this.resolve(baseUrl, url), data);
        return r.data;
    }
    async get<T = any>(url: string): Promise<T> {
        var baseUrl = await this.getBaseUrl();
        var r = await axios.get(this.resolve(baseUrl, url));
        return r.data;
    }
    async delete(url: string) {
        var baseUrl = await this.getBaseUrl();
        var r = await axios.delete(this.resolve(baseUrl, url));
        return r.data;
    }
    async put<T = any>(url: string, data: Record<string, any>): Promise<T> {
        var baseUrl = await this.getBaseUrl();
        var r = await axios.put(this.resolve(baseUrl, url), data);
        return r.data;
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
}

export type SockResponseType = {
    success: boolean,
    error: string
}
export var masterSock = new Sock(SockType.master);
export var userSock = new Sock(SockType.user);