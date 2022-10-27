import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Bar } from "../bar";
import { createPageContent } from "./page";
import { PageViewStore } from "./store";

@observer
export class PageSupervisorView extends React.Component<{ store: PageViewStore }> {
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
        return <div className="shy-supervisor-view">
            <Bar store={this.props.store}></Bar>
            <div className="shy-supervisor-view-content" ref={e => this.pageEl = e}>
            </div>
        </div>
    }
}