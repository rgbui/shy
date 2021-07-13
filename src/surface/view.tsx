import React from "react";

import { surface } from ".";
import { SlideUserFooter } from "../user/slide.footer";
import { SolutionView } from "../solution/view";
import { SupervisorView } from "../supervisor/view";
export class ViewSurface extends React.Component {
    constructor(props) {
        super(props);
        surface.view = this;
    }
    async componentDidMount() {
        await surface.load();
        if (surface.isSuccessfullyLoaded)
            this.forceUpdate();
    }
    render() {
        return <div className='sy-surface'>{
            surface.isSuccessfullyLoaded && <>
                <div className='sy-slide'>
                    <SolutionView ></SolutionView>
                    <SlideUserFooter></SlideUserFooter>
                </div>
                <SupervisorView ></SupervisorView>
            </>
        }{!surface.isSuccessfullyLoaded && <div className='sy-surface-loading'>正在加载中...</div>}
        </div>
    }
}