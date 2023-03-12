import { App } from "./app";
import React from "react";
import ReactDOM from 'react-dom';
import "rich";
import "../services/declare";
import "../src/assert/shy.less";
import "../src/assert/theme.less";

ReactDOM.render(
  <App />,
  document.body.appendChild(document.createElement('div')),
)