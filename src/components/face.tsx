import React from 'react';
import { IconArguments } from 'rich/extensions/icon/declare';
import { userService } from '../../services/user';
import "./style.less";
export class Avatar extends React.Component<{
    icon?: IconArguments,
    text?: string,
    size?: number,
    circle?: boolean,
    onClick?: (event: React.MouseEvent) => void,
    userid?: string
}> {
    private userFaceUrl: string;
    private userName: string;
    async componentDidMount() {
        if (!this.userFaceUrl && this.props.userid) {
            var r = await userService.getBasic(this.props.userid);
            if (r?.data?.avatar) {
                this.userFaceUrl = r.data.avatar.url;
                this.forceUpdate();
            }
            else if (r.data.name) {
                this.userName = r.data.name;
                this.forceUpdate();
            }
        }
    }
    render() {
        var size = this.props.size ? this.props.size : 20;
        var renderIcon = () => {
            if (this.props.userid) {
                if (this.userFaceUrl) return <img style={{ width: size, height: size }} src={this.userFaceUrl} />
                if (this.userName) {
                    {
                        return <span style={{ width: size, height: size, fontSize: size * 0.6, lineHeight: (size * 0.6) + 'px' }}
                            className='shy-avatar-name'>{this.userName.slice(0, 1)}</span>
                    }
                }
            }
            else {
                return <>
                    {this.props.icon && <img style={{ width: size, height: size }} src={this.props.icon.url} />}
                    {!this.props.icon && <span style={{ width: size, height: size, fontSize: size * 0.6, lineHeight: (size * 0.6) + 'px' }}
                        className='shy-avatar-name'>{this.props.text.slice(0, 1)}</span>}
                </>
            }
        }
        return <div className={'shy-avatar' + (this.props.circle ? " shy-avatar-circle" : "")} onClick={e => {
            if (typeof this.props.onClick == 'function') this.props.onClick(e);
        }}>
            {renderIcon()}
        </div>
    }
}