import React from "react";

import { surface } from ".";
import { SlideUserFooter } from "../user/slide.footer";
import { SolutionView } from "../solution/view";
import { SupervisorView } from "../supervisor/view";
export class ViewSurface extends React.Component {
    constructor(props) {
        super(props);
        surface.view = this;
        surface.on('loaded', this._load = () => {
            if (this._isMounted) {
                this.forceUpdate();
            }
        });
        surface.load();
    }
    private _load: () => void;
    private _isMounted: boolean = false;
    async componentDidMount() {
        if (surface.isSuccessfullyLoaded == true) {
            surface.off(this._load);
            delete this._load;
            this.forceUpdate();
        }
        this._isMounted = true;
    }
    render() {
        if (this._load && surface.isSuccessfullyLoaded && surface.has(this._load)) {
            surface.off(this._load);
            delete this._load;
        }
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