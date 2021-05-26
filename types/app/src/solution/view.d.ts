import React from "react";
export declare class SolutionView extends React.Component {
    private solution;
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    keydown(event: KeyboardEvent): void;
    keyup(event: KeyboardEvent): void;
    mousemove(event: MouseEvent): void;
    mouseup(event: MouseEvent): void;
    private _mousemove;
    private _mouseup;
    private _keyup;
    render(): JSX.Element;
}
