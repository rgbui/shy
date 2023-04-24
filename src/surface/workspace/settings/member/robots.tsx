
import { masterSock } from "../../../../../net/sock";
import React from "react";
import { Divider } from "rich/component/view/grid";
import { Avatar } from "rich/component/view/avator/face";
import { Button } from "rich/component/view/button";
import { SpinBox } from "rich/component/view/spin";
import { observer } from "mobx-react";
import { RobotInfo } from "rich/types/user";
import { surface } from "../../../store";
import { ShyAlert } from "rich/component/lib/alert";
import { Pagination } from "rich/component/view/pagination";
import { channel } from "rich/net/channel";

@observer
export class RecommendRobots extends React.Component {
    render() {
        return <div>
            <div className="h2">
                <span>推荐机器人</span>
            </div>
            <Divider></Divider>
            <div className="remark f-12 gap-h-10">添加服务机器人至协作空间</div>
            <div>
                {this.search.loading && <SpinBox></SpinBox>}
                {this.search.list.map(l => {
                    return <div className="flex gap-h-10 item-hove round" key={l.id}>
                        <div className="flex-auto"><Avatar userid={l.id}></Avatar></div>
                        <div className="flex-fixed">
                            {this.currentRobots.some(s => s.userid == l.id) && <Button ghost>已添加</Button>}
                            {!this.currentRobots.some(s => s.userid == l.id) && <Button onClick={(e, b) => this.addMember(l, e, b)}>添加至空间</Button>}
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
        b.loading = true;
        await surface.workspace.sock.put('/ws/member/add/robot', {
            wsId: surface.workspace.id,
            robotInfo: l
        });
        b.loading = false;
        ShyAlert('添加成功')
    }
    componentDidMount() {
        this.load()
    }
}


