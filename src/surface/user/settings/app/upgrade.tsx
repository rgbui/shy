import React from "react";
import { Divider } from "rich/component/view/grid";
import { Markdown } from "rich/component/view/markdown";
import { Spin } from "rich/component/view/spin";
import { S } from "rich/i18n/view";
import { util } from "rich/util/util";
export class ShyAppUpdate extends React.Component {
    md: string = '';
    loading = true;
    componentDidMount() {
        this.load()
    }
    async load() {
        var d = await import('../../../../../CHANGELOG.zh-CN.md');
        var url = d.default;
        this.md = await util.getText(url);
        this.loading = false;
        this.forceUpdate()
    }
    render() {
        return <div className="shy-app-update">
            <h2 className="h2"><S>更新日志</S></h2>
            <Divider></Divider>
            <div className="remark"><S>记录着我们成长的脚步，也记录着大家对我们的期望</S></div>
            <div className="shy-app-update-content">
                {this.loading && <Spin block></Spin>}
                <Markdown md={this.md}></Markdown>
            </div>
        </div>
    }
}
