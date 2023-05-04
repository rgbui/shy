import React from 'react';
import { AppLang } from "./enum";
import { SA } from './view';
import { ToolTip } from 'rich/component/view/tooltip';
export class AppTip extends React.Component<{
    children: React.ReactElement | React.ReactElement[],
    id?: AppLang,
    overlay?: React.ReactNode,
    placement?: 'left' | 'top' | 'bottom' | 'right'
}>{
    constructor(props) {
        super(props);
    }
    close() {
        this.tip.close();
    }
    private tip: any;
    render() {
        var ov = typeof this.props.id != 'undefined' ? <SA id={this.props.id}></SA> : this.props.overlay;
        return <ToolTip ref={e => this.tip = e}
            mouseEnterDelay={0.8}
            mouseLeaveDelay={0.1}
            placement={this.props.placement || 'top'}
            overlay={<div className='sy-tooltip-content'>{ov}</div>}
        >{Array.isArray(this.props.children) ? <>{this.props.children}</> : this.props.children}
        </ToolTip>
    }
}
