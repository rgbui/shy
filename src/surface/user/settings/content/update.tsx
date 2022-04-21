import React from "react";
import { Divider } from "rich/component/view/grid";
import { Remark } from "rich/component/view/text";
import md from "../../../../../CHANGELOG.zh-CN.md";
export class ShyAppUpdate extends React.Component {
    render() {
        return <div className="shy-app-update">
            <h2>更新日志</h2>
            <Divider></Divider>
            <Remark>记录着我们成长的脚步，也记录着大家对我们的期望</Remark>
            <div className="shy-app-update-content" dangerouslySetInnerHTML={{ __html: md }}></div>
        </div>
    }
}
