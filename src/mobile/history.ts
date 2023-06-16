import { createBrowserHistory } from "history";
import { generatePath, matchPath } from "react-router";
export const ShyMobileHistory = createBrowserHistory();
export function currentParams(routePath: string): Record<string, any> {
    var r = matchPath(location.pathname, {
        exact: true,
        path: routePath
    });
    if (r && r.params)
    {
        return r.params;
    }
    return undefined;
}
export var UrlRoute = {
    push(url: ShyUrl, state?: Record<string, any>, isRedict?: boolean) {
        if (url == ShyUrl.workCreate && window.shyConfig.isPro) {
            if (isRedict) return location.href = 'https://shy.live' + url;
        }
        else if (url == ShyUrl.signIn) {
            if (window.shyConfig.isPro && window.shyConfig.isUserWs) {
                return location.href = 'https://shy.live' + url
            }
        }
        ShyMobileHistory.push(url, state);
    },
    redict(url: string | ShyUrl, state?: Record<string, any>) {
        ShyMobileHistory.push(url, state)
    },
    pushToWs(sn: number | string, isRedict?: boolean) {
        if (window.shyConfig.isPro) {
            if (isRedict) location.href = `https://${sn}.shy.live/`
            return ShyMobileHistory.push(this.gen(ShyUrl.ws, { wsId: sn }))
        }
        else return ShyMobileHistory.push(this.gen(ShyUrl.ws, { wsId: sn }))
    },
    pushToPage(wsSn: number | string, pageSn: number) {
        if (window.shyConfig.isPro) {
            if (location.host == wsSn + '.shy.live') {
                return ShyMobileHistory.push(this.gen(ShyUrl.page, { pageId: pageSn }));
            }
            else {
                return ShyMobileHistory.push(this.gen(ShyUrl.wsPage, { wsId: wsSn, pageId: pageSn }))
            }
        }
        else return ShyMobileHistory.push(this.gen(ShyUrl.wsPage, { wsId: wsSn, pageId: pageSn }))
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
    invite = '/invite/:id',
    workCreate = '/work/create',
    myWorkspace = '/my/workspace',
    discovery = '/discovery',
    _404 = '/404'
}