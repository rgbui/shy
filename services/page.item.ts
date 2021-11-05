import lodash from "lodash";
import { util } from "rich/util/util";
import { masterSock } from "../net/sock";
import { PageItem } from "../src/view/surface/sln/item";
enum ItemOperatorDirective {
    update = 1,
    insert = 2,
    remove = 3,
    inc = 4,
}
enum ItemOperator {
    /**
     * 创建
     */
    insertAfter = 1,
    append = 2,
    /**
     * 删除
     */
    delete = 3,
    /**
     * 更新标题
     */
    update = 4,
    /**
     * 移动元素
     */
    moveAppend = 5,
    moveAfter = 6,
}

type PageItemAction = {
    directive: ItemOperatorDirective,
    filter?: Record<string, any>,
    pageId?: string,
    data?: Record<string, any>
}
class PageItemStore {
    private async save(wsId: string, operator: {
        operator: ItemOperator,
        actions: PageItemAction[]
    }) {
        await masterSock.post('/page/item/operator', { wsId, operator })
    }
    public async deletePageItem(pageItem: PageItem) {
        var actions: PageItemAction[] = [];
        var pa = pageItem.parent;
        if (pa.checkedHasChilds && pa.childs.length > 0) {
            lodash.remove(pa.childs, g => g.id == pageItem.id);
        }
        actions.push({ directive: ItemOperatorDirective.remove, pageId: pageItem.id });
        await this.save(pageItem.workspace.id, { operator: ItemOperator.delete, actions });
    }
    public async updatePageItem(pageItem: PageItem, data: Record<string, any>) {
        var actions: PageItemAction[] = [];
        actions.push({ directive: ItemOperatorDirective.update, pageId: pageItem.id, data });
        await this.save(pageItem.workspace.id, { operator: ItemOperator.update, actions });
        Object.assign(pageItem, data);
    }
    public async appendPageItem(pageItem: PageItem, data: Record<string, any>) {
        if (pageItem.checkedHasChilds) {
            var actions: PageItemAction[] = [];
            data.id = util.guid();
            data.workspaceId = pageItem.workspaceId;
            data.parentId = pageItem.id;
            data.at = 0;
            var newItem = new PageItem();
            newItem.load(data);
            if (pageItem.childs.length > 0) {
                actions.push({ directive: ItemOperatorDirective.update, filter: { parentId: pageItem.parentId, at: { $gte: 0 } } });
            }
            pageItem.childs.splice(0, 0, newItem);
            actions.push({ directive: ItemOperatorDirective.insert, data });
            await this.save(pageItem.workspace.id, { operator: ItemOperator.append, actions });
            return newItem;
        }
        else await this.insertAfterPageItem(pageItem, data);
    }
    public async insertAfterPageItem(pageItem: PageItem, data: Record<string, any>) {
        var actions: PageItemAction[] = [];
        var at = pageItem.parent.childs.findIndex(g => g.id == pageItem.id);
        data.id = util.guid();
        data.workspaceId = pageItem.workspaceId;
        data.parentId = pageItem.parentId;
        data.at = at;
        var newItem = new PageItem();
        newItem.load(data);
        pageItem.parent.childs.splice(at, 0, newItem);
        var actions: PageItemAction[] = [];
        actions.push({ directive: ItemOperatorDirective.inc, filter: { parentId: pageItem.parentId, at: { $gte: at } } })
        actions.push({ directive: ItemOperatorDirective.insert, data });
        await this.save(pageItem.workspace.id, { operator: ItemOperator.insertAfter, actions })
        return newItem;
    }
    public async moveAppendPageItem(pageItem: PageItem, parentItem: PageItem) {
        if (parentItem.parent == parentItem && !parentItem.prev) return;
        var actions: PageItemAction[] = [];
        lodash.remove(pageItem.parent?.childs, g => g.id == pageItem.id);
        pageItem.parentId = parentItem.id;
        if (parentItem.childs.length > 0) {
            actions.push({ directive: ItemOperatorDirective.update, filter: { parentId: parentItem.id, at: { $gte: 0 } } });
        }
        parentItem.childs.splice(0, 0, pageItem);
        actions.push({ directive: ItemOperatorDirective.update, pageId: pageItem.id, data: { at: 0, parentId: pageItem.parentId } })
        await this.save(pageItem.workspace.id, { operator: ItemOperator.moveAppend, actions })
    }
    public async moveToPageItem(pageItem: PageItem, toPageItem: PageItem) {
        if (pageItem.prev == toPageItem) return;
        var actions: PageItemAction[] = [];
        var next = toPageItem.next;
        if (next) {
            if (next.at - 1 == toPageItem.at) {
                actions.push({ directive: ItemOperatorDirective.update, filter: { parentId: toPageItem.parent.id, at: { $gte: next.at } } });
            }
        }
        var currentAt = toPageItem.parent.childs.findIndex(g => g.id == toPageItem.id);
        toPageItem.parent.childs.splice(currentAt + 1, 0, pageItem);
        actions.push({ directive: ItemOperatorDirective.update, pageId: pageItem.id, data: { at: toPageItem.at + 1, parentId: toPageItem.parent.id } })
        await this.save(pageItem.workspace.id, { operator: ItemOperator.moveAppend, actions })
    }
}

export var pageItemStore = new PageItemStore();