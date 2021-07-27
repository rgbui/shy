import React from "react";

import { surface } from "../surface";
import { PageItemMenu } from "./extensions/menu";
import { WorkspaceView } from "../workspace/view";

export class SolutionView extends React.Component {
    private get solution() {
        return surface.solution;
    }
    constructor(props) {
        super(props);
        surface.solution.view = this;
    }
    async componentDidMount() {
        document.addEventListener('keyup', this._keyup = this.keydown.bind(this));
        document.addEventListener('mousemove', this._mousemove = this.mousemove.bind(this));
        document.addEventListener('mouseup', this._mouseup = this.mouseup.bind(this));
        var r = await this.solution.load();
        if (r) this.forceUpdate();
    }
    componentWillUnmount() {
        document.removeEventListener('mousemove', this._mousemove);
        document.removeEventListener('mouseup', this._mouseup);
        document.removeEventListener('keyup', this._keyup);
    }
    keydown(event: KeyboardEvent) {
        this.solution.keyboardPlate.keydown(event);
    }
    keyup(event: KeyboardEvent) {
        this.solution.keyboardPlate.keyup(event);
    }
    mousemove(event: MouseEvent) {

    }
    mouseup(event: MouseEvent) {

    }
    private _mousemove: (event: MouseEvent) => void;
    private _mouseup: (event: MouseEvent) => void;
    private _keyup: (event: KeyboardEvent) => void;
    render() {
        return <div className='sy-wss' onKeyDownCapture={e => this.keydown(e.nativeEvent)} tabIndex={1}>
            <PageItemMenu ref={e => this.solution.menu = e}></PageItemMenu>
            {surface.workspace && <WorkspaceView workspace={surface.workspace} ></WorkspaceView>}
        </div>
    }
}