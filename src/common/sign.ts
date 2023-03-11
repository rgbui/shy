

/**
 * 
 * 签名
 */

import { ethers } from "ethers";

import { util } from "rich/util/util.js";
import { CacheKey, sCache } from "../../net/cache/index.js";
import "../assert/js/jsrsasign-all-min.js"
import { surface } from "../surface/store";
import { stringify } from "json-stable-stringify"


/**
 * 签名的方式版本
 * 
 */
const SIGN_VERSION = 'shy-sign-v1';


function getRowContentData(row: Record<string, any>, contentType: string) {

    return row;
}
export async function signContent(row: Record<string, any>, contentType: string) {
    row = getRowContentData(row, contentType);
    var random = util.getRandom(1000, 1e8);
    var timestamp = Date.now();
    var device = await sCache.get(CacheKey.device);

    var domain = {
        ver: SIGN_VERSION,
        userid: surface.user.id,
        address: surface.user.uk,
        blockId: surface.workspace.chainBlockId,
        timestamp,
        random,
        device,
        type: contentType,
    }

    var message: string = stringify({ domain, row })
    if (typeof message != 'string') message = JSON.stringify(message)
    message = ethers.utils.hashMessage(message);
    var wallet = new ethers.Wallet(surface.user.rk)
    var sign = await wallet.signMessage(message);
    return util.base64En(JSON.stringify({
        sign: sign,
        message: message,
        domain
    }));
}

export async function verifyRow(row: Record<string, any>) {
    var signMessage = row.sign;
    if (signMessage) {
        var sm = JSON.parse(util.base64De(signMessage))
        var address = ethers.utils.verifyMessage(sm.message, sm.sign)
        if (address == sm.domain.address) {
            //说明签名没问题，下面验证内容是否被窜改了
            row = getRowContentData(row, sm.domain.type);
            var message: string = stringify({ domain: sm.domain, row })
            if (typeof message != 'string') message = JSON.stringify(message)
            var message = ethers.utils.hashMessage(message);
            //说明数据的哈希值是一样的
            if (message == sm.message) {
                return true;
            }
        }
        return false;
    }
    else return null;
}

