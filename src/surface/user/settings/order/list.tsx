import dayjs from "dayjs";
import lodash from "lodash";
import React from "react";
import { Confirm } from "rich/component/lib/confirm";
import { TrashSvg, UnpaySvg } from "rich/component/svgs";

import { Col, Divider, Row, Space } from "rich/component/view/grid";
import { Icon } from "rich/component/view/icon";
import { Input } from "rich/component/view/input";
import { Loading } from "rich/component/view/loading";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Remark } from "rich/component/view/text";
import { channel } from "rich/net/channel";
import { Rect } from "rich/src/common/vector/point";
import { usePayOrder } from "../../../../component/pay";
import { Pagination } from "rich/component/view/pagination";
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
        var r = await channel.get('/user/order/list', { word: this.word, page: this.page, size: this.size });
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
            if (kind == 'fill') return '充值'
            else if (kind == 'meal-1') return '升级团队版'
            else if (kind == 'meal-2') return '升级社区版'
        }
        function getStatus(order) {
            var status = order.status;
            if (status == 'created') return '等待支付'
            else if (status == 'payed') return '已支付'
        }
        async function openOrder(order, event: React.MouseEvent) {
            var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(event) },
                [
                    { name: 'repay', icon: UnpaySvg, disabled: order.status == 'payed' ? true : false, text: '重新支付' },
                    { name: 'delete', icon: TrashSvg, text: '删除' }
                ]);
            if (r?.item) {
                if (r.item.name == 'delete') {
                    if (await Confirm('确认删除订单')) {
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
            <h2 className="h2">支付记录</h2>
            <Divider></Divider>
            <div className='shy-ws-members-list'>
                <div className='shy-ws-member-head'>
                    <Row style={{ marginBottom: 0 }}>
                        <Col span={6} style={{ height: 30 }} valign={'middle'}>
                            <span style={{ fontSize: 14 }}>订单{this.total > 0 ? '共' + this.total + '条记录' : ''}</span>
                        </Col>
                        <Col span={18} style={{ height: 30 }} valign={'middle'} align={'end'}>
                            <Space>
                                {/* <span style={{ fontSize: 14 }}>显示角色:</span>
                                <Select style={{ fontSize: 14 }} value={this.roleId} dropStyle={{ width: 120 }} onChange={e => this.roleId = e} options={options}></Select> */}
                                <Input style={{ width: 180 }} value={this.word} onChange={e => this.word = e} onEnter={e => this.load()} placeholder='搜索订单...'></Input>
                            </Space>
                        </Col>
                    </Row>
                </div>
                {/* <Divider></Divider> */}
                {this.loading && <Loading></Loading>}
                <div className="shy-page-order-list">
                    <table>
                        <thead><tr><th>订单号</th><th>类别</th><th>订单内容</th><th>金额</th><th>支付时间</th><th>状态</th><th>创建时间</th><th>操作</th></tr></thead>
                        <tbody>
                            {!this.loading && this.orders.map(order => {
                                return <tr key={order.id}>
                                    <td>{order.orderId}</td>
                                    <td>{getKind(order)}</td>
                                    <td>{order.subject}</td>
                                    <td>￥{order.amount}</td>
                                    <td>{order.payedDate ? dayjs(order.payedDate).format('YYYY.MM.DD HH:mm') : ""}</td>
                                    <td>{getStatus(order)}</td>
                                    <td>{order.createDate ? dayjs(order.createDate).format('YYYY.MM.DD HH:mm') : ""}</td>
                                    <td><a onMouseDown={e => openOrder(order, e)}><Icon size={14} icon={'elipsis:sy'}></Icon></a></td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                    <Pagination size={this.size} index={this.page} total={this.total} onChangeIndex={e => { this.page = e; this.load() }}></Pagination>
                </div>

                {!this.loading && this.orders.length == 0 && <Row><Col><Remark>没有支付记录</Remark></Col></Row>}
            </div>
        </div>
    }
}