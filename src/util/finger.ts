import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { CacheKey, sCache } from '../service/cache';

let fingerId = '';
export async function fingerFlag() {
    if (fingerId) return fingerId;
    var id = await sCache.get(CacheKey.clientId);
    if (id) { return fingerId = id; }
    const fpPromise = FingerprintJS.load();
    // Get the visitor identifier when you need it.
    const fp = await fpPromise;
    const result = await fp.get();
    // This is the visitor identifier:
    const visitorId = result.visitorId;
    fingerId = visitorId;
    await sCache.set(CacheKey.clientId, fingerId);
    return visitorId;
}