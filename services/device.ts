

import { act, get, put, query } from "rich/net/annotation";
import { UA } from "rich/util/ua";
import { CacheKey, sCache, yCache } from "../net/cache";
import { masterSock } from "../net/sock";
import { config } from "../src/common/config";
import { fingerFlag } from "../src/util/finger";
class UserDeviceService {
    @put('/device/sign')
    async sign() {
        var devideId = await sCache.get(CacheKey.device);
        var cacFinger = await fingerFlag();
        if (devideId) {
            var cacheFinger = await sCache.get(CacheKey.finger);
            if (cacFinger == cacheFinger) {
                return;
            }
        }
        await sCache.set(CacheKey.finger, cacFinger);
        var r = await masterSock.put<{ deviceId: string }, string>('/device/sign', {
            finger: cacFinger,
            platform: config.platform,
            browser: UA.browser,
            device: UA.device,
            os: UA.os,
            cpu: UA.cpu,
            deviceId: devideId || undefined
        });
        await sCache.set(CacheKey.device, r.data.deviceId);
    }
    @query('/device/query')
    async getDeviceId() {
        return await sCache.get(CacheKey.device);
    }
}

