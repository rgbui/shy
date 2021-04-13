import React from "react";
import { surface } from "../../view/surface";
import { PageItemMenu } from "./menu";
import { WorkspaceView } from "./workspace";

export class WorkSpacesView extends React.Component {
    constructor(props) {
        super(props);
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

    }
    keyup(event: KeyboardEvent) {

    }
    mousemove(event: MouseEvent) {

    }
    mouseup(event: MouseEvent) {

    }
    private _mousemove: (event: MouseEvent) => void;
    private _mouseup: (event: MouseEvent) => void;
    private _keyup: (event: KeyboardEvent) => void;
    render() {
        var wss = [surface.workspace];
        return <div className='sy-wss' onKeyDown={e => this.keydown(e.nativeEvent)} tabIndex={1}>
            <PageItemMenu ref={e => surface.pageItemMenuView = e}></PageItemMenu>
            {wss.map(ws => {
                return <WorkspaceView workspacesView={this} workspace={ws} key={ws.id}></WorkspaceView>
            })}
        </div>
    }
}