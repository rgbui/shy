import { Events } from "rich/src/util/events";
import { PageItemMenu } from "./extensions/menu";
import { PageItem } from "./item";
import { WorkspaceModule } from "./module/base";
import { SolutionOperator } from "./operator";
import { SolutionView } from "./view";
import { Workspace } from "./workspace";
export declare class Solution extends Events<SolutionOperator> {
    constructor();
    /**
     * 右键菜单
     */
    menu: PageItemMenu;
    workspace: Workspace;
    /**
     * 当前选择的
     */
    selectItems: PageItem[];
    /**
     * 当前正在编辑名称的pageItem
     */
    editItem: PageItem;
    _keys: string[];
    view: SolutionView;
    private init;
    loadWorkspace(): Promise<void>;
    onOpenItemMenu(item: PageItem, event: MouseEvent): void;
    onMousedownItem(item: PageItem, event: MouseEvent): void;
    onEditItem(item: PageItem): void;
}
export interface Solution {
    on(name: SolutionOperator.openItem, fn: (item: PageItem) => void): any;
    emit(name: SolutionOperator.openItem, item: PageItem): any;
    emit(name: SolutionOperator.addSubPageItem, item: PageItem): any;
    on(name: SolutionOperator.addSubPageItem, fn: (item: PageItem) => void): any;
    emit(name: SolutionOperator.removePageItem, item: PageItem): any;
    on(name: SolutionOperator.removePageItem, fn: (item: PageItem) => void): any;
    emit(name: SolutionOperator.changePageItemName, item: PageItem): any;
    on(name: SolutionOperator.changePageItemName, fn: (item: PageItem) => void): any;
    emit(name: SolutionOperator.toggleModule, module: WorkspaceModule): any;
    on(name: SolutionOperator.toggleModule, fn: (module: WorkspaceModule) => void): any;
    emit(name: SolutionOperator.togglePageItem, item: PageItem): any;
    on(name: SolutionOperator.togglePageItem, fn: (item: PageItem) => void): any;
}
