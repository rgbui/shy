import { config } from "../../src/common/config";
import { Aes } from "../../src/util/crypto";
import { send } from "../auth/iframe";
/**
 * 缓存应用的key
 */
export enum CacheKey {
    token,
    finger,
    device,
    workspaceId,
    workspace_open_page_id,
    lang,
    workspace_toggle_pages,
    slideWidth
}
const FLAG = 'shy.';
class SyCache {
    private security = false;
    constructor(options?: { security: boolean }) {
        if (options) Object.assign(this, options)
    }
    private en(d) {
        if (this.security == true) return Aes.encrypt(d);
        else return d;
    }
    private de(d) {
        if (this.security == true) return Aes.decrypt(d);
        else return d;
    }
    private async getValue(key: CacheKey | string): Promise<{ value: any, expire: number }> {
        var k = this.getKey(key);
        var value = window.isAuth ? await send('localStorage.getItem', [k]) : localStorage.getItem(k);
        if (value) {
            try {
                return JSON.parse(this.de(value))
            }
            catch (ex) {

            }
        }
    }
    private getKey(key: CacheKey | string) {
        if (config.isPro) return FLAG + key;
        else return FLAG + (typeof key == 'number' ? CacheKey[key] : key);
    }
    async get<T = any>(key: CacheKey | string): Promise<T> {
        var v = await this.getValue(key);
        if (v && (typeof v.expire == 'undefined' || typeof v.expire == 'number' && v.expire > Date.now())) return v.value;
    }
    async set<T = any>(key: CacheKey | string, value: T, expire?: number, unit: 'm' | 's' | 'h' | 'd' | 'M' | 'y' | 'w' = 'm') {
        var k = this.getKey(key);
        var t = undefined;
        if (typeof expire == 'number') {
            function getN() {
                if (unit == 's') return 1000;
                else if (unit == 'm') return 1000 * 60;
                else if (unit == 'h') return 1000 * 60 * 60;
                else if (unit == 'd') return 1000 * 60 * 60 * 24;
                else if (unit == 'M') return 1000 * 60 * 60 * 24 * 30;
                else if (unit == 'y') return 1000 * 60 * 60 * 24 * 30 * 12;
                else if (unit == 'w') return 1000 * 60 * 60 * 24 * 7;
            }
            t = Date.now() + expire * getN();
        }
        window.isAuth ? await send('localStorage.setItem', [k, this.en(JSON.stringify({ value, expire: t }))]) : localStorage.setItem(k, this.en(JSON.stringify({ value, expire: t })))
    }
    async has(key: CacheKey | string) {
        var r = await this.get(key);
        if (typeof r != 'undefined') return true;
        else return false;
    }
    resolve(...keys: (CacheKey | string)[]) {
        return keys.join(".");
    }
    /**
     * 是否为过期的key
     * @param key 
     * @returns 
     */
    async isExpired(key: CacheKey) {
        var v = await this.getValue(key);
        if (v && (typeof v.expire == 'undefined' || typeof v.expire == 'number' && v.expire > Date.now())) return true;
        else return false;
    }
}
/**
 * 加密的缓存
 */
export var sCache = new SyCache({ security: true });
/**
 * 不加密缓存
 */
export var yCache = new SyCache();