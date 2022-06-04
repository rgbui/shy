
import lodash from "lodash";
import { config } from "../../src/common/config";
import { sCache, CacheKey } from "../cache";
import { masterSock } from "../sock";
import { HttpMethod } from "./http";
import { Tim } from "./tim";

class TimService {
    tim: Tim;
    get sockId() {
        return this.tim.id;
    }
    async open() {
        var url = await sCache.get(CacheKey.timUrl);
        if (!url) {
            var ms = await masterSock.get<{ url: string }, string>('/pid/provider/tim');
            if (ms.ok) {
                url = ms.data.url;
                await sCache.set(CacheKey.timUrl, url);
            }
        }
        var self = this;
        this.tim = new Tim();
        await this.tim.load(url);
        var data = await this.getHeads();
        data.sockId = this.tim.id;
        await this.tim.syncSend(HttpMethod.post, '/user/online', data);
        this.tim.reconnected = async function () {
            data = await self.getHeads();
            data.sockId = self.tim.id;
            if (self.workspaceId && !self.isSync) data.workspaceId = self.workspaceId;
            if (self.workspaceId && self.isSync) data.syncWorkspaceId = self.workspaceId;
            self.tim.syncSend(HttpMethod.post, '/user/reconnected', data);
        }
    }
    private workspaceId: string;
    private viewId: string;
    private isSync: boolean = false;
    async enterWorkspaceView(workspaceId: string, isSync: boolean, viewId: string) {
        this.isSync = isSync;
        this.workspaceId = workspaceId;
        this.viewId = viewId;
        if (this.time) {
            clearTimeout(this.time);
            this.time = undefined;
        }
        this.time = setTimeout(async () => {
            if (this.tim) await this.tim.syncSend(
                HttpMethod.post,
                '/workspace/enter',
                {
                    workspaceId: this.isSync ? undefined : this.workspaceId,
                    syncWorkspaceId: this.isSync ? this.workspaceId : undefined,
                    viewId: this.viewId
                }
            );
        }, config.isPro ? 1000 : 700);
    }
    time;
    async leaveWorkspace() {
        if (this.time) {
            clearTimeout(this.time);
            this.time = undefined;
        }
        delete this.workspaceId;
        delete this.isSync;
        await this.tim.syncSend(HttpMethod.post, '/workspace/leave', {});
    }
    async viewOperate(viewId: string, operate: Record<string, any>) {
        await this.tim.syncSend(HttpMethod.post, '/view/cursor/operate', {
            viewId: viewId,
            operate: operate
        });
    }
    /**
     * 激活
     */
    activate() {

    }
    /**
     * 失活
     * 用户如果离开当前的tab页面，
     * 超出一定时间后，将自动断联
     */
    deactivates() {

    }
    close() {
        if (this.tim?.isConncted) {
            this.tim.close()
        }
        this.tim = undefined;
    }
    async getHeads(): Promise<Record<string, any>> {
        var device = await sCache.get(CacheKey.device);
        var token = await sCache.get(CacheKey.token);
        var lang = await sCache.get(CacheKey.lang);
        return {
            device, token, lang
        }
    }
}
export var timService = new TimService();
document.addEventListener("visibilitychange", function (e) {
    console.log(document.visibilityState, 'visibilitychange');
    if (document.visibilityState == 'hidden') {
        // 网页被挂起 ---- 暂停音乐

    }
    else {
        // 网页被呼起 ---- 播放音乐

    }
});
window.addEventListener('pageshow', function () { console.log('pageshow') });
window.addEventListener('pagehide', function () { console.log('pagehide') })
// window.addEventListener('blur', function () { console.log('blur'); });
// window.addEventListener('focus', function () { console.log('focus'); });