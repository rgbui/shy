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

window.isAuth = false;
import { createAuthIframe } from '../auth/iframe';
import ReactDOM from "react-dom";
import React from "react";
import { TemplateView } from "rich/extensions/template";
import { ProductView } from "./product";
import { loadUser, renderSignEl } from "./sign";
import { getEle } from "./util";
import { DownloadView } from "./download";
import { PriceView } from "./price";
createAuthIframe();
loadUser();

function loadOrg() {
    var el = document.querySelector('[data-site-app]');
    if (el) {
        var TemplateView = ProductView;
        if (location.pathname == '/' || location.pathname == '/org')
            TemplateView = ProductView;
        else if (location.pathname == '/download')
            TemplateView = DownloadView;
        else if (location.pathname == '/price')
            TemplateView = PriceView;
        ReactDOM.render(
            <TemplateView />,
            el
        )
    }
}
function loadTemplate() {
    var el = document.querySelector('[data-template-flag]');
    ReactDOM.render(
        <TemplateView isOrg />,
        el
    )
}

function load() {
    renderSignEl()
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
    if (location.pathname == '/template') {
        loadTemplate()
    }
    else if (['/org', '/', '/price', '/download'].includes(location.pathname)) {
        loadOrg()
    }
    document.body.addEventListener('mousedown', e => {
        var c = (e.target as HTMLElement).closest('.shy-site-tab-items');
        if (c) {
            var items = Array.from(c.children);
            var item = items.find(g => g.contains(e.target as HTMLElement) || g === e.target);
            if (item) {
                var at = items.findIndex(c => c === item);
                var pages = c.nextElementSibling as HTMLElement;
                var pcs = Array.from(pages.children);
                var count = Math.max(items.length, pcs.length);
                for (let i = 0; i < count; i++) {
                    if (i == at) {
                        if (pcs[i]) (pcs[i] as HTMLElement).style.display = 'block';
                        if (items[i]) items[i].classList.add('item-hover-focus');
                    }
                    else {
                        if (pcs[i]) (pcs[i] as HTMLElement).style.display = 'none';
                        if (items[i]) items[i].classList.remove('item-hover-focus');
                    }
                }
            }
        }

        var dg = (e.target as HTMLElement).closest('[data-toggle]');
        if (dg) {
            var se = Array.from(dg.children);
            var arrowIcon = se.find(c => c.classList.contains('shy-icon')) as HTMLElement
            var ne = dg.nextElementSibling as HTMLElement;
            if (ne) {
                if (getComputedStyle(ne, null).display == 'none') {
                    ne.style.display = 'block';
                    arrowIcon.style.transform = 'rotate(0deg)';
                }
                else {
                    ne.style.display = 'none';
                    arrowIcon.style.transform = 'rotate(90deg)';
                }
            }
        }

    })
}
window.addEventListener('DOMContentLoaded', (e) => {
    load();
})



