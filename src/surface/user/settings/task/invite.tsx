import { observer } from "mobx-react";
import React from "react";
import { Divider } from "rich/component/view/grid";
import { masterSock } from "../../../../../net/sock";
import { makeObservable, observable } from "mobx";
import { Avatar } from "rich/component/view/avator/face";
import { Pagination } from "rich/component/view/pagination";
import { SpinBox } from "rich/component/view/spin";
import { InviteCode } from "./inviteCode";
import { S, Sp } from "rich/i18n/view";

@observer
export class InviteList extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, { search: observable })
    }
    componentDidMount(): void {
        this.load();
    }
    search: { page: number, size: number, list: { id: string }[], total: number, loading: boolean } = { page: 1, size: 20, list: [], total: 0, loading: false }
    async load() {
        this.search.loading = true;
        var g = await masterSock.get('/user/invite/list', { page: this.search.page, size: this.search.size });;
        if (g.ok) {
            this.search = Object.assign({}, this.search, g.data);
            this.search.loading = false;
        }
    }
    render(): React.ReactNode {
        return <div>
            <h2 className="h2"><S>邀请好友</S></h2>
            <Divider></Divider>
            <InviteCode></InviteCode>
            <div className="gap-h-20">
                {this.search.list.length == 0 && <div className="flex-center gap-h-20 remark"><S>还没有邀请好友</S></div>}
                {this.search.loading && <SpinBox ></SpinBox>}
                {this.search.list.length > 0 && <div className="flex"><span className="item-hover padding-w-5 padding-h-2 round remark "><Sp text='共邀请{total}人' data={{ total: this.search.total }}>共邀请{this.search.total}人</Sp></span></div>}
                {this.search.list.map(r => {
                    return <div className="gap-h-10 item-hover round padding-10" key={r.id}>
                        <Avatar size={40} userid={r.id}></Avatar>
                    </div>
                })}
                <div className="gap-h-20">
                    <Pagination size={this.search.size} index={this.search.page} total={this.search.total} onChange={e => { this.search.page = e; this.load() }}></Pagination>
                </div>
            </div>
        </div>
    }
}