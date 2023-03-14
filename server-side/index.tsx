import { App } from "./app";
import React from "react";
import ReactDOM from 'react-dom';
import "rich";
import "../services/declare";
import "../src/assert/shy.less";
import "../src/assert/theme.less";
import { configure } from 'mobx';
configure({ enforceActions: 'never' })
ReactDOM.render(
  <App />,
  document.body.appendChild(document.createElement('div')),
)