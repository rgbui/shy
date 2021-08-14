import React from "react";
import { generatePath } from "react-router";
import { SyHistory } from "../history";
import { workspaceService } from "./service";

export class WorkspaceCreateView extends React.Component {
    private text: string = '';
    private failTip: string = '';
    setText(event: React.FormEvent<HTMLInputElement>) {
        this.text = (event.nativeEvent.target as HTMLInputElement).value;
    }
    async save(event: React.MouseEvent<HTMLButtonElement>) {
        var button = event.nativeEvent.target as HTMLButtonElement;
        button.disabled = true;
        try {
            var rr = await workspaceService.createWorkspace({ text: this.text })
            if (rr.ok) return SyHistory.push(generatePath('/ws/:id', { id: rr.data.sn }));
            else this.failTip = rr.warn;
            this.forceUpdate();
        }
        catch (ex) {

        }
        button.disabled = false;
    }
    render() {
        return <div className='shy-ws-create'>
            <div className='shy-ws-create-text'><input className='input' defaultValue={this.text} onInput={e => this.setText(e)} /></div>
            <div className='shy-ws-create-fail-tip'>{this.failTip}</div>
            <div className='shy-ws-create-button'><button className='button' onClick={e => this.save(e)}>创建空间</button></div>
        </div>
    }
}