
import { masterSock } from "../../../../../net/sock";
import React from "react";
import { Divider } from "rich/component/view/grid";
import { Avatar } from "rich/component/view/avator/face";
import { Button } from "rich/component/view/button";
import { SpinBox } from "rich/component/view/spin";
import { observer } from "mobx-react";
import { RobotInfo } from "rich/types/user";
import { surface } from "../../../app/store";
import { ShyAlert } from "rich/component/lib/alert";
import { Pagination } from "rich/component/view/pagination";
import { channel } from "rich/net/channel";
import { makeObservable, observable } from "mobx";
import { RobotDetail } from "./robot.detail";
import { S } from "rich/i18n/view";
import { lst } from "rich/i18n/store";

@observer
export class RecommendRobots extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            search: observable,
            currentRobots: observable,
            currentRobot: observable
        })
    }
    render() {
        if (this.currentRobot) {
            return <RobotDetail
                back={() => { this.currentRobot = null }}
                robot={this.currentRobot}></RobotDetail>
        }
        return <div>
            <div className="h2">
                <span><S>机器人商店</S></span>
            </div>
            <Divider></Divider>
            <div className="remark f-12 gap-h-10"><S>选择机器人</S></div>
            <div>
                {this.search.loading && <SpinBox></SpinBox>}
                {this.search.list.map(l => {
                    return <div onClick={e => this.currentRobot = l} className="flex gap-h-10 item-hove round item-hover padding-10" key={l.id}>
                        <div className="flex-auto"><Avatar showName size={40} userid={l.id}></Avatar></div>
                        <div className="flex-fixed">
                            {this.currentRobots.some(s => s.userid == l.id) && <Button ghost><S>已添加</S></Button>}
                            {!this.currentRobots.some(s => s.userid == l.id) && <Button onClick={(e, b) => {
                                e.stopPropagation()
                                this.addMember(l, e, b)
                            }}><S>添加至空间</S></Button>}
                        </div>
                    </div>
                })}
            </div>
            <div>
                <Pagination
                    total={this.search.total}
                    index={this.search.page}
                    size={this.search.size}
                    onChange={(page, size) => {
                        this.search.page = page;
                        this.search.size = size;
                        this.load();
                    }}
                ></Pagination>
            </div>
        </div >
    }
    search: {
        page: number,
        size: number,
        word?: string,
        total?: number,
        loading?: boolean,
        list: RobotInfo[],
        error?: string
    } = {
            page: 1,
            size: 100,
            total: 0,
            list: [],
            word: '',
            loading: false,
            error: ''
        }
    currentRobots: { userid: string }[] = [];
    currentRobot: RobotInfo = null;
    async load() {
        this.search.loading = true;
        this.search.error = '';
        try {
            var gs = await channel.get('/ws/robots');
            if (gs.ok) {
                this.currentRobots = gs.data.list as any;
            }
            var g = await masterSock.get('/recommend/robots', {
                page: this.search.page,
                size: this.search.size,
                word: this.search.word
            });
            if (g.ok) {
                Object.assign(this.search, g.data);
            }
        }
        catch (ex) {
            this.search.error = ex.toString();
        }
        finally {
            this.search.loading = false;
        }
    }
    async addMember(l: RobotInfo, e: React.MouseEvent, b: Button) {
        if(!surface.workspace.isManager) return ShyAlert(lst('你没有权限'));
        b.loading = true;
        try {
            await surface.workspace.sock.put('/ws/member/add/robot', {
                wsId: surface.workspace.id,
                robotInfo: l
            });
            ShyAlert(lst('添加成功'))
            await this.load()
        }
        catch (ex) {
            console.error(ex);
            ShyAlert(lst('添加失败'))
        }
        finally {
            b.loading = false;
        }
    }
    componentDidMount() {
        this.load()
    }
}


