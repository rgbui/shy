import React from "react";
import { Content } from "./Content";
import { Slide } from "./slide";
import { surface } from "./surface";
export class ViewSurface extends React.Component {
    constructor(props) {
        super(props);
        surface.view = this;
    }
    async componentDidMount() {
        surface.mounted();
    }
    content: Content;
    render() {
        return <div className='sy-surface'>{
            surface.isLogin && <>
                <Slide></Slide>
                <Content ref={e => this.content = e}></Content>
            </>
        }{!surface.isLogin && <div className='sy-surface-loading'>正在加载中...</div>}
        </div>
    }
}