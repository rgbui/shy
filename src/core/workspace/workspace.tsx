import React from "react";
import { Icon } from "rich/src/component/icon";

import { PageItem, Workspace } from "../../model/workspace";

export class WorkspaceView extends React.Component<{ workspace: Workspace }> {
    constructor(props) {
        super(props);
    }
    get workspace() {
        return this.props.workspace;
    }
    
    mousedown(item: PageItem, event: MouseEvent) {
        var target = event.target as HTMLElement;
        if (target.classList.contains('sy-ws-item-page-spread')) {

        }
        else if (target.classList.contains('sy-ws-item-page-add')) {

        }
        else if (target.classList.contains('sy-ws-item-page-operator')) {

        }
        else {

        }
    }
    renderViews() {
        var self = this;
        function renderItems(items: PageItem[]) {
            return <div className='sy-ws-items'>
                {items.map(item => {
                    return <div className='sy-ws-item'>
                        <div className='sy-ws-item-page' onMouseDown={e => self.mousedown(item, e.nativeEvent)}>
                            <Icon className='sy-ws-item-page-spread' icon='arrow-right:sy'></Icon>
                            <span>{item.text}</span>
                            <div className='sy-ws-item-page-operators'>
                                <Icon className='sy-ws-item-page-add' icon='add:sy'></Icon>
                                <Icon className='sy-ws-item-page-operator' icon='elipsis:sy'></Icon>
                            </div>
                        </div>
                        {item.childs && this.items.length > 0 && renderItems(item.childs)}
                    </div>
                })}
            </div>
        }
        return <div className='sy-workspace-menu-box'>
            <div className='sy-workspace-menu-box-head'><span>我的页面</span></div>
            {renderItems(this.workspace.items)}
        </div>
    }
    render() {
        return <div className='sy-workspace'>
            <div className='sy-workspace-profile'>
                <div className='sy-workspace-profile-face'>
                    <img src={this.workspace.profile_photo} />
                </div>
                <div className='sy-workspace-profile-info'>
                    <span>{this.workspace.title}</span>
                    <Icon icon='arrow-down:sy'></Icon>
                </div>
            </div>
            <div className='sy-workspace-menus'>
                {this.renderViews()}
            </div>
        </div>
    }
}