import React from "react";
import { UserService } from "../service/user";
import { Doc } from "./doc/doc";
import { Slide } from "./slide";
import { surface } from "./surface";
export class ViewSurface extends React.Component {
    constructor(props) {
        super(props);
    }
    async componentDidMount() {
        surface.user = await UserService.tryLogin();
        surface.pageData = await UserService.getPageData('router source get page id')
        surface.workspace = await UserService.getWorkspace(surface.pageData.workspaceId);
        this.forceUpdate();
    }
    render() {
        return <div className='sy-surface'>{
            surface.isLogin && <>
                <Slide></Slide>
                <Doc></Doc>
            </>
        }{!surface.isLogin && <div className='sy-surface-loading'>正在加载中...</div>}
        </div>
    }
}