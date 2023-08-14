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
import "./site.less";
import "rich/src/assert/atom.less";

window.isAuth = false;
window.isSite = true;
import { createAuthIframe } from '../auth/iframe';
import ReactDOM from "react-dom";
import React from "react";
import { App } from "./app";
import { blockStore } from "rich/extensions/block/store";
import { ls } from "rich/i18n/store";
import { channel } from "rich/net/channel";
import { surface } from "../src/surface/store";
createAuthIframe();
var div = document.body.querySelector('div');
if (!div) div = document.body.appendChild(document.createElement('div'))

async function load() {
  await ls.import();
  await blockStore.import();
  await channel.put('/device/sign');
  await surface.user.sign();
  ReactDOM.render(
    <App />,
    div,
  )
}

load()


