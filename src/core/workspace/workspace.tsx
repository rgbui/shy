import React from "react";
import { PageItem, Workspace } from "../../model/workspace";


export class WorkspaceView extends React.Component<{ workspace: Workspace }> {
    constructor(props) {
        super(props);
    }
    get workspace() {
        return this.props.workspace;
    }
    renderItems() {
        function renderItems(items: PageItem[]) {
            return <ol>
                {items.map(item => {
                    <li>
                        <a><span>{item.text}</span></a>
                        {item.childs && this.items.length > 0 && renderItems(item.childs)}
                    </li>
                })}
            </ol>
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
                </div>
            </div>
            <div className='sy-workspace-menus'>
                {this.renderItems()}
            </div>
        </div>
    }
}