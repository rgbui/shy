import { observer, useLocalObservable } from "mobx-react";
import React from 'react';
import { Loading } from "rich/component/view/loading";
import { MouseDragger } from "rich/src/common/dragger";
import { surface } from "..";
import { CacheKey, yCache } from "../../../net/cache";
import { SideBar } from "./sidebar";
import { SlnView } from "../sln/view";
import { SupervisorView } from "../supervisor/view";
import { UserChannel } from "../user/channel/view";
import { Route } from "react-router";
import { ShyUrl } from "../../history";
import { DiscoveryView } from "../discovery";
import { JoinTip } from "./join";
import { computed } from "mobx";

export var ViewSurface = observer(function () {
    var local = useLocalObservable(() => {
        return {
            slideWidth: 200,
            slideEl: null,
            slideFloatIsShow: false,
            loading: true
        }
    });
    async function load() {
        if (!surface.user.isSign) {
            return surface.user.toSign()
        }
        local.loading = true;
        try {
            var width = await yCache.get<number>(CacheKey.slideWidth);
            if (typeof width == 'number') local.slideWidth = width;
            await surface.loadWorkspace(undefined, await surface.getWsName())
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
    function mousedown(event: React.MouseEvent) {
        MouseDragger<{ event: React.MouseEvent, width: number }>({
            event,
            cursor: 'col-resize',
            moveStart(ev, data) {
                data.event = event;
                data.width = local.slideWidth;
            },
            moving(ev, data, isEnd) {
                var dx = (ev.clientX - data.event.clientX);
                var m = data.width + dx;
                if (m < 200) m = 200;
                if (m > 400) m = 400;
                local.slideEl.style.width = m + 'px';
                local.slideEl.classList.add('dragging');
                if (isEnd) {
                    local.slideEl.classList.remove('dragging');
                    local.slideWidth = m;
                    yCache.set(CacheKey.slideWidth, m);
                }
            }
        })
    }
    function mouseleave(event: React.MouseEvent) {
        if (surface.isShowSln == false) {
            local.slideFloatIsShow = false;
        }
    }
    function mousenter(event: React.MouseEvent) {
        if (surface.isShowSln == false) {
            local.slideFloatIsShow = true;
        }
    }
    if (local.loading) return <div className='shy-surface-loading'><Loading /></div>
    else {
        var isShowTip = computed(() => surface.temporaryWs && surface.temporaryWs?.accessJoinTip == true);
        return <div className='shy-surface'>
            {surface.config.showSideBar && surface.isShowSln && <SideBar></SideBar>}
            <Route path={[ShyUrl.ws, ShyUrl.page]}>
                {surface.workspace && <div className="shy-surface-content">
                    {isShowTip && <div className="shy-surface-content-head" style={{ height: 40 }}>
                        <JoinTip></JoinTip>
                    </div>}
                    <div className="shy-surface-content-box" style={{ height: isShowTip ? "calc(100vh - 40px)" : "100vh" }}>
                        <div
                            onMouseLeave={mouseleave}
                            onMouseEnter={mousenter}
                            className={'shy-slide' + (surface.isShowSln ? "" : (local.slideFloatIsShow ? " float" : " float-hide"))}
                            ref={e => local.slideEl = e}
                            style={{ width: local.slideWidth }}>
                            <SlnView></SlnView>
                            {surface.isShowSln && <div className='shy-slide-resize' onMouseDown={mousedown}></div>}
                        </div><div className='shy-slide-reaction'></div>
                        <SupervisorView></SupervisorView>
                    </div>
                </div>}
            </Route>
            <Route path={ShyUrl.me} exact component={UserChannel}></Route>
            <Route path={ShyUrl.discovery} exact component={DiscoveryView}></Route>
        </div >
    }
    return <></>;
})