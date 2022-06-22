import lodash from "lodash";
import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Col, Divider, Row } from "rich/component/view/grid";
import { Switch } from "rich/component/view/switch";
import { Remark } from "rich/component/view/text";
import { channel } from "rich/net/channel";
import { surface } from "../..";
import { SaveTip } from "../../../component/tip/save.tip";
@observer
export class WorkspaceManage extends React.Component {
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
    change(data: Partial<WorkspaceManage['data']>) {
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
            <h2>空间管理</h2>
            <Divider></Divider>
            <div >
                <Row style={{ marginTop: 20 }}>
                    <Col span={18}><h4 style={{ margin: '0px 0px 10px 0px' }}>允许任何人可以访问空间</h4></Col><Col span={6} align='end'><Switch onChange={e => this.change({ access: e ? 1 : 0 })} checked={this.data.access == 1}></Switch></Col>
                    <Col><Remark style={{ fontSize: 14 }}>公开访问可能会产生大量的访问流量</Remark></Col>
                    <Divider></Divider>
                </Row>
                <Row style={{ marginTop: 20 }}>
                    <Col span={18}><h4 style={{ margin: '0px 0px 10px 0px' }}>允许访客加入空间成为成员</h4></Col><Col span={6} align='end'><Switch onChange={e => this.change({ accessJoinTip: e })} checked={this.data.accessJoinTip}></Switch></Col>
                    <Col><Remark> </Remark></Col>
                    <Divider></Divider>
                </Row>
            </div>
        </div>
    }
}