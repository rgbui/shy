import { util } from "rich/util/util";
import { ShyUtil } from "../util";

class Config {
    /**
     * * 打包发布的版本
     * dev 开发版
     * beta 测试版（线上的）
     * pro 正式版
     * @returns 
     */
    get mode() {
        return MODE;
    }
    get isPro() {
        return this.mode == 'pro'
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
    get isPc() {
        return false;
    }
    get isMobile() {
        return false;
    }
    get isWeb() {
        return false;
    }
    get isMacOs() {
        return true;
    }
    get isWindows() {
        return false;
    }
    get isAndroid() {
        return false;
    }
    /**
     * 是否为微信打开的
     */
    get isWeixin() {
        return false;
    }
    private service_guid: string = '';
    private counter = 0;
    guid() {
        if (this.service_guid) {
            var n = this.counter = this.counter + 1;
            return this.service_guid + "-" + (ShyUtil.hexadecimalConversion(62, n));
        }
        else util.guid();
    }
    updateServiceGuid(guid: string) {
        this.service_guid = guid;
        this.counter = 0;
    }
}
export var config = new Config();
console.log('%c v' + config.version + ' ', 'background-color:rgba(255,0,0,.6);color:#fff;border-radius:3px');
