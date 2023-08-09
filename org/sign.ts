import { channel } from "rich/net/channel";
import { getEle } from "./util";

var user, isUserRender;

export async function loadUser() {
    var r = await channel.get('/sign');
    if (r.ok) {
        user = r.data.user;
        renderSignEl()
    }
}
export function renderSignEl() {
    if (isUserRender) return;
    if (!user) return;
    var userEl = getEle('.shy-site-head-user');
    if (userEl) {
        var loginButton = getEle('.shy-site-head-user-sign');
        loginButton.style.display = 'none';
        isUserRender = true;
        if (user.avatar) {
            userEl.insertAdjacentHTML('afterbegin',
                `<a href="/home">
            <div class="shy-avatar" style="width: 40px; height: 40px;"><img src="${user.avatar.url}" style="width: 40px; height: 40px;"></div>
            </a>`)
        }
        else {
            userEl.insertAdjacentHTML('afterbegin',
                `<a href="/home">
            <div class="shy-avatar" style="width: 40px; height: 40px;"><span class='shy-avatar-name' style="width: 40px; height: 40px;display:block;text-align:center;line-height:40px">${user.name.slice(0, 1)}</span></div>
            </a>`)
        }
    }
}

