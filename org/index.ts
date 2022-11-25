/**
 * 这里是官网的主要入口
 * 脚本和样式在这里编写
 * 静态的网页在项目org下面
 * 静态的网页在depoly项目下面有一个packOrg里面进行模板的处理
 * 静态的网页会取org.html里面的脚本和样式
 */

import "rich/util/array";
import "../services/user/index";
import "../services/common/common";
import "./style.less";
import "rich/src/assert/atom.less";
import { channel } from "rich/net/channel";
window.isAuth = false;
import { createAuthIframe } from '../auth/iframe';
createAuthIframe();
async function loadUser() {
    var r = await channel.get('/sign');
    if (r.ok) {
        var user = r.data.user;
        var userEl = document.body.querySelector('.shy-site-head-user') as HTMLElement;
        if (userEl) {
            if (user.avatar) {
                userEl.innerHTML = `<a href="/my/workspace">
            <div class="shy-avatar" style="width: 40px; height: 40px;"><img src="${user.avatar.url}" style="width: 40px; height: 40px;"></div>
            </a>`
            }
            else {
                userEl.innerHTML = `<a href="/my/workspace">
            <div class="shy-avatar" style="width: 40px; height: 40px;"><span class='shy-avatar-name' style="width: 40px; height: 40px;display:block;text-align:center;line-height:40px">${user.name.slice(0, 1)}</span></div>
            </a>`
            }
        }
    }

}
window.addEventListener('load', (e) => {
    loadUser();
})
document.addEventListener('scroll', (e) => {
    var head = document.body.querySelector('.shy-site-head') as HTMLElement;
    var top = document.documentElement.scrollTop || document.body.scrollTop;
    if (top > 0) head.classList.add('float')
    else head.classList.remove('float');
})


