import { observer } from "mobx-react";
import React from "react";
import { RobotInfo } from "rich/types/user";

@observer
export class RobotInfoPromptView extends React.Component<{ robot: RobotInfo }>{
    constructor(props) {
        super(props);
    }
    render() {
        var robot = this.props.robot;
        return <div>
            <div className="h4"><span>问答客服</span></div>
            <div className="flex"></div>
            <div className="h4"><span>写作</span></div>
            <div className="flex"></div>
            <div className="h4"><span>润色</span></div>
            <div className="flex"></div>
        </div>
    }
}