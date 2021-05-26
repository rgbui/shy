import { Mime } from "./mine";
import { WorkspaceModule } from "../module/base";
import { PageItemView } from "./view";
import { PageItemBox } from "./box";
import { PageItemMenuType } from "../extensions/menu";
export declare class PageItem {
    id: string;
    childs?: PageItem[];
    text: string;
    spread: boolean;
    view: PageItemView;
    viewChilds: PageItemBox;
    module: WorkspaceModule;
    mime: Mime;
    selectedDate: number;
    get solution(): import("..").Solution;
    /***
     * 用户设置的路径
     */
    uri: string;
    get path(): string;
    get url(): string;
    get workspace(): import("../workspace").Workspace;
    parent?: PageItem;
    load(data: any): void;
    get(): any;
    onSpread(spread?: boolean): void;
    onAdd(): void;
    onEdit(): void;
    onRemove(): void;
    getPageItemMenus(): PageItemMenuType[];
    onMenuClickItem(menuItem: PageItemMenuType, event: MouseEvent): void;
}
