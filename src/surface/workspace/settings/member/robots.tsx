
import { masterSock } from "../../../../../net/sock";
import React from "react";
import { Divider } from "rich/component/view/grid";
import { Avatar } from "rich/component/view/avator/face";
import { Button } from "rich/component/view/button";
import { SpinBox } from "rich/component/view/spin";
import { observer } from "mobx-react";

@observer
export class RecommendRobots extends React.Component {

    render() {
        return <div>
            <div className="h3">
                <span>推荐机器人</span>
            </div>
            <Divider></Divider>
            <div>
                {this.search.loading && <SpinBox></SpinBox>}
                {this.search.list.map(l => {
                    return <div className="flex" key={l.userid}>
                        <div className="flex-auto"><Avatar userid={l.userid}></Avatar></div>
                        <div className="flex-fixed"><Button>添加至空间</Button></div>
                    </div>
                })}
            </div>
        </div>
    }
    search: {
        page: number,
        size: number,
        word?: string,
        total?: number,
        loading?: boolean,
        list: { userid: string }[],
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
    async load() {
        this.search.loading = true;
        this.search.error = '';
        try {
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
    componentDidMount() {
        this.load()
    }
}


