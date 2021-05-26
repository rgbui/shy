import React from "react";
import { PageItem } from "../../item";
import { Workspace } from "../../workspace";
import { WorkspaceModule } from "../base";
import { WorkspaceModuleType } from "../enum";
export declare class PagesViewModule extends WorkspaceModule {
    type: WorkspaceModuleType;
    text: string;
    items: PageItem[];
    spread: boolean;
    workspace: Workspace;
    view: PagesViewModuleView;
    get solution(): import("../..").Solution;
    onAddItem(): void;
}
export declare class PagesViewModuleView extends React.Component<{
    module: PagesViewModule;
}> {
    constructor(props: any);
    get module(): PagesViewModule;
    render(): JSX.Element;
}
