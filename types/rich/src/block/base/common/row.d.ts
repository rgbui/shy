import { BaseComponent } from "../component";
import { BlockAppear, BlockDisplay } from "../enum";
import { Block } from '../..';
/**
 * 分区中会有很多行，每行存在于一个或多个block
 */
export declare class Row extends Block {
    display: BlockDisplay;
    appear: BlockAppear;
    get isRow(): boolean;
}
export declare class RowView extends BaseComponent<Row> {
    didMount(): void;
    private _mousemove;
    private _mouseup;
    willUnmount(): void;
    private scope;
    mousedown(index: number, event: MouseEvent): void;
    renderBlocks(): JSX.Element[];
    render(): JSX.Element;
}
