

/**
 * 
 * 签名
 */
import { util } from "rich/util/util.js";
import { CacheKey, sCache } from "../../net/cache/index.js";
import "../assert/js/jsrsasign-all-min.js"
import { surface } from "../surface";



/**
 * 签名的方式版本
 * 
 */
const SIGN_VERSION = 'sign-v1';

export async function signContent(data: Record<string, any>, contentType: string) {

    var content: string = '';
    var md5: string = '';
    var random = util.getRandom(1000, 1e8);
    var timestamp = Date.now();
    var device = await sCache.get(CacheKey.device);

    var sig = new (window as any).jsrsasign.Signature({ alg: 'SHA1withRSA' });
    sig.init(surface.user.rk);
    sig.updateString(md5);
    var sigVal = sig.sign();
    return {
        val: sigVal,
        ver: SIGN_VERSION,
        userid: surface.user.id,
        uk: surface.user.uk,
        type: contentType,
        timestamp,
        random,
        device
    };
}

export async function verifySign(data: Record<string, any>, contentType: string) {
    var sign = data.sign;
    if (typeof sign == 'string') sign = JSON.parse(sign);
    var md5 = sign.md5;
    var sig2 = new (window as any).jsrsasign.Signature({ "alg": "SHA1withRSA", prvkeypem: sign.uk });
    //sig2.init(PUBLIC);
    sig2.updateString(md5);
    var isValid = sig2.verify(sign.val);

    return isValid
}