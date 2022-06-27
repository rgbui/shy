import React from "react";
import ReactDOM from "react-dom";
import { channel } from "rich/net/channel";
import { appLangProvider } from "../../i18n/provider";
import { surface } from "../surface";
import { Route, Router, Switch } from "react-router";
import { ShyMobileHistory } from "./history";
import { WorkspaceView } from "./workspace";


export function App() {
    let [isLoad, setLoad] = React.useState(false);
    async function load() {
        await appLangProvider.import();
        await channel.put('/device/sign');
        await surface.loadUser()
        await surface.loadWorkspaceList()
        setLoad(true);
    }
    function renderRoutes() {
        return <Router history={ShyMobileHistory}>
            <Switch>
                <Route path={'/workspace'} exact component={WorkspaceView}></Route>
            </Switch>
        </Router>
    }
    React.useEffect(() => {
        load();
    }, [])
    return <div></div>
}
ReactDOM.render(
    <App />,
    document.body.appendChild(document.createElement('div')),
)