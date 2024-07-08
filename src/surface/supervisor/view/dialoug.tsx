import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import ReactDOM from "react-dom";
import { pageLayer, popoverLayer } from "rich/component/lib/zindex";
import { createPageContent } from "./page";
import { PageViewStore } from "./store";
import { surface } from "../../app/store";

@observer
export class PageSupervisorDialog extends React.Component<{ store: PageViewStore }> {
    node: HTMLElement;
    constructor(props) {
        super(props);
        makeObservable(this, {
            loading: observable
        });
        if (!this.node) this.node = document.body.appendChild(document.createElement('div'));
    }
    loading: boolean = false;
    componentDidMount(): void {
        this.load()
    }
    componentDidUpdate(prevProps: Readonly<{ store: PageViewStore; }>, prevState: Readonly<{}>, snapshot?: any): void {
        if (prevProps.store !== this.props.store) {
            if (this.props.store.page) this.props.store.page.cacheFragment()
            this.pageEl.innerHTML = '';
            this.load()
        }
    }
    async load() {
        this.props.store.view = this;
        this.loading = true;
        await createPageContent(this.props.store);
        this.loading = false;
    }
    componentWillUnmount(): void {
        pageLayer.clear(this);
        if (this.props.store.page)
            this.props.store.page.cacheFragment()
        if (this.node) {
            // ReactDOM.unmountComponentAtNode(this.node);
            this.node.remove()
            this.node = null;
        }
    }
    mousedown(event: React.MouseEvent) {
        var ele = event.target as HTMLElement;
        if (ele.classList.contains('mask')) {
            this.onClose();
        }
    }
    async onClose() {
        await this.props.store.page.onSubmitForm();
        surface.supervisor.emit('closeDialog')
    }
    pageEl: HTMLElement;
    render() {
        return ReactDOM.createPortal(<div
            onMouseDown={e => this.mousedown(e)}
            style={{ zIndex: pageLayer.zoom(this) }}
            className="fixed-full mask flex-center"><div style={{ marginTop: 72, marginBottom: 72, height: 'calc(100% - 144px)' }} className="round shadow bg-white relative w-960">
                <div className="shy-supervisor-view-content overflow-y" style={{ height: 'calc(100% - 48px)' }} ref={e => this.pageEl = e}>
                </div>
            </div>
        </div>, this.node)
    }
}