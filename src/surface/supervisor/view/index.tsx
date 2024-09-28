import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React, { CSSProperties } from "react";
import { MouseDragger } from "rich/src/common/dragger";
import { Rect } from "rich/src/common/vector/point";
import { surface } from "../../app/store";
import { createPageContent } from "./page";
import { PageViewStore } from "./store";
import { SK } from "rich/component/view/spin";
import { Divider } from "rich/component/view/grid";
import lodash from "lodash";

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
                this.onCloseSlide()
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
        if (this.props?.store?.elementUrl !== prevProps?.store?.elementUrl) {
            if (prevProps?.store?.page) prevProps?.store?.page.cacheFragment()
            this.load();
        }
        else {
            if (this.props?.store?.elementUrl && !this.props.store?.page) {
                this.load();
            }
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
        var style = lodash.cloneDeep(this.props.style || {});
        if (this.props.slide) {
            style.boxShadow = `rgba(15, 15, 15, 0.04) 0px 0px 0px 1px, rgba(15, 15, 15, 0.03) 0px 3px 6px, rgba(15, 15, 15, 0.06) 0px 9px 24px`
        }
        return <div ref={e => this.el = e} className={"shy-supervisor-view "} style={style}>
            {this.loading && <SK className='pos-full flex flex-col flex-full' style={{ zIndex: 1 }}>
                <div className='flex flex-fixed '>
                    <div className='h-20 w-300 sk-bg gap-l-30 gap-h-10'></div>
                </div>
                <Divider></Divider>
                <div className='flex-auto'>
                    <div className='gap-30 sk-bg' style={{ height: 'calc(100% - 60px)' }}></div>
                </div>
            </SK>}
            <div className="shy-supervisor-view-content" ref={e => this.pageEl = e}></div>
            {this.props.slide && <div onMouseDown={e => this.mousedown(e)} className="cursor-col z-2000 w-10 pos pos-t pos-b pos-l border-left-light"></div>}
        </div>
    }
    async onCloseSlide() {
        await this.props.store.page.onSubmitForm('close-save');
        surface.supervisor.emit('closeSlide');
    }
}