import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
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
  return <div className='shy-app'>
    {!isLoad && <div className='shy-app-load'></div>}
    {isLoad && <Router history={SyHistory}>
      <Route path='/' exact component={ViewSurface}></Route>
      <Route path='/scene' exact component={SceneView}></Route>
      <Route path='/wechat' exact component={WeChatView}></Route>
      <Route path='/route' exact component={RouteView}></Route>
      <Route path='/privacy/protocol' exact component={PrivateView}></Route>
      <Route path='/service/protocol' exact component={AgreeView}></Route>
      <Route path='/download' exact component={DownloadView}></Route>
      <Route path='/help' exact component={HelpView}></Route>
      <Route path='/sign' exact component={Login}></Route>
      <Route path='/sign/out' exact component={LogOut}> </Route>
      <Route path='/shiyun' exact component={BookView} />
      <Route path='/ws/:id' exact component={ViewSurface}></Route>
      <Route path='/page/:id' exact component={ViewSurface}></Route>
      <Route path='/view/:id' exact component={PageDisplay}></Route>
      <Route path='/work/create' exact component={WorkspaceCreateView}></Route>
      <Route path='/test/component' exact component={Component}></Route>
    </Router>}
  </div>
}

