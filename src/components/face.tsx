import React from 'react';
import { IconArguments } from 'rich/extensions/icon/declare';
import "./style.less";
export class Avatar extends React.Component<{
    icon: IconArguments,
    text: string,
    size?: number,
    circle?: boolean
}> {
    render() {
        var size = this.props.size ? this.props.size : 20;
        return <div className='shy-avatar'>
            {this.props.icon && <img style={{ width: size, height: size }} src={this.props.icon.url} />}
            {!this.props.icon && <span style={{ width: size, height: size }} className='shy-avatar-name'>{this.props.text.slice(0, 1)}</span>}
        </div>
    }
}