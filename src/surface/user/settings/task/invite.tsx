import { observer } from "mobx-react";
import React from "react";
import { Divider } from "rich/component/view/grid";
import { masterSock } from "../../../../../net/sock";
import { makeObservable, observable } from "mobx";
import { Avatar } from "rich/component/view/avator/face";
import { Pagination } from "rich/component/view/pagination";
import { SpinBox } from "rich/component/view/spin";
import { Button } from "rich/component/view/button";
import { CopyAlert } from "rich/component/copy";
import { DuplicateSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { channel } from "rich/net/channel";
import { User } from "../../user";


@observer
export class InviteList extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, { search: observable, dataUser: observable })
    }
    componentDidMount(): void {
        this.load();
    }
    dataUser: Partial<User> = null;
    search: { page: number, size: number, list: { id: string }[], total: number, loading: boolean } = { page: 1, size: 10, list: [], total: 0, loading: false }
    async load() {
        if (!this.dataUser) {
            var r = await channel.get('/user/query')
            if (r.ok && r.data && r.data.user) {
                this.dataUser = r.data.user;
            }
        }
        this.search.loading = true;
        var g = await masterSock.get('/user/invite/list', { page: this.search.page, size: this.search.size });;
        if (g.ok) {
            this.search = Object.assign({}, this.search, g.data);
            this.search.loading = false;
        }
    }
    render(): React.ReactNode {
        return <div>
            <h2 className="h2">邀请好友</h2>
            <Divider></Divider>
            <div className="border-light gap-h-10 round">
                <div className="gap-w-10">
                    <div className="flex gap-h-10">
                        <div className="flex-auto flex cursor" onClick={e => CopyAlert(this.dataUser?.inviteCode, '邀请码已复制')}>邀请码:
                            <span>{this.dataUser?.inviteCode}</span>
                            <i className="size-20 flex-center inline-flex item-hover round "><Icon size={16} icon={DuplicateSvg}></Icon></i>
                        </div>
                        <div className="flex-fixed"><Button onClick={e => { CopyAlert(`https://shy.live/sign/in?code=` + this.dataUser?.inviteCode, '邀请地址已复制'); }}>复制邀请地址</Button></div>
                    </div>
                </div>
                <div className="remark gap-w-10 gap-b-10">
                    邀请成功后，可享受好友消费的2%返利，福利终身有效。
                </div>
            </div>
            <div className="gap-h-20">
                {this.search.list.length == 0 && <div className="flex-center gap-h-20">还没有邀请好友</div>}
                {this.search.loading && <SpinBox ></SpinBox>}
                {this.search.list.length > 0 && <div className="flex"><span className="item-hover padding-w-5 padding-h-2 round remark ">共邀请{this.search.total}人</span></div>}
                {this.search.list.map(r => {
                    return <div className="gap-h-10 item-hover round padding-10" key={r.id}>
                        <Avatar size={40} userid={r.id}></Avatar>
                    </div>
                })}
                <Pagination size={this.search.size} index={this.search.page} total={this.search.total} onChange={e => { this.search.page = e; this.load() }}></Pagination>
            </div>
        </div>
    }
}