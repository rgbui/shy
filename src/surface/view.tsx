import React from "react";
import { surface } from ".";
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
        return <div className='shy-surface'>{
            surface.isSuccessfullyLoaded && <>
                <div className='shy-slide'>
                    <SlnView ></SlnView>
                </div>
                <SupervisorView ></SupervisorView>
            </>
        }{!surface.isSuccessfullyLoaded && <div className='shy-surface-loading'>正在加载中...</div>}
        </div>
    }
}