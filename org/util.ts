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
    if (type == 'page') return { color: 'var(--high-light-color)' }
    else if (type == 'ai') return { color: 'var(--text-purple)' }
    else if (type == 'channel') return { color: 'var(--text-p-color)' }
    else if (type == 'whiteboard') return { color: 'var(--text-b-1-color)' }
    else if (type == 'ppt') return { color: "var(--hight-red-color)" }
    else if (type == 'datatable') return { color: 'var(--text-p1-color)' }
    else if (type == 'friends-circle') return { color: "var(--text-g-color)" }
}