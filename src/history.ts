import { createBrowserHistory } from "history";
import { generatePath, matchPath } from "react-router";
import { config } from "./common/config";

export const SyHistory = createBrowserHistory();

export function currentParams(routePath: string): Record<string, any> {
    var r = matchPath(location.pathname, {
        exact: true,
        path: routePath
    });
    if (r && r.params) {
        return r.params;
    }
    return undefined;
}

export var UrlRoute = {
    push(url: ShyUrl, state?: Record<string, any>,isRedict?: boolean) {
        if (url == ShyUrl.workCreate && config.isPro) {
            if (isRedict) return location.href = 'https://shy.live' + url;
        }
        else if (url == ShyUrl.signIn) {
            if (config.isPro && config.isUserWs) {
                return location.href = 'https://shy.live' + url
            }
        }
        SyHistory.push(url, state);
    },
    redict(url: string | ShyUrl, state?: Record<string, any>) {
        SyHistory.push(url, state)
    },
    pushToWs(sn: number | string, isRedict?: boolean) {
        if (config.isPro) {
            if (isRedict) location.href = `https://${sn}.shy.live/`
            return SyHistory.push(this.gen(ShyUrl.ws, { wsId: sn }))
        }
        else return SyHistory.push(this.gen(ShyUrl.ws, { wsId: sn }))
    },
    pushToPage(wsSn: number | string, pageSn: number) {
        if (config.isPro) {
            if (location.host == wsSn + '.shy.live') {
                return SyHistory.push(this.gen(ShyUrl.page, { pageId: pageSn }));
            }
            else {
                return SyHistory.push(`https://${wsSn}.shy.live` + this.gen(ShyUrl.page, { pageId: pageSn }));
            }
        }
        else return SyHistory.push(this.gen(ShyUrl.pageDev, { wsId: wsSn, pageId: pageSn }))
    },
    isMatch(url: ShyUrl) {
        return currentParams(url) ? true : false;
    },
    match(url: ShyUrl) {
        return currentParams(url);
    },
    gen(url: ShyUrl, params: Record<string, any>) {
        return generatePath(url, params);
    }
}

export enum ShyUrl {
    root = '/',
    scene = '/scene',
    wechat = '/wechat',
    route = '/route',
    privacy_protocol = '/privacy/protocol',
    service_protocol = '/service/protocol',
    download = '/download',
    help = '/help',
    signOut = '/sign/out',
    signIn = '/sign/in',
    shiyun = '/shiyun',
    ws = '/ws/:wsId',
    me = '/me',
    pageDev = '/ws/:wsId/page/:pageId',
    page = '/page/:pageId',
    invite = '/invite/:id',
    workCreate = '/work/create',
    myWorkspace = '/my/workspace',
    discovery = '/discovery',
    _404 = '/404'
}