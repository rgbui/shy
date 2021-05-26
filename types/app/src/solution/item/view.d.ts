import React from "react";
import { PageItem } from ".";
export declare class PageItemView extends React.Component<{
    item: PageItem;
    deep?: number;
}> {
    constructor(props: any);
    get item(): PageItem;
    get solution(): import("..").Solution;
    el: HTMLElement;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    mousedown(event: MouseEvent): void;
    inputName(event: Event): void;
    private lastName;
    select(): void;
    inputBlur(): void;
    contextmenu(event: MouseEvent): void;
    render(): JSX.Element;
}
