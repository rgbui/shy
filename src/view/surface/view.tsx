import React from "react";
import { surface } from ".";
import { SlnView } from "../sln/view";
import { SupervisorView } from "../supervisor/view";
import { MouseDragger } from "rich/src/common/dragger";
import { CacheKey, yCache } from "../../../net/cache";
import { Loading } from "rich/component/view/loading";
import { SiteView } from "../site/production";
import { SideBar } from "./sidebar";
export class ViewSurface extends React.Component {
    constructor(props) {
        super(props);
        surface.view = this;
    }
    async componentDidMount() {
        var width = await yCache.get<number>(CacheKey.slideWidth);
        if (typeof width == 'number') {
            if (this.slideWidth != width) { this.slideWidth = width; this.forceUpdate() }
        }
        if (!surface.isSuccessfullyLoaded) {
            await surface.load();
            if (surface.isSuccessfullyLoaded) this.forceUpdate();
        }
    }
    mousedown(event: React.MouseEvent) {
        var self = this;
        MouseDragger<{ event: React.MouseEvent, width: number }>({
            event,
            cursor: 'col-resize',
            moveStart(ev, data) {
                data.event = event;
                data.width = self.slideWidth;
            },
            moving(ev, data, isEnd) {
                var dx = (ev.clientX - data.event.clientX);
                var m = data.width + dx;
                if (m < 200) m = 200;
                if (m > 400) m = 400;
                self.slideEl.style.width = m + 'px';
                self.slideEl.classList.add('dragging');
                if (isEnd) {
                    self.slideEl.classList.remove('dragging');
                    self.slideWidth = m;
                    yCache.set(CacheKey.slideWidth, m);
                }
            }
        })
    }
    mouseleave(event: React.MouseEvent) {
        if (surface.isShowSln == false) {
            this.slideFloatIsShow = false;
            this.forceUpdate()
        }
    }
    mousenter(event: React.MouseEvent) {
        if (surface.isShowSln == false) {
            this.slideFloatIsShow = true;
            this.forceUpdate()
        }
    }
    slideWidth: number = 200;
    slideEl: HTMLElement;
    slideFloatIsShow: boolean = false;
    render() {
        if (!surface.user.isSign) return <SiteView></SiteView>
        return <div className='shy-surface'>{
            surface.isSuccessfullyLoaded && <>
                {surface.config.showSideBar && surface.isShowSln && <SideBar></SideBar>}
                <div
                    onMouseLeave={e => this.mouseleave(e)}
                    onMouseEnter={e => this.mousenter(e)}
                    className={'shy-slide' + (surface.isShowSln ? "" : (this.slideFloatIsShow ? " float" : " float-hide"))}
                    ref={e => this.slideEl = e}
                    style={{ width: this.slideWidth }}>
                    <SlnView ></SlnView>
                    <div className='shy-slide-resize' onMouseDown={e => this.mousedown(e)}></div>
                </div>
                {!surface.isShowSln && <div className='shy-slide-reaction'></div>}
                <SupervisorView></SupervisorView>
            </>
        }{!surface.isSuccessfullyLoaded && <div className='shy-surface-loading'><Loading /></div>}
        </div>
    }
}