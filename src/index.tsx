import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { appLangProvider } from '../i18n/provider';
import { userDeviceService } from '../services/device';
import { ShyUrl, SyHistory } from './history';
import { DownloadView } from './site/download';
import { HelpView } from './site/help';
import { PrivateView } from './site/protocol/privacy';
import { AgreeView } from './site/protocol/service';
import { RouteView } from './site/route';
import { SceneView } from './site/scene';
import { WeChatView } from './site/wechat';

import { Login } from './surface/user/sign/in';
import { LogOut } from './surface/user/sign/out';
import { WorkspaceCreateView } from './surface/workspace/create';
import "./site/declare";
import { AsyncComponent } from "rich/component/lib/async.compont"
import { ViewSurface } from './surface/view/index';
import { View404 } from './site/404';
import { InviteView } from './surface/workspace/create/invite';
import { config } from './common/config';
import { SiteView } from './site/production';
import { surface } from './surface';
import { MyWorkSpace } from './surface/view/my';
var BookView = AsyncComponent(async () => (await import('./site/shiyun')).BookView);
export function App() {
  let [isLoad, setLoad] = React.useState(false);
  async function load() {
    await appLangProvider.import();
    await userDeviceService.register();
    await surface.loadUser()
    setLoad(true);
  }
  React.useEffect(() => {
    load();
  }, [])
  function renderRoutes() {
    if (config.isDev || config.isBeta) {
      return <Router history={SyHistory}>
        <Switch>
          <Route path={ShyUrl.root} exact component={SiteView}></Route>
          <Route path={ShyUrl.scene} exact component={SceneView}></Route>
          <Route path={ShyUrl.wechat} exact component={WeChatView}></Route>
          <Route path={ShyUrl.route} exact component={RouteView}></Route>
          <Route path={ShyUrl.privacy_protocol} exact component={PrivateView}></Route>
          <Route path={ShyUrl.service_protocol} exact component={AgreeView}></Route>
          <Route path={ShyUrl.download} exact component={DownloadView}></Route>
          <Route path={ShyUrl.help} exact component={HelpView}></Route>
          <Route path={ShyUrl.signOut} exact component={LogOut}></Route>
          <Route path={ShyUrl.signIn} exact component={Login}></Route>
          <Route path={ShyUrl.shiyun} exact component={BookView} />
          <Route path={ShyUrl.workCreate} exact component={WorkspaceCreateView}></Route>
          <Route path={ShyUrl.myWorkspace} exact component={MyWorkSpace}></Route>
          <Route path={ShyUrl._404} exact component={View404}></Route>
          <Route path={ShyUrl.ws} exact component={ViewSurface}></Route>
          <Route path={ShyUrl.pageDev} exact component={ViewSurface}></Route>
          <Route path={ShyUrl.invite} exact component={InviteView}></Route>
          <Route component={View404}></Route>
        </Switch>
      </Router>
    }
    else if (config.isPro) {
      var isOrg = location.hostname == 'shy.live';
      if (isOrg) {
        return <Router history={SyHistory}>
          <Switch>
            <Route path={ShyUrl.root} exact component={SiteView}></Route>
            <Route path={ShyUrl.scene} exact component={SceneView}></Route>
            <Route path={ShyUrl.wechat} exact component={WeChatView}></Route>
            <Route path={ShyUrl.route} exact component={RouteView}></Route>
            <Route path={ShyUrl.privacy_protocol} exact component={PrivateView}></Route>
            <Route path={ShyUrl.service_protocol} exact component={AgreeView}></Route>
            <Route path={ShyUrl.download} exact component={DownloadView}></Route>
            <Route path={ShyUrl.help} exact component={HelpView}></Route>
            <Route path={ShyUrl.signOut} exact component={LogOut}></Route>
            <Route path={ShyUrl.signIn} exact component={Login}></Route>
            <Route path={ShyUrl.shiyun} exact component={BookView} />
            <Route path={ShyUrl.workCreate} exact component={WorkspaceCreateView}></Route>
            <Route path={ShyUrl.myWorkspace} exact component={MyWorkSpace}></Route>
            <Route path={ShyUrl._404} exact component={View404}></Route>
            <Route component={View404}></Route>
          </Switch>
        </Router>
      }
      else {
        return <Router history={SyHistory}>
          <Switch>
            <Route path={ShyUrl.root} exact component={ViewSurface}></Route>
            <Route path={ShyUrl.page} exact component={ViewSurface}></Route>
            <Route path={ShyUrl.invite} exact component={InviteView}></Route>
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

