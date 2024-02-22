import { Events } from "rich/util/events";
import { CacheKey, sCache } from "../../net/cache";


export const EmailRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
export const PhoneRegex = /^1[3-9]\d{9}|5\d{10}$/;
export var phoneCode = /^[\d]{4}$/;
export var inviteCode=/^[A-Z\d]{5,20}$/;

export class BaseService extends Events {
    async token() {
        return sCache.get(CacheKey.token);
    }
}