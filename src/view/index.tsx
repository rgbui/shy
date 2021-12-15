import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { appLangProvider } from '../../i18n/provider';
import { userDeviceService } from '../../services/device';
import { SyHistory } from './history';
import { DownloadView } from './site/download';
import { HelpView } from './site/help';
import { PrivateView } from './site/protocol/privacy';
import { AgreeView } from './site/protocol/service';
import { RouteView } from './site/route';
import { SceneView } from './site/scene';
import { WeChatView } from './site/wechat';

import { Login } from './site/login';
import { LogOut } from './surface/user/logout';
import { WorkspaceCreateView } from './surface/workspace/create';
import "./site/declare";
import { AsyncComponent } from "rich/component/lib/async.compont"
import { PageDisplay } from './page';
import { ViewSurface } from './surface/view/index';
import { View404 } from './site/404';
import { InviteView } from './surface/workspace/create/invite';
import { config } from '../common/config';

var BookView = AsyncComponent(async () => (await import('./site/shiyun')).BookView);
export function App() {
  let [isLoad, setLoad] = React.useState(false);
  async function load() {
    await appLangProvider.import();
    await userDeviceService.register();
    setLoad(true);
  }
  React.useEffect(() => {
    load();
  }, [])
  function renderRoutes() {
    if (config.isDev || config.isBeta) {
      return <Router history={SyHistory}>
        <Switch>
          <Route path='/' exact component={ViewSurface}></Route>
          <Route path='/scene' exact component={SceneView}></Route>
          <Route path='/wechat' exact component={WeChatView}></Route>
          <Route path='/route' exact component={RouteView}></Route>
          <Route path='/privacy/protocol' exact component={PrivateView}></Route>
          <Route path='/service/protocol' exact component={AgreeView}></Route>
          <Route path='/download' exact component={DownloadView}></Route>
          <Route path='/help' exact component={HelpView}></Route>
          <Route path='/sign/out' exact component={LogOut}></Route>
          <Route path='/sign/in' exact component={Login}></Route>
          <Route path='/shiyun' exact component={BookView} />
          <Route path='/ws/:wsId/page/:pageId' exact component={ViewSurface}></Route>
          <Route path='/invite/:id' exact component={PageDisplay}></Route>
          <Route path='/work/create' exact component={WorkspaceCreateView}></Route>
          <Route path='/test/component' exact component={Component}></Route>
          <Route path='/404' exact component={View404}></Route>
          <Route component={View404}></Route>
        </Switch>
      </Router>
    }
    else if (config.isPro) {
      var isOrg = location.hostname == 'shy.live';
      if (isOrg) {
        return <Router history={SyHistory}>
          <Switch>
            <Route path='/' exact component={ViewSurface}></Route>
            <Route path='/scene' exact component={SceneView}></Route>
            <Route path='/wechat' exact component={WeChatView}></Route>
            <Route path='/route' exact component={RouteView}></Route>
            <Route path='/privacy/protocol' exact component={PrivateView}></Route>
            <Route path='/service/protocol' exact component={AgreeView}></Route>
            <Route path='/download' exact component={DownloadView}></Route>
            <Route path='/help' exact component={HelpView}></Route>
            <Route path='/sign/out' exact component={LogOut}></Route>
            <Route path='/sign/in' exact component={Login}></Route>
            <Route path='/shiyun' exact component={BookView} />
            <Route path='/work/create' exact component={WorkspaceCreateView}></Route>
            <Route path='/404' exact component={View404}></Route>
            <Route component={View404}></Route>
          </Switch>
        </Router>
      }
      else {
        return <Router history={SyHistory}>
          <Switch>
            <Route path='/' exact component={ViewSurface}></Route>
            <Route path='/page/:id' exact component={ViewSurface}></Route>
            <Route path='/invite/:id' exact component={InviteView}></Route>
            <Route component={View404}></Route>
          </Switch>
        </Router>
      }
    }
  }
  return <div className='shy-app'>
    {!isLoad && <div className='shy-app-load'></div>}
    {isLoad && renderRoutes()}
  </div>
}

