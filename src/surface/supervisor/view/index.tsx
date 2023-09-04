import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React, { CSSProperties } from "react";
import { MouseDragger } from "rich/src/common/dragger";
import { Rect } from "rich/src/common/vector/point";
import { surface } from "../../store";
import { createPageContent } from "./page";
import { PageViewStore } from "./store";
import { Spin } from "rich/component/view/spin";

@observer
export class PageSupervisorView extends React.Component<{
    slide?: boolean,
    style?: CSSProperties,
    store: PageViewStore
}> {
    constructor(props) {
        super(props);
        makeObservable(this, { loading: observable })
    }
    loading: boolean = false;
    componentDidMount(): void {
        this.load();
        document.addEventListener('mousedown', this.dc, true);
    }
    dc = (event: MouseEvent) => {
        var t = event.target as HTMLElement;
        if (this.el && this.props.slide) {
            var sapp = document.querySelector('.shy-app');
            if (!this.el.contains(t) && sapp && sapp.contains(t)) {
                this.onClose()
            }
        }
    }
    async load() {
        this.props.store.view = this;
        this.loading = true;
        await createPageContent(this.props.store);
        this.loading = false;
    }
    componentDidUpdate(prevProps: Readonly<{ store: PageViewStore; }>, prevState: Readonly<{}>, snapshot?: any): void {
        if (this.props?.store?.elementUrl != prevProps?.store?.elementUrl) {
            if (prevProps?.store?.page) prevProps?.store?.page.cacheFragment()
            this.load();
        }
    }
    componentWillUnmount(): void {
        document.removeEventListener('mousedown', this.dc, true);
        if (this.props.store.page)
            this.props.store.page.cacheFragment();
    }
    mousedown(event: React.MouseEvent) {
        var e = (event.target as HTMLElement).closest(".shy-supervisor-view");
        var p = e.parentElement as HTMLElement;
        var r = Rect.fromEle(p);
        MouseDragger({
            event: event,
            cursor: 'col-resize',
            moving(e, d, is) {
                var rp = 100 * (e.clientX - r.left) / r.width;
                rp = Math.round(rp);
                if (rp < 35) rp = 35
                else if (rp > 85) rp = 85;
                surface.supervisor.slide_pos = (100 - rp);
            }
        })
    }
    pageEl: HTMLElement;
    el: HTMLElement;
    render() {
        return <div ref={e => this.el = e} className={"shy-supervisor-view" + (this.props.slide ? " shadow" : "")} style={this.props.style || {}}>
            {this.loading && <Spin block></Spin>}
            <div className="shy-supervisor-view-content" ref={e => this.pageEl = e}>
            </div>
            {this.props.slide && <div onMouseDown={e => this.mousedown(e)} className="cursor-col z-2000 w-10 pos pos-t pos-b pos-l border-left"></div>}
        </div>
    }
    onClose() {
        this.props.store.page.onSubmitForm({ isClose: true, isFormMargin: true });
    }
}