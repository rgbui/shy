import lodash from "lodash";
import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Divider } from "rich/component/view/grid";

import { channel } from "rich/net/channel";
import { surface } from "../../../store";
import { SaveTip } from "../../../../component/tip/save.tip";

@observer
export class AuditView extends React.Component {
    // constructor(props) {
    //     super(props);
    //     makeObservable(this, {
    //         data: observable,
    //         error: observable
    //     })
    // }
    // data: { access: number, accessJoinTip: boolean } = { access: 1, accessJoinTip: false };
    // error: Record<string, any> = {};
    // tip: SaveTip;
    // componentDidMount() {
    //     this.data = {
    //         access: surface.workspace.access,
    //         accessJoinTip: surface.workspace.accessJoinTip
    //     };
    //     this.forceUpdate();
    // }
    // change(data: Partial<AuditView['data']>) {
    //     if (data.access == 1) data.accessJoinTip = true;
    //     if (data.access == 0) data.accessJoinTip = false;
    //     Object.assign(this.data, data);
    //     if (this.tip) {
    //         if (lodash.isEqual(this.data, lodash.pick(surface.workspace, ['public', 'allowJoin'])))
    //             this.tip.close()
    //         else
    //             this.tip.open();
    //     }
    // }
    // async save() {
    //     var r = await channel.patch('/ws/patch', { data: this.data });
    //     if (r.ok) {
    //         surface.workspace.access = this.data.access;
    //         surface.workspace.accessJoinTip = this.data.accessJoinTip;
    //         this.tip.close();
    //     }
    // }
    // reset() {
    //     runInAction(() => {
    //         this.data = {
    //             access: surface.workspace.access,
    //             accessJoinTip: surface.workspace.accessJoinTip
    //         };
    //         this.error = {};
    //         this.tip.close();
    //     })
    // }
    // render() {
    //     return <div className='shy-ws-manage'>
    //         <SaveTip ref={e => this.tip = e} save={e => this.save()} reset={e => this.reset()}></SaveTip>
    //         <h2>不雅媒体内容过滤</h2>
    //         <Divider></Divider>
    //     </div>
    // }
}