import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { MouseDragger } from "rich/src/common/dragger";
import { surface } from "../store";
import { yCache, CacheKey } from "../../../../net/cache";
import { SlnView } from "../../sln/view";
import { isMobileOnly } from "react-device-detect";
import "./style.less";

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
        document.addEventListener('mousemove', mousemove);
        return () => {
            document.removeEventListener('mousemove', mousemove);
        }
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
    function mousemove(e: MouseEvent) {
        var ele = local.slideEl;
        if (ele) {
            var bound = ele.getBoundingClientRect();
            if (e.clientX > bound.right - 10 && e.clientX < bound.right + 10) {
                var r = ele.querySelector('.shy-slide-resize') as HTMLElement;
                if (r) {
                    r.style.opacity = '1';
                }
            }
            else {
                var r = ele.querySelector('.shy-slide-resize') as HTMLElement;
                if (r) {
                    r.style.opacity = '0';
                }
            }
        }
    }
    if (surface?.workspace?.isPubSiteHideMenu) return <></>
    var classList: string[] = ['shy-slide'];
    if (surface?.workspace?.isPubSiteDefineBarMenu) {
        classList.push('shy-slide-define-default')
    }
    return surface.showSln && <>
        <div className={classList.join(" ")}
            ref={e => local.slideEl = e}
            style={{
                marginTop: surface?.workspace?.isPubSiteDefineBarMenu?48:undefined,
                width: isMobileOnly && surface.mobileSlnSpread === true ? '100%' : local.slideWidth,
                display: surface.supervisor.page && (isMobileOnly && surface.mobileSlnSpread !== true || surface.slnSpread === false) ? "none" : undefined
            }}>
            <SlnView></SlnView>
            {<div className='shy-slide-resize' onMouseDown={mousedown}></div>}
        </div>
    </>
})