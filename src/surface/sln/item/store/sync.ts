import lodash from "lodash";
import { runInAction } from "mobx";
import { PageItem } from "..";
import { surface } from "../../../app/store";
import { Workspace } from "../../../workspace";
import { Mime } from "../../declare";

export enum ItemOperatorDirective {
    update = 1,
    insert = 2,
    remove = 3,
    inc = 4,

    favouriteInsert = 10,
    favouriteRemove = 11,
    favouriteInc = 12
}

export enum ItemOperator {
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
    sync = 7
}

export type PageItemAction = {
    directive: ItemOperatorDirective,
    filter?: Record<string, any>,
    pageId?: string,
    data?: Record<string, any>,
    extra?: Record<string, any>
}

class PageItemStore {
    private async save(wsId: string, operate: {
        operate: ItemOperator,
        actions: PageItemAction[]
    }) {
        return await surface.workspace.sock.put<{ actions: any[] }>('/view/operate/sync', {
            wsId,
            operate,
            schema: 'PageItem',
            sockId: surface.workspace.tim.id
        })
    }
    public async deletePageItem(pageItem: PageItem) {
        var actions: PageItemAction[] = [];
        var pa = pageItem.parent;
        runInAction(() => {
            if (pa) lodash.remove(pa.childs, g => g.id == pageItem.id);
            else lodash.remove(surface.workspace.childs, g => g.id == pageItem.id)
        })
        surface.sln.onDeleteRefocusItem(pageItem);
        actions.push({ directive: ItemOperatorDirective.remove, pageId: pageItem.id, data: { parentId: pageItem.parentId } });
        await this.save(pageItem.workspace.id, { operate: ItemOperator.delete, actions });
        if (typeof pageItem?.parent?.subCount == 'number') {
            pageItem.parent.subCount = pageItem.parent.subCount - 1;
        }
    }
    public async updatePage(id: string, data: Record<string, any>, wsId?: string) {
        var cloneData = lodash.cloneDeep(data);
        var actions: PageItemAction[] = [];
        actions.push({ directive: ItemOperatorDirective.update, pageId: id, data });
        await this.save(wsId || surface.workspace?.id, { operate: ItemOperator.update, actions });

    }
    public async updatePageItem(pageItem: PageItem, data: Record<string, any>) {
        var cloneData = lodash.cloneDeep(data);
        var actions: PageItemAction[] = [];
        actions.push({ directive: ItemOperatorDirective.update, pageId: pageItem.id, data });
        await this.save(pageItem.workspace.id, { operate: ItemOperator.update, actions });
        runInAction(() => {
            Object.assign(pageItem, cloneData);
        })
    }
    public async appendPageItem(pageItem: PageItem, data: Record<string, any>, pos: 'last' | 'pre' = 'last') {
        if (!Array.isArray(pageItem.childs)) pageItem.childs = [];
        if (pageItem.childs.length == 0 && pos == 'pre') {
            pos = 'last';
        }
        var actions: PageItemAction[] = [];
        if (typeof data.id == 'undefined') data.id = window.shyConfig.guid();
        data.workspaceId = pageItem.workspaceId;
        data.parentId = pageItem.id;
        if (pos == 'pre') data.at = 0;
        else data.at = pageItem.childs.last() ? (pageItem.childs.last().at + 1) : 0;
        var newItem = new PageItem();
        newItem.checkedHasChilds = true;
        newItem.load(data);
        runInAction(() => {
            pageItem.spread = true;
            if (pos == 'pre') {
                pageItem.childs.forEach(c => {
                    c.at += 1;
                })
                actions.push({ directive: ItemOperatorDirective.inc, filter: { parentId: pageItem.id, at: { $gte: 0 } } });
                pageItem.childs.splice(0, 0, newItem)
            }
            else pageItem.childs.push(newItem);
            pageItem.subCount = pageItem.childs.length;
        })
        actions.push({ directive: ItemOperatorDirective.insert, data });
        var r = await this.save(pageItem.workspace.id, { operate: ItemOperator.append, actions });
        if (r.ok && Array.isArray(r.data.actions)) {
            var re = r.data.actions.find(g => g && g.id == newItem.id);
            if (re) {
                newItem.load(re);
            }
        }
        return newItem;
    }
    /**
     * 
     * @param pageItem 
     * @param data 
     * @returns 
     */
    public async insertAfterPageItem(pageItem: PageItem, data: Record<string, any>) {
        var actions: PageItemAction[] = [];
        var at = pageItem.at;
        var index = pageItem.index;
        var next = pageItem.next;
        var oldPs = pageItem.parent ? pageItem.parent.childs : surface.workspace.childs;
        var ns = oldPs.findAll((g, i) => i > index);
        data.id = window.shyConfig.guid();
        data.workspaceId = pageItem.workspaceId;
        data.parentId = pageItem.parentId;
        data.at = pageItem.at + 1;
        data.subCount = 0;
        var newItem = new PageItem();
        newItem.checkedHasChilds = true;
        newItem.load(data);
        var actions: PageItemAction[] = [];
        runInAction(() => {
            if (next) {
                if (next.at == pageItem.at) {
                    var nextAt = next.at;
                    ns.forEach((n, g) => {
                        var shouldAt = nextAt + 2 + g;
                        n.at = shouldAt;
                        actions.push({ directive: ItemOperatorDirective.update, pageId: n.id, data: { at: n.at } });
                    })
                }
                else if (next.at - 1 == pageItem.at) {
                    /***
                     * 正常的排序
                     */
                    ns.forEach(n => {
                        n.at += 1;
                    })
                    actions.push({ directive: ItemOperatorDirective.inc, filter: { parentId: pageItem.parentId || null, at: { $gt: at } } })
                }
            }
            if (pageItem.parent)
                oldPs.splice(index + 1, 0, newItem);
            if (pageItem.parent)
                pageItem.parent.subCount = oldPs.length;
        })
        actions.push({ directive: ItemOperatorDirective.insert, data });
        var r = await this.save(pageItem.workspace.id, { operate: ItemOperator.insertAfter, actions })
        if (r.ok && Array.isArray(r.data.actions)) {
            var re = r.data.actions.find(g => g && g.id == newItem.id);
            if (re) {
                newItem.load(re);
            }
        }
        return newItem;
    }
    public async createFolder(workspace: Workspace, data: Record<string, any>, next?: PageItem) {
        if (next) {
            var newBlock = await this.insertAfterPageItem(next, data);
            (next.parent?.childs || surface.workspace.childs).splice(next.index + 1, 0, newBlock);
            return newBlock;
        }
        else {
            var actions: PageItemAction[] = [];
            data.id = window.shyConfig.guid();
            data.workspaceId = workspace.id;
            data.at = (workspace.childs.last()?.at || 0) + 1;
            data.subCount = 0;
            data.mime = Mime.pages;
            var newItem = new PageItem();
            newItem.checkedHasChilds = true;
            newItem.load(data);
            actions.push({ directive: ItemOperatorDirective.insert, data });
            var r = await this.save(data.workspaceId, { operate: ItemOperator.insertAfter, actions })
            if (r.ok && Array.isArray(r.data.actions)) {
                var re = r.data.actions.find(g => g && g.id == newItem.id);
                if (re) {
                    newItem.load(re);
                }
            }
            surface.workspace.childs.push(newItem);
            return newItem;
        }
    }
    public async movePrependPageItem(pageItem: PageItem, parentItem: PageItem) {
        if (pageItem.parent == parentItem && !pageItem.prev) return;
        var oldParentId = pageItem.parentId;
        var oldPs = oldParentId ? pageItem.parent.childs : surface.workspace.childs;
        var actions: PageItemAction[] = [];
        runInAction(() => {
            if (parentItem.childs.length > 0 && parentItem.childs.first().at == 0) {
                parentItem.childs.forEach(c => {
                    c.at += 1;
                })
                actions.push({ directive: ItemOperatorDirective.inc, filter: { parentId: parentItem.id, at: { $gte: 0 } } });
            }
            lodash.remove(oldPs, g => g.id == pageItem.id);
            if (pageItem.parent) pageItem.parent.subCount = oldPs.length;
            pageItem.parentId = parentItem.id;
            pageItem.at = 0;
            parentItem.childs.splice(0, 0, pageItem);
            parentItem.subCount = parentItem.childs.length;
        })
        actions.push({ directive: ItemOperatorDirective.update, pageId: pageItem.id, data: { at: 0, parentId: pageItem.parentId || null }, extra: { parentId: oldParentId == parentItem?.id ? undefined : oldParentId } })
        await this.save(pageItem.workspace.id, { operate: ItemOperator.moveAppend, actions })
    }
    /**
     * 
     * @param pageItem 
     * @param toPageItem 
     * @returns 
     */
    public async moveToAfterPageItem(pageItem: PageItem, toPageItem: PageItem) {
        if (pageItem.prev == toPageItem) return;
        var actions: PageItemAction[] = [];
        var next = toPageItem.next;
        var oldParentId = pageItem.parentId;
        var oldPs = oldParentId && pageItem.parent ? pageItem.parent.childs : surface.workspace.childs;
        var toPs = toPageItem.parentId && toPageItem.parent ? toPageItem.parent.childs : surface.workspace.childs;
        runInAction(() => {
            lodash.remove(oldPs, g => g.id == pageItem.id);
            if (pageItem.parent)
                pageItem.parent.subCount = oldPs.length;
            if (next) {
                var ns = toPs.findAll((g, i) => i >= next.index);
                if (next.at - 1 == toPageItem.at) {
                    /**这是正常的排序 */
                    actions.push({ directive: ItemOperatorDirective.inc, filter: { parentId: toPageItem.parent?.id, at: { $gte: next.at } } });
                    ns.forEach(n => {
                        n.at += 1;
                    })
                }
                else if (next.at == toPageItem.at) {
                    /**
                     * 这是不正常的排序,需要纠正一下
                     */
                    var nextAt = next.at;
                    ns.forEach((n, g) => {
                        var shouldAt = nextAt + 2 + g;
                        n.at = shouldAt;
                        actions.push({ directive: ItemOperatorDirective.update, pageId: n.id, data: { at: n.at } });
                    })
                }
            }
            pageItem.parentId = toPageItem.parentId;
            var currentAt = toPs.findIndex(g => g.id == toPageItem.id);
            toPs.splice(currentAt + 1, 0, pageItem);
            if (toPageItem.parent) toPageItem.parent.subCount = toPs.length;
            pageItem.at = toPageItem.at + 1;
        })
        actions.push({
            directive: ItemOperatorDirective.update,
            pageId: pageItem.id,
            data: { at: toPageItem.at + 1, parentId: toPageItem.parent?.id },
            extra: { parentId: oldParentId == toPageItem?.parentId ? undefined : oldParentId }
        })
        await this.save(pageItem.workspace.id, { operate: ItemOperator.moveAfter, actions })
    }
    public async moveToBeforePageItem(pageItem: PageItem, beforePageItem: PageItem) {
        if (pageItem.next == beforePageItem) return;
        var actions: PageItemAction[] = [];
        var prev = beforePageItem.prev;
        var oldParentId = pageItem.parentId;
        var oldPs = oldParentId ? pageItem.parent.childs : surface.workspace.childs;
        var toPs = beforePageItem.parentId ? beforePageItem.parent.childs : surface.workspace.childs;
        runInAction(() => {
            lodash.remove(oldPs, g => g.id == pageItem.id);
            if (pageItem.parent)
                pageItem.parent.subCount = oldPs.length;
            if (prev) {
                var ns = toPs.findAll((g, i) => i >= beforePageItem.index);
                if (prev.at + 1 == beforePageItem.at) {
                    /**这是正常的排序 */
                    actions.push({ directive: ItemOperatorDirective.inc, filter: { parentId: beforePageItem.parent?.id || null, at: { $gte: beforePageItem.at } } });
                    ns.forEach(n => {
                        n.at += 1;
                    })
                }
                else if (prev.at == beforePageItem.at) {
                    /**
                     * 这是不正常的排序,需要纠正一下
                     */
                    var nextAt = prev.at;
                    ns.forEach((n, g) => {
                        var shouldAt = nextAt + 2 + g;
                        n.at = shouldAt;
                        actions.push({ directive: ItemOperatorDirective.update, pageId: n.id, data: { at: n.at } });
                    })
                }
            }
            pageItem.parentId = beforePageItem.parentId;
            var currentAt = toPs.findIndex(g => g.id == beforePageItem.id);
            toPs.splice(currentAt, 0, pageItem);
            if (beforePageItem.parent) beforePageItem.parent.subCount = toPs.length;
            pageItem.at = beforePageItem.at - 1;
        })
        actions.push({
            directive: ItemOperatorDirective.update,
            pageId: pageItem.id,
            data: { at: beforePageItem.at - 1, parentId: beforePageItem.parent?.id || null },
            extra: { parentId: oldParentId }
        })
        await this.save(pageItem.workspace.id, { operate: ItemOperator.moveAfter, actions })
    }
    public async sync(item: PageItem) {
        var actions: PageItemAction[] = [];
        actions.push({ directive: ItemOperatorDirective.update, pageId: item.id, data: {} });
        await this.save(item.workspace.id, { operate: ItemOperator.sync, actions });
    }
}
export var pageItemStore = new PageItemStore();