import { ViewSurface } from ".";
import { eventBus } from "../core/event/event.bus";
import { EventName } from "../core/event/event.name";
import { PageItem } from "../core/workspace/item";
import { PageItemMenu } from "../core/workspace/menu";
import { Workspace } from "../core/workspace/workspace";

import { User } from "../model/user";
import { DataStore } from "../service/store";
import { UserService } from "../service/user";


export class Surface {
    view: ViewSurface;
    pageItemMenuView: PageItemMenu;
    get isLogin() {
        return this.user ? true : false;
    }
    user: User;
    workspace: Workspace;
    /**
     * 侧栏用户选择的pageitem
     */
    selectedItems: PageItem[] = [];
    /**
     * 右边栏目，用户打开的pageItem
     */
    openItems: PageItem[] = [];
    renameItem: PageItem;
    async mounted() {
        this.user = await UserService.tryLogin();
        /**
         * 根据当前的路由，可以获取当前访问的网页文档Id,或者获取当前用户的workspace域名和id等
         */
        var url = location.href;
        this.workspace = await DataStore.getWorkspace(url);
        var se = this.workspace.find(g => g.url == url);
        if (!se) {
            se = this.workspace.find(g => true);
        }
        if (se) {
            this.selectedItems = [se];
            this.openItems = [se];
        }
        this.view.forceUpdate();
        eventBus.on(EventName.selectPageItem, (item, event) => {
            this.onOpenItem(item, event);
        });
        eventBus.on(EventName.selectPageItemMenu, (item, menuItem, event) => {
            switch (menuItem.name) {
                case 'delete':
                    this.onRemoveItem(item);
                    break;
                case 'rename':
                    this.onRenameItem(item, event);
                    break;
            }
        });
    }
    onOpenItem(item: PageItem, event?: MouseEvent) {
        this.openItems = [item];
        this.view.forceUpdate();
    }
    onRemoveItem(item: PageItem, event?: MouseEvent) {
        this.workspace.remove(g => g == item);
    }
    onRenameItem(item: PageItem, event?: MouseEvent) {
        var oldRename = this.renameItem;
        this.renameItem = item;
        this.renameItem.view.forceUpdate(() => {

        });
        if (oldRename) oldRename.view.forceUpdate();
    }
    onCancelRenameItem() {
        if (this.renameItem) {
            var od = this.renameItem;
            delete this.renameItem;
            if (od) od.view.forceUpdate()
        }
    }
}
export var surface = new Surface();