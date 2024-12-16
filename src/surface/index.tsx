window.isAuth = false;
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn'
if (!window.shyConfig.isUS) {
  dayjs.locale('zh-cn') // use loaded locale globally
}
import "../../common/config";
import { createAuthIframe } from '../../auth/iframe';
if (window.shyConfig.isWeb) createAuthIframe();
import * as React from 'react';
import ReactDOM from 'react-dom';
import "rich";
import "../../services/declare";
import "../assert/shy.less";
import "../assert/theme.less";
import "../../org/site.less";
import "./supervisor/style.less";
import "./sln/style.less";
import { App } from './app/app';
import { configure } from 'mobx';
configure({ enforceActions: 'never' })
document.body.classList.add('theme-light');
var div = document.body.querySelector('div');
if (!div) div = document.body.appendChild(document.createElement('div'))
ReactDOM.render(
  <App />,
  div,
)

