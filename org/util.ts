import { UrlRoute } from "../src/history";

export function getEle(selector) {
    return document.body.querySelector(selector) as HTMLElement;
}


export function refShyPage(host: string, pageN?: number) {
    if (typeof pageN != 'undefined')
        return "https://" + host + "." + UrlRoute.getHost() + "/page/" + pageN;
    else return "https://" + host + "." + UrlRoute.getHost()
}

export function getTypeColor(type: 'page' | 'channel' | 'ai' | 'whiteboard' | 'ppt' | 'datatable' | 'friends-circle') {
    if (type == 'page') return { color: 'rgb(42, 157, 153)' }
    else if (type == 'ai') return { color: 'rgb(189, 115, 232)' }
    else if (type == 'channel') return { color: 'var(--text-p-color)' }
    else if (type == 'whiteboard') return { color: 'rgb(157, 52, 218)' }
    else if (type == 'ppt') return { color: "#ff76ad" }
    else if (type == 'datatable') return { color: 'rgb(37, 79, 173)' }
    else if (type == 'friends-circle') return { color: "#2aae67" }
}