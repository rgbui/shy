import { Events } from "rich/src/util/events";
import { WorkspaceStore } from "../service/store/workspace";
import { PageItemMenu } from "./extensions/menu";
import { PageItem } from "./item";
import { Mime } from "./item/mine";
import { SolutionOperator } from "./operator";
import { SolutionView } from "./view";
import { Workspace } from "./workspace";

export class Solution extends Events<SolutionOperator> {
    constructor() {
        super();
        this.init()
    }
    /**
     * 右键菜单
     */
    menu: PageItemMenu;
    workspace: Workspace;
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
    private init() {

    }
    async loadWorkspace() {
        var url = location.href;
        this.workspace = await WorkspaceStore.getWorkspace(url);
        var item = this.workspace.find(g => g.mime == Mime.page);
        this.selectItems = item ? [item] : [];
        if (item)
            this.emit(SolutionOperator.openItem, item);
    }
    onOpenItemMenu(item: PageItem, event: MouseEvent) {
        this.menu.openItem(item, event);
    }
    onMousedownItem(item: PageItem, event: MouseEvent) {
        if (!this.selectItems.exists(g => g === item)) {
            var lastItems = this.selectItems.map(o => o);
            this.selectItems = [item];
            lastItems.each(item => item.view.forceUpdate())
            item.view.forceUpdate();
            this.emit(SolutionOperator.openItem, item);
        }
    }
    onEditItem(item: PageItem) {
        var lastEditItem: PageItem;
        if (this.editItem && this.editItem != item) {
            lastEditItem = this.editItem;
        }
        if (item) {
            this.editItem = item;
            this.editItem.view.forceUpdate(() => {

            })
        }
        else this.editItem = null;
        if (lastEditItem) {
            lastEditItem.view.forceUpdate();
        }
    }
}

export interface Solution {
    on(name: SolutionOperator.openItem, fn: (item: PageItem) => void);
    emit(name: SolutionOperator.openItem, item: PageItem);
}