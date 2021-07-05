import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fingerId = '';
export async function fingerFlag() {
    if (fingerId) return fingerId;
    const fpPromise = FingerprintJS.load();
    // Get the visitor identifier when you need it.
    const fp = await fpPromise;
    const result = await fp.get();
    console.log(result);
    // This is the visitor identifier:
    const visitorId = result.visitorId;
    fingerId=visitorId;
    return visitorId;
}