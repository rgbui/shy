import { observer } from "mobx-react";
import React from "react";
import { ArrowLeftSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { Markdown } from "rich/component/view/markdown";
import { S } from "rich/i18n/view";
import { autoImageUrl } from "rich/net/element.type";
import { RobotInfo } from "rich/types/user";

@observer
export class RobotDetail extends React.Component<{ back: () => void, robot: RobotInfo }>{
    render(): React.ReactNode {
        var robot = this.props.robot;
        return <div>
            <div className="flex">
                <div className="flex-fixed flex item-hover padding-w-3 round cursor" onMouseDown={e => this.props.back()}>
                    <span className="size-24 gap-r-5 flex-center"><Icon size={16} icon={ArrowLeftSvg}></Icon> </span><span><S>后退</S></span>
                </div>
            </div>
            <div className="shy-user-settings-profile-box-card settings" style={{ margin: '20px 0px' }}>
                <div className="bg">
                    {!robot.cover?.url && <div style={{ height: 100, backgroundColor: robot?.cover?.color ? robot?.cover?.color : 'rgb(192,157,156)' }}></div>}
                    {robot.cover?.url && <img style={{ height: 180 }} src={autoImageUrl(robot.cover?.url, 900)} />}
                </div>
                <div className='shy-settings-user-avatar' style={{ top: robot.cover?.url ? 180 : 100 }}>
                    {robot?.avatar && <img src={autoImageUrl(robot.avatar.url, 120)} />}
                    {!robot?.avatar && <span>{robot.name.slice(0, 1)}</span>}
                </div>
                <div className="shy-user-settings-profile-box-card-operators">
                    <h2>{robot.name}#{robot.sn}</h2>
                </div>
            </div>
            {this.renderDetail()}
        </div>
    }
    renderDetail() {
        var robot = this.props.robot;
        return <Markdown md={robot.remark}></Markdown>
    }
}