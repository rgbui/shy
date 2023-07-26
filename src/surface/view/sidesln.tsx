import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { MouseDragger } from "rich/src/common/dragger";
import { surface } from "../store";
import { yCache, CacheKey } from "../../../net/cache";
import { SlnView } from "../sln/view";
import { isMobileOnly } from "react-device-detect";

export var SideSln = observer(function () {
    var local = useLocalObservable(() => {
        return {
            slideWidth: 200,
            slideEl: null,
            slideFloatIsShow: false
        }
    });
    async function load() {
        var width = await yCache.get<number>(CacheKey.slideWidth);
        if (typeof width == 'number') local.slideWidth = width;
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
    if (surface.isDefineWorkspaceMenu) return <></>
    return surface.showSln && <><div className={'shy-slide'}
        ref={e => local.slideEl = e}
        style={{
            width: isMobileOnly && surface.mobileSlnSpread === true ? '100%' : local.slideWidth,
            display: surface.supervisor.page && (isMobileOnly && surface.mobileSlnSpread !== true || surface.slnSpread === false) ? "none" : undefined
        }}>
        <SlnView></SlnView>
        <div className='shy-slide-resize' onMouseDown={mousedown}></div>
    </div>
    </>
})