
import React from 'react';
import { Row, Col, Divider } from 'rich/component/view/grid';
import { Input } from 'rich/component/view/input';
import { observer } from 'mobx-react';
import { makeObservable, observable, runInAction } from 'mobx';
import { surface } from '../..';
import { Select } from 'rich/component/view/select';
import { channel } from 'rich/net/channel';
import { Button } from 'rich/component/view/button';
import { Avatar } from 'rich/component/view/avator/face';



@observer
export class WorkspaceMembers extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            memebers: observable
        })
    }
    componentDidMount() {
        this.loadMembers();
    }
    async loadMembers() {
        var r = await channel.get('/ws/members', {
            page: this.page,
            size: this.size,
            word: this.word || undefined,
            roleId: this.roleId || undefined
        });
        if (r.ok) {
            runInAction(() => {
                this.page = r.data.page;
                this.size = r.data.size;
                this.total = r.data.total;
                this.memebers = r.data.list;
            })
        }
    }
    roleId: string = '';
    word: string = '';
    memebers: any[] = [];
    page: number = 1;
    size: number = 100;
    total: number = -1;
    addMember(event: React.MouseEvent) {

    }
    render() {
        var options = surface.workspace.roles.map(r => {
            return {
                text: r.text,
                value: r.id
            }
        })
        return <div className='shy-ws-members'>
            <h2>成员</h2>
            <Divider></Divider>
            <div className='shy-ws-members-list'>
                <div className='shy-ws-member-head'>
                    <Row>
                        <Select value={this.roleId} onChange={e => this.roleId = e} options={options}></Select>
                        <Col span={12}><Input value={this.word} onChange={e => this.word = e} onEnter={e => this.loadMembers()} placeholder='搜索用户...'></Input></Col>
                        <Col span={12} align='end'><Button onClick={e => this.addMember(e)}>添加用户</Button></Col>
                    </Row>
                </div>
                <Divider></Divider>
                {
                    this.memebers.map(me => {
                        return <div>
                            <Avatar userid={me.id}></Avatar>
                        </div>
                    })
                }
            </div>
        </div>
    }
}