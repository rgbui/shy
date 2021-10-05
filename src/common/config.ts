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
    get remoteUrl() {
        return API_MASTER_URL
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
}
export var config = new Config();
// if (config.isBeta || config.isPro) {
console.log('v'+config.version, 'background-color:rgba(255,0,0,.6);color:#fff;');
// }