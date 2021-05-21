import React from "react";
import { WorkSpacesView } from "../solution";
import { surface } from ".";
import { SlideUserFooter } from "../user/slide.footer";
import { Supervisor } from "../supervisor";
export class ViewSurface extends React.Component {
    constructor(props) {
        super(props);
        surface.view = this;
    }
    async componentDidMount() {
        surface.mounted();
    }
    render() {
        return <div className='sy-surface'>{
            surface.isLogin && <>
                <div className='sy-slide'>
                    <WorkSpacesView></WorkSpacesView>
                    <SlideUserFooter></SlideUserFooter>
                </div>
                <Supervisor></Supervisor>
            </>
        }{!surface.isLogin && <div className='sy-surface-loading'>正在加载中...</div>}
        </div>
    }
}