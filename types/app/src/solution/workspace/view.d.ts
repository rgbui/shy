import React from "react";
import { Workspace } from ".";
import { WorkspaceModule } from "../module/base";
export declare class WorkspaceView extends React.Component<{
    workspace: Workspace;
}> {
    constructor(props: any);
    get workspace(): Workspace;
    renderModule(module: WorkspaceModule): JSX.Element;
    render(): JSX.Element;
}
