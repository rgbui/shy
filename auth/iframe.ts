import lodash from "lodash";
import { lst } from "rich/i18n/store";
import { util } from "rich/util/util";
var ifr: HTMLIFrameElement;
var isLoadedIframeSuccess: boolean = false;
export function createAuthIframe() {
    if (!ifr) {
        ifr = document.createElement('iframe');
        ifr.style.display = 'none';
        ifr.setAttribute('src', AUTH_URL);
        ifr.onload = function () {
            isLoadedIframeSuccess = true;
            loadSuccessSend();
        }
        document.body.appendChild(ifr);
    }
}
var events: { id: string, url?: string, args?: any[], sended?: boolean, time?: any, callback: (data) => void }[] = [];
export async function loadSuccessSend() {
    var evs = events.filter(x => x.sended == false);
    for (let i = 0; i < evs.length; i++) {
        var ev = evs[i];
        var tf = ev.time;
        ev.time = setTimeout(() => {
            tf();
        }, 2e3);
        ifr.contentWindow.postMessage(JSON.stringify({ id: ev.id, url: ev.url, args: ev.args || [] }), '*')
    }
}
export async function iframeChannel(url: string, args?: any[]) {
    return new Promise((resolve, reject) => {
        try {
            var id = util.guid();
            if (!isLoadedIframeSuccess) {
                events.push({
                    id,
                    url,
                    args,
                    sended: false,
                    callback: (data) => {
                        resolve(data);
                    },
                    time: () => {
                        reject(lst('响应超时'));
                        var ev = events.find(g => g.id == id);
                        lodash.remove(events, g => g.id == id);
                        if (ev.time) { clearTimeout(ev.time); ev.time = null }
                    }
                })
            }
            else {
                events.push({
                    id,
                    callback: (data) => {
                        resolve(data);
                    },
                    time: setTimeout(() => {
                        reject('over time');
                        var ev = events.find(g => g.id == id);
                        lodash.remove(events, g => g.id == id);
                        if (ev.time) { clearTimeout(ev.time); ev.time = null }
                    }, 2e3)
                })
                ifr.contentWindow.postMessage(JSON.stringify({ id, url, args: args || [] }), '*')
            }
        }
        catch (ex) {
            reject(ex);
        }
    })
}
window.addEventListener('message', function (ev) {
    var da = ev.data;
    try {
        var json = JSON.parse(da);
        if (json.id && events.some(s => s.id == json.id)) {
            var se = events.find(g => g.id == json.id);
            if (se) {
                clearTimeout(se.time);
                se.time = null
                se.callback(json.data);
                lodash.remove(events, g => g.id == json.id);
            }
        }
    }
    catch (ex) {

    }
})