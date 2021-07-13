import { createBrowserHistory } from "history";
import { matchPath } from "react-router";

export const SyHistory = createBrowserHistory();



export function currentParams(routePath: string):Record<string,any> {
    var r = matchPath(location.pathname, {
        exact: true,
        path: routePath
    });
    if (r && r.params) {
        return r.params;
    }
    return {}
}