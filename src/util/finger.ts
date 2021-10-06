import FingerprintJS from '@fingerprintjs/fingerprintjs';
export async function fingerFlag() {
    const fpPromise = FingerprintJS.load();
    const fp = await fpPromise;
    const result = await fp.get();
    const visitorId = result.visitorId;
    return visitorId;
}