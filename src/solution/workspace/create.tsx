import React from "react";
import { SyHistory } from "../../history";
import { masterSock } from "../../service/sock";
import { workspaceService } from "../service";

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
            if (rr.ok) return SyHistory.push('/ws/:id', { id: rr.data.id });
            else this.failTip = rr.warn;
            this.forceUpdate();
        }
        catch (ex) {

        }
        finally {
            button.disabled = false;
        }
    }
    render() {
        return <div className='shy-workspace-create'>
            <div className='shy-workspace-create-text'><input defaultValue={this.text} onInput={e => this.setText(e)} /></div>
            <div className='shy-worksace-create-fail-tip'>{this.failTip}</div>
            <div className='shy-worksace-create-button'><button onClick={e => this.save(e)}>创建空间</button></div>
        </div>
    }
}