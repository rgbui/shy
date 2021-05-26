import React from 'react';
import { Point } from 'rich/src/common/point';
import { SyExtensionsComponent } from "rich/src/extensions/sy.component";
import { PageItem } from '../item';
import { PageItemOperator } from '../item/operator.declare';
export declare type PageItemMenuType = {
    name: PageItemOperator;
    icon: string | SvgrComponent;
    text: string;
    label?: string;
    disabled?: boolean;
    childs?: PageItemMenuType[];
    type?: 'devide' | 'item' | 'text';
};
export declare class PageItemMenu extends SyExtensionsComponent<{}, string> {
    private node;
    constructor(props: any);
    openItem(item: PageItem, event: MouseEvent): void;
    private currentItem;
    items: PageItemMenuType[];
    visible: boolean;
    point: Point;
    renderItem(item: PageItemMenuType): JSX.Element;
    private mousedownCover;
    private mousedownItem;
    render(): React.ReactPortal;
    componentWillUnmount(): void;
}
