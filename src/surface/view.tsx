import { observer, useLocalObservable } from "mobx-react";
import React from 'react';
import { Loading } from "rich/component/view/loading";
import { Surface, surface } from "./store";
import { SideBar } from "./view/sidebar";
import { UserChannel } from "./user/channel/view";
import { Route } from "react-router";
import { ShyUrl, UrlRoute } from "../history";
import { DiscoveryView } from "./discovery";
import { JoinTip } from "./view/join";
import { SideSln } from "./view/sidesln";
import { SupervisorView } from "./supervisor/view";
import { ViewNotAllow } from "./404";

export var SurfaceView = observer(function () {
    var local = useLocalObservable(() => {
        return {
            loading: true
        }
    });
    async function load() {
        local.loading = true;
        try {
            await surface.loadWorkspaceList();
            var willWs = await Surface.getWsName();
            if (willWs) await surface.onLoadWorkspace(willWs)
            else UrlRoute.redict(ShyUrl.myWorkspace)
        }
        catch (ex) {
        }
        finally {
            local.loading = false;
        }
    }
    React.useEffect(() => {
        load();
    }, [])
    if (local.loading) return <div className='shy-surface-loading'><Loading /></div>
    else {
        return <div className='shy-surface'>
            <SideBar></SideBar>
            <Route path={[ShyUrl.ws, ShyUrl.page]}>
                {surface.canAccessPage === false && <ViewNotAllow></ViewNotAllow>}
                {surface.showWorkspace && <div className="shy-surface-content">
                    {surface.showJoinTip && <div className="shy-surface-content-head h-40" >
                        <JoinTip></JoinTip>
                    </div>}
                    {surface.canAccessPage !== false && <div className="shy-surface-content-box" style={{ height: surface.showJoinTip ? "calc(100vh - 40px)" : "100vh" }}>
                        <SideSln></SideSln>
                        <SupervisorView></SupervisorView>
                    </div>}
                </div>}
            </Route>
            <Route path={ShyUrl.me} exact component={UserChannel}></Route>
            <Route path={ShyUrl.discovery} exact component={DiscoveryView}></Route>
        </div >
    }
    return <></>;
})