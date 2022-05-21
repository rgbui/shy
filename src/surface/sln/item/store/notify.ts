import lodash from "lodash";
import { runInAction } from "mobx";
import { PageItem } from "..";
import { surface } from "../../..";
import { ItemOperator, ItemOperatorDirective, PageItemAction } from "./sync";

export function PageItemOperateNotify(e: {
    actions: any[],
    operate: {
        operate: ItemOperator,
        actions: PageItemAction[]
    }
}) {
    if (!surface.workspace) return;
    runInAction(() => {
        switch (e.operate.operate) {
            case ItemOperator.insertAfter:
                for (var i = 0; i < e.operate.actions.length; i++) {
                    var act = e.operate.actions[i];
                    if (act.directive == ItemOperatorDirective.update) {
                        var item = surface.workspace.find(g => g.id == act.pageId);
                        if (item) {
                            Object.assign(item, act.data);
                        }
                    }
                    else if (act.directive == ItemOperatorDirective.inc) {
                        var item = surface.workspace.find(g => g.id == act.filter.parentId);
                        var at = act.filter.at.$gt as number;
                        if (item) {
                            var cs = item.childs.filter(g => g.at > at);
                            cs.forEach(c => {
                                c.at += 1;
                            })
                        }
                    }
                    else if (act.directive == ItemOperatorDirective.insert) {
                        var data = act.data;
                        var result = e.actions.find(g => g && g.id == data.id);
                        if (result) { Object.assign(data, result) };
                        var pid = data.parentId;
                        if (pid && surface.workspace) {
                            var pa = surface.workspace.find(g => g.id == pid);
                            if (pa && pa.checkedHasChilds) {
                                var newItem = new PageItem();
                                newItem.checkedHasChilds = true;
                                newItem.load(data);
                                var at = pa.childs.find(g => g.at < newItem.at)?.at || 0;
                                pa.childs.splice(at, 0, newItem);
                            }
                        }
                    }
                }
                break;
            case ItemOperator.append:
                var action = e.operate.actions[0];
                if (action) {
                    var data = action.data;
                    var result = e.actions.find(g => g && g.id == data.id);
                    if (result) { Object.assign(data, result) };
                    var pid = data.parentId;
                    if (pid && surface.workspace) {
                        var pa = surface.workspace.find(g => g.id == pid);
                        if (pa && pa.checkedHasChilds) {
                            var newItem = new PageItem();
                            newItem.checkedHasChilds = true;
                            newItem.load(data);
                            pa.childs.push(newItem)
                        }
                    }
                }
                break;
            case ItemOperator.delete:
                var pageId = e.operate.actions[0]?.pageId;
                if (pageId) {
                    var item = surface.workspace?.find(g => g.id == pageId);
                    if (item) {
                        item.parent.childs.remove(g => g == item);
                    }
                }
                break;
            case ItemOperator.update:
                var action = e.operate.actions[0];
                var pageId = action?.pageId;
                var data = action?.data;
                if (pageId) {
                    var item = surface.workspace?.find(g => g.id == pageId);
                    if (item) {
                        Object.assign(item, data);
                        if (item.parent) {
                            item.parent.childs.sort(surface.workspace.pageSort);
                        }
                    }
                }
                break;
            case ItemOperator.moveAppend:
                for (var i = 0; i < e.operate.actions.length; i++) {
                    var act = e.operate.actions[i];
                    if (act.directive == ItemOperatorDirective.update) {
                        var item = surface.workspace.find(g => g.id == act.pageId);
                        if (item) {
                            var parentId = act.data.parentId;
                            var pa = item.parent;
                            lodash.remove(pa.childs, g => g.id == item.id);
                            var np = surface.workspace.find(g => g.id == parentId);
                            if (np && np.checkedHasChilds == true) {
                                Object.assign(item, act.data)
                                np.childs.splice(0, 0, item);
                                np.childs.sort(surface.workspace.pageSort);
                            }
                        }
                    }
                    else if (act.directive == ItemOperatorDirective.inc) {
                        var item = surface.workspace.find(g => g.id == act.filter.parentId);
                        var at = act.filter.at.$gte as number;
                        if (item) {
                            var cs = item.childs.filter(g => g.at >= at);
                            cs.forEach(c => {
                                c.at += 1;
                            })
                        }
                    }
                }
                break;
            case ItemOperator.moveAfter:
                for (var i = 0; i < e.operate.actions.length; i++) {
                    var act = e.operate.actions[i];
                    if (act.directive == ItemOperatorDirective.update) {
                        var item = surface.workspace.find(g => g.id == act.pageId);
                        if (item) {
                            var parentId = act.data.parentId;
                            if (parentId) {
                                var pa = item.parent;
                                lodash.remove(pa.childs, g => g.id == item.id);
                                var np = surface.workspace.find(g => g.id == parentId);
                                if (np && np.checkedHasChilds == true) {
                                    Object.assign(item, act.data)
                                    np.childs.splice(0, 0, item);
                                    np.childs.sort(surface.workspace.pageSort);
                                }
                            }
                            else {
                                Object.assign(item, act.data);
                            }
                        }
                    }
                    else if (act.directive == ItemOperatorDirective.inc) {
                        var item = surface.workspace.find(g => g.id == act.filter.parentId);
                        var at = act.filter.at.$gte as number;
                        if (item) {
                            var cs = item.childs.filter(g => g.at >= at);
                            cs.forEach(c => {
                                c.at += 1;
                            })
                        }
                    }
                }
                break;
        }
    })

}