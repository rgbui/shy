import dayjs from "dayjs";
import lodash from "lodash";
import React from "react";
import { Confirm } from "rich/component/lib/confirm";
import { DotsSvg, TrashSvg, UnpaySvg } from "rich/component/svgs";
import { Divider, } from "rich/component/view/grid";
import { Icon } from "rich/component/view/icon";
import { Input } from "rich/component/view/input";
import { useSelectMenuItem } from "rich/component/view/menu";
import { channel } from "rich/net/channel";
import { Rect } from "rich/src/common/vector/point";
import { usePayOrder } from "../../../../component/pay";
import { Pagination } from "rich/component/view/pagination";
import { Spin } from "rich/component/view/spin";
import { S, Sp } from "rich/i18n/view";
import { lst } from "rich/i18n/store";

export class ShyPayList extends React.Component {
    page: number = 1;
    size: number = 40;
    total = 0;
    orders: {
        id: string,
        orderId: string,
        userid: string,
        subject: string,
        amount: number,
        status: string,
        payedDate: Date,
        createDate: Date,
        kind: string
    }[] = [];
    loading: boolean = false;
    word: string = '';
    componentDidMount() {
        this.load()
    }
    async load() {
        this.loading = true;
        this.forceUpdate();
        var r = await channel.get('/user/order/list', {
            word: this.word,
            page: this.page,
            size: this.size
        });
        if (r.ok) {
            this.page = r.data.page;
            this.size = r.data.size;
            this.orders = r.data.list;
            this.total = r.data.total;
        }
        this.loading = false;
        this.forceUpdate();
    }
    render() {
        var self = this;
        function getKind(order) {
            var kind = order.kind;
            if (kind == 'fill') return lst('充值')
            else if (kind == 'meal-1') return lst('升级专业版')
            else if (kind == 'meal-2') return lst('升级社区版')
        }
        function getStatus(order) {
            var status = order.status;
            if (status == 'created') return lst('等待支付')
            else if (status == 'payed') return lst('已支付')
        }
        async function openOrder(order, event: React.MouseEvent) {
            var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(event) },
                [
                    { name: 'repay', icon: UnpaySvg, disabled: order.status == 'payed' ? true : false, text: lst('重新支付') },
                    { name: 'delete', icon: TrashSvg, text: lst('删除') }
                ]);
            if (r?.item) {
                if (r.item.name == 'delete') {
                    if (await Confirm(lst('确认删除订单'))) {
                        await channel.del('/user/del/order', { orderId: order.orderId });
                        await self.load();
                    }
                }
                else if (r.item.name == 'repay') {
                    var or = lodash.cloneDeep(order);
                    delete or.platform;
                    var g = await usePayOrder(or);
                    if (g) {
                        await self.load();
                    }
                }
            }
        }
        return <div className="shy-pay-list">
            <div className="h2"><S>支付记录</S></div>
            <Divider></Divider>
            <div className='shy-ws-members-list'>
                <div className='shy-ws-member-head'>
                    <div className="flex">
                        <div className="flex-auto">
                            <span style={{ fontSize: 14 }}><S>订单</S>{this.total > 0 && <Sp text='共{total}条记录' data={{ total: this.total }}>{'共' + this.total + '条记录'}</Sp>}</span>
                        </div>
                        <div className="flex-fixed"> <Input style={{ width: 180 }} value={this.word} onChange={e => this.word = e} onEnter={e => this.load()} placeholder={lst('搜索订单...')}></Input></div>
                    </div>
                </div>
                {this.loading && <Spin block></Spin>}
                <div className="shy-page-order-list">
                    <table>
                        <thead><tr><th><S>订单号</S></th><th><S>类别</S></th><th><S>订单内容</S></th><th><S>金额</S></th><th><S>支付时间</S></th><th><S>状态</S></th><th><S>创建时间</S></th><th><S>操作</S></th></tr></thead>
                        <tbody>
                            {!this.loading && this.orders.map((order, i) => {
                                return <tr key={order.id + i.toString()}>
                                    <td>{order.orderId}</td>
                                    <td>{getKind(order)}</td>
                                    <td>{order.subject}</td>
                                    <td>￥{order.amount}</td>
                                    <td>{order.payedDate ? dayjs(order.payedDate).format('YYYY.MM.DD HH:mm') : ""}</td>
                                    <td>{getStatus(order)}</td>
                                    <td>{order.createDate ? dayjs(order.createDate).format('YYYY.MM.DD HH:mm') : ""}</td>
                                    <td className="text-center"><span onMouseDown={e => openOrder(order, e)} className="flex-center item-hover round cursor size-24"><Icon size={16} icon={DotsSvg}></Icon></span></td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                    <Pagination size={this.size} index={this.page} total={this.total} onChange={e => { this.page = e; this.load() }}></Pagination>
                </div>
                {!this.loading && this.orders.length == 0 && <div className="remark f-12 flex-center gap-h-20"><S>没有支付记录</S></div>}
            </div>
        </div>
    }
}