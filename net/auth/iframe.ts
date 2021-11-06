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
var events: { id: string, callback: (data) => void }[] = [];
export async function send(url: string, args?: any[]) {
    return new Promise((resolve, reject) => {
        var id = util.guid();
        events.push({
            id,
            callback: (data) => {
                resolve(data);
            }
        })
        ifr.contentWindow.postMessage(JSON.stringify({ id, url, args: args || [] }), location.href)
    })
}
window.addEventListener('message', function (ev) {
    var da = ev.data;
    try {
        var json = JSON.parse(da);
        if (json.id && events.some(s => s.id == json.id)) {
            var se = events.find(g => g.id == json.id);
            if (se) {
                se.callback(json.data);
                lodash.remove(events, g => g.id == json.id);
            }
        }
    }
    catch (ex) {

    }
})