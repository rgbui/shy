import lodash from "lodash";
import { runInAction } from "mobx";
import { config } from "../../../../../common/config";
import { PageItem } from "..";
import { surface } from "../../../store";
import { Workspace } from "../../../workspace";
import { Mime } from "../../declare";

export enum ItemOperatorDirective {
    update = 1,
    insert = 2,
    remove = 3,
    inc = 4,
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
        if (typeof pageItem?.parent.subCount == 'number') {
            pageItem.parent.subCount = pageItem.parent.subCount - 1;
        }
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
    public async appendPageItem(pageItem: PageItem, data: Record<string, any>) {
        if (pageItem.checkedHasChilds && pageItem.spread == true) {
            if (!Array.isArray(pageItem.childs)) pageItem.childs = [];
            var actions: PageItemAction[] = [];
            if (typeof data.id == 'undefined')
                data.id = config.guid();
            data.workspaceId = pageItem.workspaceId;
            data.parentId = pageItem.id;
            data.at = pageItem.childs.last() ? (pageItem.childs.last().at + 1) : 0;
            var newItem = new PageItem();
            newItem.checkedHasChilds = true;
            newItem.load(data);
            runInAction(() => {
                pageItem.spread = true;
                pageItem.childs.push(newItem);
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
        else return await this.insertAfterPageItem(pageItem, data);
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
        var ns = pageItem.parent.childs.findAll((g, i) => i > index);
        data.id = config.guid();
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
                    actions.push({ directive: ItemOperatorDirective.inc, filter: { parentId: pageItem.parentId, at: { $gt: at } } })
                }
            }
            pageItem.parent.childs.splice(index + 1, 0, newItem);
            pageItem.parent.subCount = pageItem.parent.childs.length;
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
        if (next) return await this.insertAfterPageItem(next, data)
        else {
            var actions: PageItemAction[] = [];
            data.id = config.guid();
            data.workspaceId = workspace.id;
            data.at = (workspace.childs.last()?.at || 0) + 1;
            data.subCount = 0;
            data.mime= Mime.pages;
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
            return newItem;
        }
    }
    public async movePrependPageItem(pageItem: PageItem, parentItem: PageItem) {
        if (pageItem.parent == parentItem && !pageItem.prev) return;
        var oldParentId = pageItem.parentId;
        var actions: PageItemAction[] = [];
        runInAction(() => {
            if (parentItem.childs.length > 0 && parentItem.childs.first().at == 0) {
                parentItem.childs.forEach(c => {
                    c.at += 1;
                })
                actions.push({ directive: ItemOperatorDirective.inc, filter: { parentId: parentItem.id, at: { $gte: 0 } } });
            }
            lodash.remove(pageItem.parent?.childs, g => g.id == pageItem.id);
            pageItem.parent.subCount = pageItem.parent.childs.length;
            pageItem.parentId = parentItem.id;
            pageItem.at = 0;
            parentItem.childs.splice(0, 0, pageItem);
            parentItem.subCount = parentItem.childs.length;
        })
        actions.push({ directive: ItemOperatorDirective.update, pageId: pageItem.id, data: { at: 0, parentId: pageItem.parentId }, extra: { parentId: oldParentId } })
        await this.save(pageItem.workspace.id, { operate: ItemOperator.moveAppend, actions })
    }
    /**
     * 
     * @param pageItem 
     * @param toPageItem 
     * @returns 
     */
    public async moveToPageItem(pageItem: PageItem, toPageItem: PageItem) {
        if (toPageItem.checkedHasChilds && toPageItem.spread == true) {
            await this.movePrependPageItem(pageItem, toPageItem);
        }
        else {
            if (pageItem.prev == toPageItem) return;
            var actions: PageItemAction[] = [];
            var next = toPageItem.next;
            var oldParentId = pageItem.parentId;
            runInAction(() => {
                lodash.remove(pageItem.parent.childs, g => g.id == pageItem.id);
                pageItem.parent.subCount = pageItem.parent.childs.length;
                if (next) {
                    var ns = toPageItem.parent.childs.findAll((g, i) => i >= next.index);
                    if (next.at - 1 == toPageItem.at) {
                        /**这是正常的排序 */
                        actions.push({ directive: ItemOperatorDirective.inc, filter: { parentId: toPageItem.parent.id, at: { $gte: next.at } } });
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
                var currentAt = toPageItem.parent.childs.findIndex(g => g.id == toPageItem.id);
                toPageItem.parent.childs.splice(currentAt + 1, 0, pageItem);
                toPageItem.parent.subCount = toPageItem.parent.childs.length;
                pageItem.at = toPageItem.at + 1;
            })
            actions.push({
                directive: ItemOperatorDirective.update,
                pageId: pageItem.id,
                data: { at: toPageItem.at + 1, parentId: toPageItem.parent.id },
                extra: { parentId: oldParentId }
            })
            await this.save(pageItem.workspace.id, { operate: ItemOperator.moveAfter, actions })
        }
    }
}
export var pageItemStore = new PageItemStore();