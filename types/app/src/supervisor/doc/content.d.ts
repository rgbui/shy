import React from "react";
import { PageItem } from "../../solution/item";
import { Page } from "rich/src/page";
export declare class DocView extends React.Component<{
    item: PageItem;
}> {
    constructor(props: any);
    get item(): PageItem;
    el: HTMLElement;
    page: Page;
    componentDidMount(): Promise<void>;
    componentWillUnmount(): Promise<void>;
    render(): JSX.Element;
}
