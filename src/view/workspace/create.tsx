import React from "react";
import { generatePath } from "react-router";
import { Button } from "rich/component/view/button";
import { Input } from "rich/component/view/input";
import { SyHistory } from "../history";
import { workspaceService } from "../../../services/workspace";
import "./style.less";
export class WorkspaceCreateView extends React.Component {
    private text: string = '';
    private failTip: string = '';
    setText(text: string) {
        this.text = this.text;
    }
    async save(event: React.MouseEvent) {
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
            <div className='shy-ws-create-text'><Input value={this.text} onChange={e => this.setText(e)} /></div>
            <div className='shy-ws-create-fail-tip'>{this.failTip}</div>
            <div className='shy-ws-create-button'><Button onClick={e => this.save(e)}>创建空间</Button></div>
        </div>
    }
}