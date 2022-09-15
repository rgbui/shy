import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { appLangProvider } from '../i18n/provider';
import { ShyUrl, SyHistory } from './history';
import { Login } from './surface/user/sign/in';
import { LogOut } from './surface/user/sign/out';
import { WorkspaceCreateView } from './surface/workspace/create';
import { SurfaceView } from './surface/view/index';
import { View404 } from './surface/404';
import { InviteView } from './surface/workspace/create/invite';
import { config } from './common/config';
import { surface } from './surface';
import { MyWorkSpace } from './surface/view/my';
import { channel } from "rich/net/channel";
import { renderAvatorStatusSvgMask } from "rich/component/view/avator/status";
export function App() {
  let [isLoad, setLoad] = React.useState(false);
  async function load() {
    await appLangProvider.import();
    await channel.put('/device/sign');
    await surface.loadUser()
    await surface.loadWorkspaceList()
    setLoad(true);
  }
  React.useEffect(() => {
    load();
  }, [])
  function renderRoutes() {
    if (config.isDev || config.isBeta) {
      return <Router history={SyHistory}>
        <Switch>
          <Route path={ShyUrl.root} exact component={SurfaceView}></Route>
          <Route path={ShyUrl.signOut} exact component={LogOut}></Route>
          <Route path={ShyUrl.signIn} exact component={Login}></Route>
          <Route path={ShyUrl.workCreate} exact component={WorkspaceCreateView}></Route>
          <Route path={ShyUrl.myWorkspace} exact component={MyWorkSpace}></Route>
          <Route path={ShyUrl._404} exact component={View404}></Route>
          <Route path={[ShyUrl.ws, ShyUrl.wsPage, ShyUrl.me, ShyUrl.discovery]} exact component={SurfaceView}></Route>
          <Route path={ShyUrl.invite} exact component={InviteView}></Route>
          <Route component={View404}></Route>
        </Switch>
      </Router>
    } else if (config.isPc) {
      return <Router history={SyHistory}>
        <Switch>
          <Route path={ShyUrl.root} exact component={SurfaceView}></Route>
          <Route path={ShyUrl.signOut} exact component={LogOut}></Route>
          <Route path={ShyUrl.signIn} exact component={Login}></Route>
          <Route path={ShyUrl.workCreate} exact component={WorkspaceCreateView}></Route>
          <Route path={ShyUrl.myWorkspace} exact component={MyWorkSpace}></Route>
          <Route path={ShyUrl._404} exact component={View404}></Route>
          <Route path={[ShyUrl.ws, ShyUrl.wsPage, ShyUrl.me, ShyUrl.discovery]} exact component={SurfaceView}></Route>
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
            <Route path={ShyUrl.signOut} exact component={LogOut}></Route>
            <Route path={ShyUrl.signIn} exact component={Login}></Route>
            <Route path={ShyUrl.workCreate} exact component={WorkspaceCreateView}></Route>
            <Route path={ShyUrl.myWorkspace} exact component={MyWorkSpace}></Route>
            <Route path={[ShyUrl.ws, ShyUrl.page, ShyUrl.wsPage, ShyUrl.me, ShyUrl.discovery]} exact component={SurfaceView}></Route>
            <Route path={ShyUrl.invite} exact component={InviteView}></Route>
            <Route path={ShyUrl._404} exact component={View404}></Route>
            <Route component={View404}></Route>
          </Switch>
        </Router>
      }
      else {
        return <Router history={SyHistory}>
          <Switch>
            <Route path={ShyUrl.workCreate} exact component={WorkspaceCreateView}></Route>
            <Route path={ShyUrl.myWorkspace} exact component={MyWorkSpace}></Route>
            <Route path={ShyUrl.invite} exact component={InviteView}></Route>
            <Route path={[ShyUrl.root, ShyUrl.ws, ShyUrl.page, ShyUrl.wsPage, ShyUrl.me, ShyUrl.discovery]} exact component={SurfaceView}></Route>
            <Route path={ShyUrl._404} exact component={View404}></Route>
            <Route component={View404}></Route>
          </Switch>
        </Router>
      }
    }

  }
  return <div className='shy-app'>
    {renderAvatorStatusSvgMask()}
    {!isLoad && <div className='shy-app-load'></div>}
    {isLoad && renderRoutes()}
  </div>
}

