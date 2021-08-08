import React from "react";

import { surface } from ".";
import { SlideUserFooter } from "../user/slide.footer";
import { SlnView } from "../sln/view";
import { SupervisorView } from "../supervisor/view";
export class ViewSurface extends React.Component {
    constructor(props) {
        super(props);
        surface.view = this;
    }
    async componentDidMount() {
        if (!surface.isSuccessfullyLoaded) {
            await surface.load();
            if (surface.isSuccessfullyLoaded) this.forceUpdate();
        }
    }
    render() {
        return <div className='sy-surface'>{
            surface.isSuccessfullyLoaded && <>
                <div className='sy-slide'>
                    <SlnView ></SlnView>
                    <SlideUserFooter></SlideUserFooter>
                </div>
                <SupervisorView ></SupervisorView>
            </>
        }{!surface.isSuccessfullyLoaded && <div className='sy-surface-loading'>正在加载中...</div>}
        </div>
    }
}