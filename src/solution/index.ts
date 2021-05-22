import { Events } from "rich/src/util/events";
import { WorkspaceStore } from "../service/store/workspace";
import { PageItemMenu } from "./extensions/menu";
import { PageItem } from "./item";
import { SolutionView } from "./view";
import { Workspace } from "./workspace";

export class Solution extends Events {
    /**
     * 右键菜单
     */
    menu: PageItemMenu;
    workspace: Workspace;
    /**
     * 当前打开的
     */
    openItems: PageItem[] = [];
    /**
     * 当前选择的
     */
    selectItems: PageItem[] = [];
    /**
     * 当前正在编辑名称的pageItem
     */
    editItem: PageItem;
    _keys: string[] = [];
    view: SolutionView;
    async loadWorkspace() {
        var url = location.href;
        this.workspace = await WorkspaceStore.getWorkspace(url);
    }
}