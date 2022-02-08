import { Workspace } from "../../src/surface/workspace";
import { sCache, CacheKey } from "../cache";
import { HttpMethod } from "./http";
import { Tim } from "./tim";

class TimService {
    constructor() {

    }
    workspaceId: string;
    tim: Tim;
    async enter(workspace: Workspace) {
        if (this.workspaceId == workspace.id && this.tim?.isConncted) return;
        if (this.tim?.isConncted && this.workspaceId != workspace.id) {
            await this.leave();
        }
        this.workspaceId = workspace.id;
        if (!(this.tim?.isConncted && this.tim?.url == workspace.pidUrl)) {
            this.tim = new Tim();
            await this.tim.load(workspace.pidUrl);
        }
        var data = await this.getHeads();
        data.workspaceId = workspace.id;
        data.sockId = this.tim.id;
        this.tim.send(HttpMethod.post, '/workspace/enter', data);
    }
    async leave() {
        if (this.tim?.isConncted && this.workspaceId) {
            // var data = await this.getHeads();
            // data.workspaceId = this.workspaceId;
            // data.sockId = this.tim.id;
            this.tim.send(HttpMethod.post, '/workspace/leave', {});
        }
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
    if (document.visibilityState == 'hidden') {
        // 网页被挂起 ---- 暂停音乐

    }
    else {
        // 网页被呼起 ---- 播放音乐

    }
});
window.addEventListener('pageshow', function () { });
window.addEventListener('pagehide', function () { })
window.addEventListener('blur', function () { console.log('blur'); });
window.addEventListener('focus', function () { console.log('focus'); });