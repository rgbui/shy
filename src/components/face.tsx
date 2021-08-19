import React from 'react';
import { IconArguments } from 'rich/extensions/icon/declare';
import "./style.less";
export class Avatar extends React.Component<{
    icon: IconArguments,
    text: string,
    size?: number,
    circle?: boolean,
    onClick?: (event: React.MouseEvent) => void,
}> {
    render() {
        var size = this.props.size ? this.props.size : 20;
        return <div className='shy-avatar' onClick={e => {
            if (typeof this.props.onClick == 'function') this.props.onClick(e);
        }}>
            {this.props.icon && <img style={{ width: size, height: size }} src={this.props.icon.url} />}
            {!this.props.icon && <span style={{ width: size, height: size, fontSize: size * 0.8, lineHeight: size + 'px' }} className='shy-avatar-name'>{this.props.text.slice(0, 1)}</span>}
        </div>
    }
}