import lodash from "lodash";
import { util } from "rich/util/util";
var ifr: HTMLIFrameElement;
export function createAuthIframe() {
    if (!ifr) {
        ifr = document.createElement('iframe');
        ifr.style.display = 'none';
        ifr.setAttribute('src', AUTH_URL);
        document.body.appendChild(ifr);
    }
}
var events: { id: string, time: any, callback: (data) => void }[] = [];
export async function send(url: string, args?: any[]) {
    return new Promise((resolve, reject) => {
        try {
            var id = util.guid();
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