import React from 'react';
import { Button } from 'rich/component/button';
import { Avatar } from '../../components/face';
import { surface } from '../../surface';
export class WorkspaceSettingsView extends React.Component {
    render() {
        return <div className='shy-ws-settings-view'>
            <div className='shy-form-element'>
                <Avatar text={surface.workspace.text} icon={surface.workspace.icon}></Avatar>
                <Button>上传图片</Button>
            </div>

        </div>
    }
}