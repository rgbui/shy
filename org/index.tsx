/**
 * 这里是官网的主要入口
 * 脚本和样式在这里编写
 * 静态的网页在项目org下面
 * 静态的网页在depoly项目下面有一个packOrg里面进行模板的处理
 * 静态的网页会取org.html里面的脚本和样式
 */

import "../common/config";
import "rich";
import "../services/declare";
import "../src/surface/message.center";
import "../src/assert/theme.less";
import "./style.less";
import "rich/src/assert/atom.less";
import { channel } from "rich/net/channel";
window.isAuth = false;
import { createAuthIframe } from '../auth/iframe';
import { config } from "../common/config";
import ReactDOM from "react-dom";
import React from "react";
import { TemplateView } from "rich/extensions/template";
createAuthIframe();
var user, isUserRender;
function getEle(selector) {
    return document.body.querySelector(selector) as HTMLElement;
}
async function loadUser() {
    var r = await channel.get('/sign');
    if (r.ok) {
        user = r.data.user;
        renderEl()
    }
}
function renderEl() {
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
loadUser();
function load() {
    renderEl()
    var ele = getEle('.shy-site-head-menu');
    ele.addEventListener('mousedown', e => {
        var nv = getEle('.shy-site-head-navs');
        nv.style.display = 'block'
    })
    var eb = getEle('.shy-site-head-navs');
    if (eb) {
        eb.addEventListener('mousedown', g => {
            var te = g.target as HTMLElement;
            if (te.tagName.toLowerCase() != 'a') eb.style.display = 'none';
        })
    }
    if (location.pathname == '/template' || config.isDev) {
        loadTemplate()
    }
}
function loadTemplate() {
    var el = document.querySelector('[data-template-flag]');
    ReactDOM.render(
        <TemplateView isOrg />,
        el
    )
}
window.addEventListener('DOMContentLoaded', (e) => {
    load();
})
document.addEventListener('scroll', (e) => {
    var head = getEle('.shy-site-head');
    var top = document.documentElement.scrollTop || document.body.scrollTop;
    if (top > 0) head.classList.add('float')
    else head.classList.remove('float');
})


