

import { Langs } from 'rich/i18n/declare';
import { channel } from 'rich/net/channel';
import * as short from 'short-uuid';

class Config {
    /**
     * * 打包发布的版本
     * dev 开发版
     * beta 测试版（线上的）
     * pro 正式版
     * inside 内部版
     * @returns 
     */
    get mode() {
        return MODE;
    }
    get isPro() {
        return this.mode == 'pro'
    }
    get isUS() {
        return REGIN == 'US'
    }
    get isDomainWs() {
        if (this.isPro) {
            if (this.isUS && location.host == 'shy.red') return false;
            else if (!this.isUS && location.host == 'shy.live') return false;
            else return true;
        }
        // if (this.isDev) return true;
        return false;
    }
    get isBeta() {
        return this.mode == 'beta'
    }
    get isDev() {
        return this.mode == 'dev'
    }
    get version() {
        return VERSION
    }
    get isWeb() {
        return PLATFORM == 'web'
    }
    get isDesk() {
        return PLATFORM == 'desktop'
    }
    get isMobile() {
        return PLATFORM == 'mobile'
    }
    get isServerSide() {
        return PLATFORM == 'server-side'
    }
    get platform() {
        return PLATFORM
    }
    guid() {
        return short.generate();
    }
    isOnline: boolean;
    constructor() {
        this.isOnline = window.navigator.onLine ? true : false;
    }
    get isTestBeta() {
        if (this.isDev || this.isBeta) {
            return true;
        }
        var u = channel.query('/query/current/user');
        if (u && u.sn < 10) {
            return true;
        }
        return false;
    }
    get lang(): Langs {
        return this.isUS ? "English" : 'Chinese'
    }
}
export var config = new Config();
window.shyConfig = config;
window.shyLog = (...args) => {
    if (config.isDev || config.isBeta) {
        console.log(...args);
    }
}
console.dev = (...args) => {
    if (window.shyConfig.isDev) console.log(...args);
}
window.addEventListener("online", function () {
    window.shyConfig.isOnline = window.navigator.onLine ? true : false;
}, false);
window.addEventListener("offline", function () {
    window.shyConfig.isOnline = window.navigator.onLine ? true : false;
}, false);

console.log('%c v' + config.version + ' ', 'background-color:rgba(255,0,0,.6);color:#fff;border-radius:3px');
