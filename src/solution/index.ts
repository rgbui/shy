import { Events } from "rich/src/util/events";
import { KeyboardPlate } from "rich/src/common/keys";
import { PageItemMenu } from "./extensions/menu";
import { PageItem } from "./item";
import { Mime } from "./item/mine";
import { WorkspaceModule } from "./module/base";
import { SolutionOperator } from "./operator";
import { SolutionView } from "./view";
import { Workspace } from "./workspace";
import { workspaceService } from "./service";
import { SyHistory } from "../history";

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
    view: SolutionView;
    keyboardPlate = new KeyboardPlate();
    private init() {

    }
    async loadWorkspace() {
        var rr = await workspaceService.loadWorkSpace();
        if (rr.ok) {

        }
        else SyHistory.push('/work/create')
        // var url = location.href;
        // this.workspace = await WorkspaceStore.getWorkspace(url);
        // var item = this.workspace.find(g => g.mime == Mime.page);
        // this.selectItems = item ? [item] : [];
        // if (item)
        //     this.emit(SolutionOperator.openItem, item);
    }
    onOpenItemMenu(item: PageItem, event: MouseEvent) {
        this.menu.openItem(item, event);
    }
    onMousedownItem(item: PageItem, event: MouseEvent) {
        if (!this.selectItems.exists(g => g === item)) {
            item.selectedDate = new Date().getTime();
            var lastItems = this.selectItems.map(o => o);
            this.selectItems = [item];
            lastItems.each(item => item.view.forceUpdate())
            item.view.forceUpdate();
            this.emit(SolutionOperator.openItem, item);
        }
        else {
            item.selectedDate = new Date().getTime();
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
                this.editItem.view.select();
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
    emit(name: SolutionOperator.addSubPageItem, item: PageItem);
    on(name: SolutionOperator.addSubPageItem, fn: (item: PageItem) => void);
    emit(name: SolutionOperator.removePageItem, item: PageItem);
    on(name: SolutionOperator.removePageItem, fn: (item: PageItem) => void);
    emit(name: SolutionOperator.changePageItemName, item: PageItem);
    on(name: SolutionOperator.changePageItemName, fn: (item: PageItem) => void);
    emit(name: SolutionOperator.toggleModule, module: WorkspaceModule);
    on(name: SolutionOperator.toggleModule, fn: (module: WorkspaceModule) => void);
    emit(name: SolutionOperator.togglePageItem, item: PageItem);
    on(name: SolutionOperator.togglePageItem, fn: (item: PageItem) => void);
}