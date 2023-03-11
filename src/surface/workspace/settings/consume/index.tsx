import lodash from "lodash";
import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Col, Divider, Row } from "rich/component/view/grid";
import { Switch } from "rich/component/view/switch";
import { Remark } from "rich/component/view/text";
import { channel } from "rich/net/channel";
import { surface } from "../../../store";
import { SaveTip } from "../../../../component/tip/save.tip";

@observer
export class ConsumeView extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            data: observable,
            error: observable
        })
    }
    data: { access: number, accessJoinTip: boolean } = { access: 1, accessJoinTip: false };
    error: Record<string, any> = {};
    tip: SaveTip;
    componentDidMount() {
        this.data = {
            access: surface.workspace.access,
            accessJoinTip: surface.workspace.accessJoinTip
        };
        this.forceUpdate();
    }
    change(data: Partial<ConsumeView['data']>) {
        if (data.access == 1) data.accessJoinTip = true;
        if (data.access == 0) data.accessJoinTip = false;
        Object.assign(this.data, data);
        if (this.tip) {
            if (lodash.isEqual(this.data, lodash.pick(surface.workspace, ['public', 'allowJoin'])))
                this.tip.close()
            else
                this.tip.open();
        }
    }
    async save() {
        var r = await channel.patch('/ws/patch', { data: this.data });
        if (r.ok) {
            surface.workspace.access = this.data.access;
            surface.workspace.accessJoinTip = this.data.accessJoinTip;
            this.tip.close();
        }
    }
    reset() {
        runInAction(() => {
            this.data = {
                access: surface.workspace.access,
                accessJoinTip: surface.workspace.accessJoinTip
            };
            this.error = {};
            this.tip.close();
        })
    }
    render() {
        return <div className='shy-ws-manage'>
            <SaveTip ref={e => this.tip = e} save={e => this.save()} reset={e => this.reset()}></SaveTip>
            <div className="h2">空间资源消耗</div>
            <div className="remark f-12">消耗的越多诗云提供的生产力就越多</div>
            <Divider></Divider>
        </div>
    }
}