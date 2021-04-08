import React from "react";
import { surface } from "../../view/surface";
import { WorkspaceView } from "./workspace";

export class WorkSpaces extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var wss = [surface.workspace];
        return <div className='sy-workspaces'>
            {wss.map(ws => {
                return <WorkspaceView workspace={ws} key={ws.id}></WorkspaceView>
            })}
        </div>
    }
}