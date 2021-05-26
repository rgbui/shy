import React from "react";
import { PageItem } from "../item";
import { Workspace } from "../workspace";
import { WorkspaceModuleType } from "./enum";
export declare class WorkspaceModule {
    constructor(workspace: Workspace);
    id: string;
    date: number;
    type: WorkspaceModuleType;
    text: string;
    items: PageItem[];
    spread: boolean;
    workspace: Workspace;
    load(data: any): void;
    get(): {
        type: WorkspaceModuleType;
        text: string;
        items: any[];
        spread: boolean;
    };
    view: React.Component;
    onSpread(spread?: boolean): void;
}
