import { createBrowserHistory } from "history";
import { generatePath, matchPath } from "react-router";
export const SyHistory = createBrowserHistory()
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
    push(url: ShyUrl,
        state?: Record<string, any>,
        isRedict?: boolean
    ) {
        if (url == ShyUrl.workCreate && window.shyConfig.isPro) {
            if (isRedict) return location.href = 'https://shy.live' + url;
        }
        else if (url == ShyUrl.signIn) {
            if (window.shyConfig.isPro && window.shyConfig.isDomainWs) {
                return location.href = 'https://shy.live' + url
            }
        }
        SyHistory.push(url, state);
    },
    redict(url: string | ShyUrl, state?: Record<string, any>) {
        SyHistory.push(url, state)
    },
    pushToWs(sn: number | string, isRedict?: boolean) {
        return SyHistory.push(this.gen(ShyUrl.ws, { wsId: sn }))
    },
    pushToPage(wsSn: number | string, pageSn: number) {
        if (window.shyConfig.isPro) {
            if (location.host == wsSn + '.shy.live') {
                return SyHistory.push(this.gen(ShyUrl.page, { pageId: pageSn }));
            }
            else {
                if (location.host == 'shy.live') return SyHistory.push(this.gen(ShyUrl.wsPage, { wsId: wsSn, pageId: pageSn }))
                else location.href = 'https://shy.live/ws/' + wsSn + '/page/' + pageSn;
            }
        }
        else return SyHistory.push(this.gen(ShyUrl.wsPage, { wsId: wsSn, pageId: pageSn }))
    },
    pushToResource(wsSn: number | string, elementUrl: string) {
        if (window.shyConfig.isPro) {
            if (location.host == wsSn + '.shy.live') {
                return SyHistory.push(this.gen(ShyUrl.resource, {}) + "?url=" + encodeURIComponent(elementUrl));
            }
            else {
                return SyHistory.push(this.gen(ShyUrl.wsResource, { wsId: wsSn }) + "?url=" + encodeURIComponent(elementUrl))
            }
        }
        else return SyHistory.push(this.gen(ShyUrl.wsResource, { wsId: wsSn }) + "?url=" + encodeURIComponent(elementUrl))
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
    signOut = '/sign/out',
    signIn = '/sign/in',
    ws = '/ws/:wsId',
    me = '/me',
    wsPage = '/ws/:wsId/page/:pageId',
    page = '/page/:pageId',
    wsResource = '/ws/:wsId/r',
    resource = '/r',
    pageContent = '/pc',
    wsPageContent = '/ws/:wsId/pc',
    invite = '/invite/:id',
    workCreate = '/work/create',
    home = '/home',
    discovery = '/discovery',
    _404 = '/404',
    serverCenter = '/center'
}