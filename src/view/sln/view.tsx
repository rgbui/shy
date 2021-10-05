import React from "react";
import { surface } from "../surface";
import { WorkspaceProfile } from "../workspace/profile";
import { PageView } from "./item/view";
import { getMimeViewComponent } from "./item/mime";
export class SlnView extends React.Component {
    private get solution() {
        return surface.sln;
    }
    constructor(props) {
        super(props);
        surface.sln.view = this;
    }
    async componentDidMount() {
        document.addEventListener('keyup', this._keyup = this.keydown.bind(this));
        document.addEventListener('mousemove', this._mousemove = this.mousemove.bind(this));
        document.addEventListener('mouseup', this._mouseup = this.mouseup.bind(this));
        await this.solution.load();
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
        return <div className='shy-wss' onKeyDownCapture={e => this.keydown(e.nativeEvent)} tabIndex={1}>
            {surface.workspace && <div className='shy-ws'>
                <WorkspaceProfile workspace={surface.workspace}></WorkspaceProfile>
                <div className='shy-ws-items'>
                    {surface.workspace.childs.map(ws => {
                        var View: typeof PageView = getMimeViewComponent(ws.mime);
                        return <View ref={e => ws.view = e} key={ws.id} item={ws} deep={0} ></View>
                    })}
                </div>
            </div>}
        </div>
    }
}