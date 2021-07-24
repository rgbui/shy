import { Events } from "rich/util/events";
import { CacheKey, sCache } from "./cache";
import { SockResponse } from "./sock";

var VerifyOptions = {
    phone: {
        regex: /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/,
        tip: '手机号格式不正确',
        nullTip: '手机号不能为空'
    },
    code: {
        regex: /^[\d]{4}$/,
        tip: '手机短信验证码输入不正确',
        nullTip: '手机短信验证码输入不能为空'
    }
};
export class BaseService extends Events {
    /**
     * 
     * @param verifyParams 
     * 需要校验的数据，通常数据的格式的都是明确的
     * 
     * @returns 
     */
    protected createResponse<U = Record<string, any>, T = string>(verifyParams?: Record<string, any>) {
        var rs: SockResponse<U, T> = { ok: true };
        if (typeof verifyParams == 'object') {
            for (let n in verifyParams) {
                var isVerifyNull = n.startsWith('$');
                let m = n.replace(/^\$/, '');
                let op: { regex: RegExp, tip: string, nullTip: string } = VerifyOptions[m];
                if (typeof op == 'object') {
                    if (isVerifyNull == true && !verifyParams[n]) {
                        rs.ok = false;
                        rs.warn = op.nullTip as any;
                        return rs;
                    }
                    if (!op.regex.test(verifyParams[n])) {
                        rs.ok = false;
                        rs.warn = op.tip as any;
                        return rs;
                    }
                }
            }
        }
        return rs;
    }

    get token() {
        return sCache.get(CacheKey.token);
    }
}