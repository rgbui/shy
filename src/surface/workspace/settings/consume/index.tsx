import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Divider } from "rich/component/view/grid";

import { surface } from "../../../store";
import { SaveTip } from "../../../../component/tip/save.tip";
import { S } from "rich/i18n/view";
import { util } from "rich/util/util";
import { SearchListType } from "rich/component/types";
import { WsCost } from "./declare";
import { masterSock } from "../../../../../net/sock";
import { ChevronLeftSvg, ChevronRightSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { loadEchart } from "rich/blocks/data-grid/view/statistic/load";
import dayjs from "dayjs";
import lodash from "lodash";
import { MenuItem } from "rich/component/view/menu/declare";
import { Rect } from "rich/src/common/vector/point";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Pagination } from "rich/component/view/pagination";
import { Spin } from "rich/component/view/spin";
import { getConstValue, getWsConsumeType } from "rich/net/ai/cost";
import { Tip } from "rich/component/view/tooltip/tip";
import { SelectButtons } from "rich/component/view/button/select";

@observer
export class ConsumeView extends React.Component {
    constructor(props) {
        super(props);
        this.statDayList = {
            loading: false,
            year: dayjs().year(),
            month: dayjs().month() + 1,
            list: null
        }
        makeObservable(this, {
            workspaceCostList: observable,
            masterCostList: observable,
            statDayList: observable,
            tab: observable,
        })
    }
    tip: SaveTip;
    componentDidMount() {
        this.load();
    }
    async load() {
        await this.searchWorkspaceEveryDayCost();
    }
    workspaceCostList: SearchListType<WsCost> = {
        loading: false,
        list: null,
        page: 1,
        size: 50,
        total: 0,
    }
    masterCostList: SearchListType<WsCost> = {
        loading: false,
        list: null,
        page: 1,
        size: 50,
        total: 0,
    }
    statDayList: {
        loading: boolean,
        year: number,
        month: number,
        list: { createDate: Date, cost: number }[]
    } = {
            loading: false,
            year: null,
            month: null,
            list: []
        }
    myChart
    async searchWorkspaceEveryDayCost() {
        if (this.statDayList.month <= 0) {
            this.statDayList.month = 12;
            this.statDayList.year--;
        }
        else if (this.statDayList.month > 12) {
            this.statDayList.month = 1;
            this.statDayList.year++;
        }
        this.statDayList.loading = true;
        try {
            var r = await masterSock.get('/workspace/day/cost', {
                wsId: surface.workspace?.id,
                year: this.statDayList.year,
                month: this.statDayList.month
            });
            if (r.ok) {
                this.statDayList.list = [];
                var d = dayjs().year(this.statDayList.year).month(this.statDayList.month - 1);
                var s = d.startOf('month').toDate();
                var e = d.endOf('month').toDate();
                for (var i = s.getDate(); i < e.getDate(); i++) {
                    var rs = r.data.list.filter(e => dayjs(e.createDate).date() == i);
                    if (rs.length > 0)
                        this.statDayList.list.push({
                            cost: rs.reduce((a, b) => a + b.cost, 0),
                            createDate: rs[0]?.createDate
                        })
                    else {
                        this.statDayList.list.push({
                            cost: 0,
                            createDate: dayjs().year(this.statDayList.year).month(this.statDayList.month - 1).date(i).toDate()
                        })
                    }
                }
                var echarts = await loadEchart();
                if (typeof this.myChart == 'undefined') {
                    this.myChart = echarts.init(this.chartEl);
                }
                else {
                    this.myChart.dispose();
                    this.myChart = echarts.init(this.chartEl);
                }
                var option = {
                    xAxis: {
                        type: 'category',
                        data: this.statDayList.list.map(e => dayjs(e.createDate).format('YYYY-MM-DD'))
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            data: this.statDayList.list.map(e => e.cost),
                            type: 'bar'
                        }
                    ]
                };
                this.myChart.setOption(option);
            }
        }
        catch (ex) {

        }
        finally {
            this.statDayList.loading = false;
        }
    }
    async searchMasterCost() {
        try {
            this.masterCostList.loading = true;
            var r = await masterSock.get('/workspaceCost/records', {
                wsId: surface.workspace?.id,
                page: this.masterCostList.page,
                size: this.masterCostList.size
            });
            if (r.ok) {
                runInAction(() => {
                    this.masterCostList.page = r.data.page;
                    this.masterCostList.size = r.data.size;
                    this.masterCostList.list = r.data.list;
                    this.masterCostList.total = r.data.total;
                })
            }
        }
        catch (ex) {

        }
        finally {
            this.masterCostList.loading = false;
        }
    }
    async searchWorkspaceCost() {
        try {
            this.workspaceCostList.loading = true;
            var r = await surface.workspace.sock.get('/wsConst/records', {
                wsId: surface.workspace?.id,
                page: this.workspaceCostList.page,
                size: this.workspaceCostList.size
            });
            if (r?.ok) {
                runInAction(() => {
                    this.workspaceCostList.page = r.data.page;
                    this.workspaceCostList.size = r.data.size;
                    this.workspaceCostList.list = r.data.list;
                    this.workspaceCostList.total = r.data.total;
                })
            }
        }
        catch (ex) {

        }
        finally {
            this.workspaceCostList.loading = false;
        }
    }
    async onSelectDate(e: React.MouseEvent) {
        var now = dayjs();
        var old = dayjs().year(2023).month(9);
        var rs: MenuItem<{ year: number, month: number }>[] = [];
        while (true) {
            if (old.isBefore(now)) {
                rs.push({
                    text: now.format('YYYY-MM'),
                    value: { year: now.year(), month: now.month() + 1 }
                });
                now = now.subtract(1, 'month');
            }
            else break;
        }
        var r = await useSelectMenuItem({ roundArea: Rect.fromEvent(e) }, rs);
        if (r?.item) {
            this.statDayList.year = r.item.value.year;
            this.statDayList.month = r.item.value.month;
            this.searchWorkspaceEveryDayCost();
        }
    }
    chartEl: HTMLElement;
    renderEveryDayCost() {
        return <div style={{ display: this.tab == 'day' ? 'block' : 'none' }}>
            <div className="flex gap-t-30 gap-l-30">
                <span className="size-20 flex-center cursor item-hover round" onMouseDown={e => {
                    this.statDayList.month--;
                    this.searchWorkspaceEveryDayCost();
                }}><Icon icon={ChevronLeftSvg}></Icon></span>
                <span className="flex-center gap-w-5" onMouseDown={e => this.onSelectDate(e)}>{this.statDayList.year}-{this.statDayList.month}</span>
                <span className="size-20 flex-center  item-hover round" onMouseDown={e => {
                    this.statDayList.month++;
                    this.searchWorkspaceEveryDayCost();
                }}><Icon icon={ChevronRightSvg}></Icon></span>
            </div>
            <div >
                <div className="w80 h-300" ref={e => this.chartEl = e}></div>
            </div>
        </div>
    }
    renderMasterCost() {
        return <div>
            {this.masterCostList.loading && <Spin block></Spin>}
            <div className="shy-page-order-list">
                <table>
                    <thead><tr><th><S>类别</S></th><th><S>消耗</S></th><th><S>核算</S></th><th><S>创建时间</S></th><th><S>详情</S></th></tr></thead>
                    <tbody>
                        {!this.masterCostList.loading && this.masterCostList.list && this.masterCostList.list.map((order, i) => {
                            return <tr key={order.id + i.toString()}>
                                <td>{getWsConsumeType(order.consumeType)}</td>
                                <td>{getConstValue(order.cost, order.consumeType)}</td>
                                <td>{order.checkCost ? <S>已核算</S> : <S>待核算</S>}</td>
                                <td>{order.createDate ? dayjs(order.createDate).format('YYYY.MM.DD HH:mm') : ""}</td>
                                <td>
                                    <Tip overlay={
                                        <div className="w-250">
                                            {order.details.map((d, j) => {
                                                return <div className="flex" key={j}>
                                                    <span className="flex-auto text-overflow">{d.title}</span>
                                                    <span className="flex-fixed">{d.size}</span>
                                                </div>
                                            })}
                                        </div>
                                    }><span><S>详情</S></span></Tip>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                <Pagination size={this.masterCostList.size} index={this.masterCostList.page} total={this.masterCostList.total} onChange={e => {
                    this.masterCostList.page = e;
                    this.searchMasterCost()
                }}></Pagination>
            </div>
            {!this.masterCostList.loading && !(this.masterCostList.list?.length > 0) && <div className="remark f-12 flex-center gap-h-20"><S>没有消费记录</S></div>}
        </div>
    }
    renderWorkspaceCost() {
        return <div>
            {this.workspaceCostList.loading && <Spin block></Spin>}
            <div className="shy-page-order-list">
                <table>
                    <thead><tr><th><S>类别</S></th><th><S>消耗</S></th><th><S>核算</S></th><th><S>创建时间</S></th><th><S>详情</S></th></tr></thead>
                    <tbody>
                        {!this.workspaceCostList.loading && this.workspaceCostList.list && this.workspaceCostList.list.map((order, i) => {
                            return <tr key={order.id + i.toString()}>
                                <td>{getWsConsumeType(order.consumeType)}</td>
                                <td>{getConstValue(order.cost, order.consumeType)}</td>
                                <td>{order.checkCost ? <S>已核算</S> : <S>待核算</S>}</td>
                                <td>{order.createDate ? dayjs(order.createDate).format('YYYY.MM.DD HH:mm') : ""}</td>
                                <td>
                                    <Tip overlay={
                                        <div className="w-250">
                                            {order.details.map((d, j) => {
                                                return <div className="flex" key={j}>
                                                    <span className="flex-auto text-overflow">{d.title}</span>
                                                    <span className="flex-fixed">{d.size}</span>
                                                </div>
                                            })}
                                        </div>
                                    }><span><S>详情</S></span></Tip>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                <Pagination size={this.workspaceCostList.size} index={this.workspaceCostList.page} total={this.workspaceCostList.total} onChange={e => { this.workspaceCostList.page = e; this.searchWorkspaceCost() }}></Pagination>
            </div>
            {!this.workspaceCostList.loading && !(this.workspaceCostList.list?.length > 0) && <div className="remark f-12 flex-center gap-h-20"><S>没有消费记录</S></div>}
        </div>
    }
    render() {
        return <div className='shy-ws-manage'>
            <div className="h2">空间资源消耗</div>
            <div className="remark f-12">消耗的越多诗云提供的生产力就越多</div>
            <Divider></Divider>
            <div>
                <div className="flex flex-wrap r-flex-fixed r-padding-10 r-gap-r-10 r-gap-b-10 r-round r-cursor r-item-hover-focus">
                    <div>
                        <div className="f-12"><S>空间成员</S></div>
                        <div className="f-12">{surface.workspace?.memberCount}</div>
                    </div>
                    <div>
                        <div className="f-12"><S>空间容量</S></div>
                        <div className="f-12">{util.byteToString(surface.workspace?.stats?.totalFileSize || 0)}</div>
                    </div>
                    <div>
                        <div className="f-12"><S>评论数</S></div>
                        <div className="f-12">{surface.workspace?.stats?.totalComment || 0}</div>
                    </div>
                    <div>
                        <div className="f-12"><S>访问量</S></div>
                        <div className="f-12">{surface.workspace.stats?.totalViewBrowse || 0}</div>
                    </div>
                    <div>
                        <div className="f-12"><S>文档数</S></div>
                        <div className="f-12">{surface.workspace.stats?.totalDoc || 0}</div>
                    </div>
                    <div>
                        <div className="f-12"><S>白板数</S></div>
                        <div className="f-12">{surface.workspace.stats?.totalBoard || 0}</div>
                    </div>
                    <div>
                        <div className="f-12"><S>宣传页数</S></div>
                        <div className="f-12">{surface.workspace.stats?.totalDocCard || 0}</div>
                    </div>
                    <div>
                        <div className="f-12"><S>频道数</S></div>
                        <div className="f-12">{surface.workspace.stats?.totalChannel || 0}</div>
                    </div>
                    <div>
                        <div className="f-12"><S>数据表数</S></div>
                        <div className="f-12">{surface.workspace.stats?.totalTable || 0}</div>
                    </div>
                    <div>
                        <div className="f-12"><S>数据记录数</S></div>
                        <div className="f-12">{surface.workspace.stats?.totalRowCount || 0}</div>
                    </div>
                    <div>
                        <div className="f-12"><S>书签数</S></div>
                        <div className="f-12">{surface.workspace.stats?.totalBookmark || 0}</div>
                    </div>
                    <div>
                        <div className="f-12"><S>标签数</S></div>
                        <div className="f-12">{surface.workspace.stats?.totalTag || 0}</div>
                    </div>
                </div>
            </div>
            <div>
                <div className="h2"><S>资源消耗</S></div>
                <Divider></Divider>

                <div className="flex-center h-30 r-padding-w-10 r-round r-cursor">
                    <SelectButtons onChange={e => this.setTab(e)} value={this.tab} options={[
                        { text: '统计', value: 'day' },
                        { text: '服务', value: 'service' },
                        { text: '存储', value: 'storage' }
                    ]}></SelectButtons>
                </div>
                <div>
                    {this.renderEveryDayCost()}
                    {this.tab == 'service' && this.renderMasterCost()}
                    {this.tab == 'storage' && this.renderWorkspaceCost()}
                </div>
            </div>
        </div>
    }
    tab: 'day' | 'service' | 'storage' = 'day';
    setTab(tab: 'day' | 'service' | 'storage') {
        this.tab = tab;
        if (this.tab == 'day' && lodash.isNull(this.statDayList.list)) {
            this.searchWorkspaceEveryDayCost();
        }
        if (this.tab == 'service' && lodash.isNull(this.masterCostList.list)) {
            this.searchMasterCost();
        }
        if (this.tab == 'storage' && lodash.isNull(this.workspaceCostList.list)) {
            this.searchWorkspaceCost();
        }
    }
}



