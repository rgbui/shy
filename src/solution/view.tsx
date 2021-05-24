import React from "react";
import { Solution } from ".";
import { surface } from "../surface";
import { PageItemMenu } from "./extensions/menu";
import { WorkspaceView } from "./workspace/view";

export class SolutionView extends React.Component {
    private solution: Solution;
    constructor(props) {
        super(props);
        surface.solution.view = this;
        this.solution = surface.solution;
    }
    componentDidMount() {
        document.addEventListener('keyup', this._keyup = this.keydown.bind(this));
        document.addEventListener('mousemove', this._mousemove = this.mousemove.bind(this));
        document.addEventListener('mouseup', this._mouseup = this.mouseup.bind(this));
    }
    componentWillUnmount() {
        document.removeEventListener('mousemove', this._mousemove);
        document.removeEventListener('mouseup', this._mouseup);
        document.removeEventListener('keyup', this._keyup);
    }
    keydown(event: KeyboardEvent) {
        this.solution._keys.push(event.key);
    }
    keyup(event: KeyboardEvent) {
        this.solution._keys.remove(event.key);
    }
    mousemove(event: MouseEvent) {

    }
    mouseup(event: MouseEvent) {

    }
    private _mousemove: (event: MouseEvent) => void;
    private _mouseup: (event: MouseEvent) => void;
    private _keyup: (event: KeyboardEvent) => void;
    render() {
        return <div className='sy-wss' onKeyDown={e => this.keydown(e.nativeEvent)} tabIndex={1}>
            <PageItemMenu ref={e => this.solution.bindMenu(e)}></PageItemMenu>
            {this.solution.workspace && <WorkspaceView workspace={this.solution.workspace} ></WorkspaceView>}
        </div>
    }
}