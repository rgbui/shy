import React from "react";
import { Route, Router, Switch } from "react-router";
import { renderAvatorStatusSvgMask } from "rich/component/view/avator/status";
import { channel } from "rich/net/channel";
import { appLangProvider } from "../i18n/provider";
import { SyHistory, ShyUrl } from "../src/history";
import { surface } from "../src/surface/store";
import { View404 } from "../src/surface/404";
import { Login } from "../src/surface/user/sign/in";
import { LogOut } from "../src/surface/user/sign/out";

import { ServerSlideView } from "./home";
import { serverSlideStore } from "./store";

export function App() {
    let [isLoad, setLoad] = React.useState(false);
    async function load() {
        await appLangProvider.import();
        await channel.put('/device/sign');
        await surface.user.sign()
        await serverSlideStore.load();
        setLoad(true);
    }
    React.useEffect(() => {
        load();
    }, [])
    function renderRoutes() {
        return <Router history={SyHistory}>
            <Switch>
                <Route path={ShyUrl.root} exact component={ServerSlideView}></Route>
                <Route path={ShyUrl.signOut} exact component={LogOut}></Route>
                <Route path={ShyUrl.signIn} exact component={Login}></Route>
                <Route path={'/server/slide'} exact component={ServerSlideView}></Route>
                <Route path={ShyUrl._404} exact component={View404}></Route>
                <Route component={View404}></Route>
            </Switch>
        </Router>
    }
    return <div className='shy-app'>
        {renderAvatorStatusSvgMask()}
        {!isLoad && <div className='shy-app-load'></div>}
        {isLoad && renderRoutes()}
    </div>
}