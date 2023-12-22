

import dayjs from "dayjs";
import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Button } from "rich/component/view/button";
import { Divider, } from "rich/component/view/grid";
import { useSelectPayView } from "../../../../component/pay/select";
import { Price } from "../../../../util/price";
import { useForm } from "rich/component/view/form/dialoug";
import { masterSock } from "../../../../../net/sock";
import { ShyAlert } from "rich/component/lib/alert";
import "./style.less";
import { S } from "rich/i18n/view";
import { ls, lst } from "rich/i18n/store";
import { loadEchart } from "rich/blocks/data-grid/view/statistic/load";
import { util } from "rich/util/util";
import { Icon } from "rich/component/view/icon";
import { ChevronLeftSvg, ChevronRightSvg } from "rich/component/svgs";
import { MenuItem } from "rich/component/view/menu/declare";
import { useSelectMenuItem } from "rich/component/view/menu";
import { Rect } from "rich/src/common/vector/point";


export class UserResourceConsume {

    userid: string


    id: string


    public createDate: Date;

    /**
     * 磁盘空间消耗
     */
    public diskSpace: number;

    /**
     * 流量消耗
     */
    netStream: number

    /**
     * 数据表格行数
     */

    rowCount: number;

    /**
     * 费用比较低的ai消耗
     */
    cheapAI: number

    /**
     * 费用比较高的ai消耗
     */
    expensiveAI: number
    /**
     * 生成图片
     */

    imageAI: number;
    /**
     * 绿色内容安全
     */
    public greenContent: number;
    /**
     * 
     * 图片处理
     * 书签，文档数等等
     */
    public handleContent: number;
}

@observer
export class ShyWallet extends React.Component {
    constructor(props) {
        super(props);
        this.statDayList = {
            loading: false,
            year: dayjs().year(),
            month: dayjs().month() + 1,
            list: []
        }
        makeObservable(this, {
            wallet: observable,
            statDayList: observable,
            free: observable,
            consume: observable
        })
    }
    componentDidMount() {
        this.load()
            .then(e => {
                this.loadUserStat();
            })
    }
    async load() {
        var r = await masterSock.get('/user/resource/consume');
        if (r?.ok) {
            this.wallet = r.data.wallet;
            this.free = r.data.free;
            this.consume = r.data.consume;
        }
    }
    myChart;
    async loadUserStat() {
        if (this.statDayList.month <= 0) {
            this.statDayList.month = 12;
            this.statDayList.year--;
        }
        else if (this.statDayList.month > 12) {
            this.statDayList.month = 1;
            this.statDayList.year++;
        }
        var r = await masterSock.get('/user/day/cost', {
            year: this.statDayList.year,
            month: this.statDayList.month
        });
        if (r?.ok) {
            runInAction(() => {
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
            })
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
    chartEl: HTMLElement;
    async coupon(e: React.MouseEvent) {
        var g = await useForm({
            title: ls.t('兑换券'),
            head: false,
            remark: lst('请注意兑换码只能兑换一次', '请注意，兑换码只能兑换一次'),
            fields: [
                { name: "code", text: lst('兑换码'), type: 'input' }
            ],
            maskCloseNotSave: true
        });
        if (g?.code) {
            var c = await masterSock.post('/user/coupon', { code: g.code });
            if (c?.ok) {
                if (c.data.success)
                    this.load();
                else ShyAlert(lst('兑换券已过期'));
            }
            else ShyAlert(lst('兑换券不存在'));
        }
    }
    wallet: { money: number, isDue: boolean, meal: string, due: Date } = { isDue: false, money: 0, meal: '', due: null }
    free: UserResourceConsume = null;
    consume: UserResourceConsume = null;
    render() {
        var self = this;
        async function openPay(kind: "fill" | "meal" | "meal-1" | "meal-2") {
            var g = await useSelectPayView(kind);
            if (g) {
                self.load();
            }
        }
        function getMeal() {
            if (self.wallet.meal == 'meal-1') {
                return lst('专业版');
            }
            else if (self.wallet.meal == 'meal-2') {
                return lst('社区版');
            }
            else if (self.wallet.meal == 'meal') {
                return lst('云端版')
            }
            else return lst('无')
        }
        return <div className="shy-app-lang">
            <h2 className="h2"><S>账户钱包</S></h2>
            <Divider></Divider>
            <div className="gap-h-20">
                <div className="h4"><S>余额</S></div>
                <div className="flex flex-top gap-h-20 r-gap-r-10">
                    <span className="f-16 flex-fixed">{Price.toFixed(this.wallet.money)}<S>元</S></span>
                    <span className="flex-auto flex-end r-gap-l-10"><Button onClick={e => openPay('fill')}><S>充值</S></Button>
                        <Button ghost onClick={e => this.coupon(e)}><S>兑换码</S></Button></span>
                </div>
                <Divider></Divider>
            </div>
            <div className="gap-h-20">
                <div className="h4"><S>套餐</S></div>
                <div className="flex flex-top gap-h-20 r-gap-r-10">
                    <span className="f-16 flex-fixed"><em>{getMeal()}</em> {this.wallet.due && (this.wallet.meal == 'meal' || this.wallet.meal == 'meal-1' || this.wallet.meal == 'meal-2') && <i className="text-1">[{dayjs(this.wallet.due).format('YYYY.MM.DD')}<S>到期</S>]</i>}</span>
                    <span className="flex-auto flex-end r-gap-l-10">{this.wallet.meal != 'meal-2' && <Button ghost onClick={e => openPay('meal-1')}><S>专业版</S></Button>}
                        <Button ghost onClick={e => openPay('meal-2')}><S>社区版</S></Button></span>
                </div>
                <Divider></Divider>
            </div>
            {this.renderAmount()}
            {this.renderUserStat()}
        </div>
    }
    renderAmount() {

        return <div>
            <div className="h4"><S>资源额度</S></div>
            <div className="flex r-round r-gap-r-10 r-padding-5 gap-b-10">
                <div className="flex-fixed w-120 item-hover-focus ">
                    <div><S>空间</S></div>
                    <div>{util.byteToString(this.consume?.diskSpace || 0)}/{util.byteToString(this.free?.diskSpace || 0)}</div>
                </div>
                <div className="flex-fixed w-120  item-hover-focus ">
                    <div><S>数据记录数</S></div>
                    <div>{this.consume?.rowCount || 0}/{(this.free?.rowCount||0)}</div>
                </div>
                <div className="flex-fixed w-120   item-hover-focus ">
                    <div><S>AI额度</S></div>
                    <div>{this.consume?.cheapAI || 0 + (this.consume?.expensiveAI || 0)}/{this.free?.cheapAI + this.free?.expensiveAI}</div>
                </div>
            </div>
            <Divider></Divider>
        </div>
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
            this.loadUserStat();
        }
    }
    renderUserStat() {
        return <div>
            <div className="h4"><S>消费记录</S></div>

            <div>
                <div className="flex gap-t-30 gap-l-30">
                    <span className="size-20 flex-center cursor item-hover round" onMouseDown={e => {
                        this.statDayList.month--;
                        this.loadUserStat();
                    }}><Icon icon={ChevronLeftSvg}></Icon></span>
                    <span className="flex-center gap-w-5" onMouseDown={e => this.onSelectDate(e)}>{this.statDayList.year}-{this.statDayList.month}</span>
                    <span className="size-20 flex-center  item-hover round" onMouseDown={e => {
                        this.statDayList.month++;
                        this.loadUserStat();
                    }}><Icon icon={ChevronRightSvg}></Icon></span>
                </div>
                <div >
                    <div className="w80 h-300" ref={e => this.chartEl = e}></div>
                </div>

            </div>
            <Divider></Divider>
        </div>
    }

}