import { makeObservable, observable } from "mobx";
import React from "react";
import ReactDOM from "react-dom";
import { popoverLayer } from "rich/component/lib/zindex";
import { Bar } from "../bar";
import { createPageContent } from "./page";
import { PageViewStore } from "./store";
export class PageSupervisorDialog extends React.Component<{ store: PageViewStore }> {
    node: HTMLElement;
    constructor(props) {
        super(props);
        makeObservable(this, { loading: observable });
        if (!this.node) this.node = document.body.appendChild(document.createElement('div'));
    }
    loading: boolean = false;
    componentDidMount(): void {
        this.props.store.view = this;
        this.loading = true;
        createPageContent(this.props.store);
        this.loading = false;
    }
    componentWillUnmount(): void {
        popoverLayer.clear(g => g.obj === this);
        if (this.props.store.page)
            this.props.store.page.cacheFragment();
        if (this.node) {
            ReactDOM.unmountComponentAtNode(this.node);
            this.node.remove()
        }
    }
    mousedown(event: React.MouseEvent) {
        var ele = event.target as HTMLElement;
        if (ele.className == 'shy-supervisor-dialog-mask') {
            this.onClose();
        }
    }
    onClose() {
        this.props.store.emit('close');
    }
    pageEl: HTMLElement;
    render() {
        return ReactDOM.createPortal(<div onMouseDown={e => this.mousedown(e)} style={{ zIndex: popoverLayer.zoom(this) }} className="shy-supervisor-dialog-mask"><div className="shy-supervisor-dialog">
            <Bar store={this.props.store}></Bar>
            <div className="shy-supervisor-view-content" ref={e => this.pageEl = e}>
            </div>
        </div></div>, this.node)
    }
}