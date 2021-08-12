import React from 'react';
import { AppLang } from "./enum";
import Tooltip from "rc-tooltip";
import { SA } from './view';
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
        return <Tooltip overlayClassName='sy-tooltip' ref={e => this.tip = e}
            mouseEnterDelay={0.8}
            mouseLeaveDelay={0.1}
            placement={this.props.placement || 'top'}
            trigger={['hover']}
            overlayInnerStyle={{ minHeight: 'auto' }}
            overlay={<div className='sy-tooltip-content'>{ov}</div>}
        >{Array.isArray(this.props.children) ? <>{this.props.children}</> : this.props.children}
        </Tooltip>
    }
}
