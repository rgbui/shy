import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React, { CSSProperties } from "react";
import { Bar } from "../bar";
import { createPageContent } from "./page";
import { PageViewStore } from "./store";

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
    }
    async load() {
        this.props.store.view = this;
        this.loading = true;
        await createPageContent(this.props.store);
        this.loading = false;
    }
    componentDidUpdate(prevProps: Readonly<{ store: PageViewStore; }>, prevState: Readonly<{}>, snapshot?: any): void {
        if (this.props?.store?.elementUrl != prevProps?.store?.elementUrl) {
            if (prevProps?.store) prevProps?.store.page.cacheFragment()
            this.load();
        }
    }
    componentWillUnmount(): void {
        if (this.props.store.page)
            this.props.store.page.cacheFragment();
    }
    pageEl: HTMLElement;
    render() {
        return <div className={"shy-supervisor-view" + (this.props.slide ? " shadow" : "")} style={this.props.style || {}}>
            <Bar store={this.props.store}></Bar>
            <div className="shy-supervisor-view-content" ref={e => this.pageEl = e}>
            </div>
            {this.props.slide && <div className="cursor-col z-2000 w-10 pos pos-t pos-b pos-l border-left"></div>}
        </div>
    }
}