import { UA } from "rich/util/ua";
import { CacheKey, sCache, yCache } from "../net/cache";
import { masterSock } from "../net/sock";
import { fingerFlag } from "../src/util/finger";
class UserDeviceService {
    async register() {
        var devideId = await sCache.get(CacheKey.device);
        var cacFinger = await fingerFlag();
        if (devideId) {
            var cacheFinger = await sCache.get(CacheKey.finger);
            if (cacFinger == cacheFinger) {
                return;
            }
        }
        await sCache.set(CacheKey.finger, cacFinger);
        var r = await masterSock.post<{ devideId: string }, string>('/register/device', {
            finger: cacFinger,
            platform: '',
            browser: UA.browser,
            device: UA.device,
            os: UA.os,
            cpu: UA.cpu,
            deviceId: devideId || undefined
        });
        await sCache.set(CacheKey.device, r.data.devideId);
    }
    async getDeviceId() {
        return await sCache.get(CacheKey.device);
    }
}

export var userDeviceService = new UserDeviceService();