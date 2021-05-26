import React from "react";
import { PageItem } from "../solution/item";
export declare class SupervisorView extends React.Component {
    constructor(props: any);
    get supervisor(): import(".").Supervisor;
    get items(): PageItem[];
    renderItem(item: PageItem): JSX.Element;
    render(): JSX.Element;
}
