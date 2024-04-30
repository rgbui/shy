import { EventsComponent } from "rich/component/lib/events.component";
import { Button } from "rich/component/view/button";
import { Input } from "rich/component/view/input";
import { channel } from "rich/net/channel";
import React from "react";
import { Dialoug, Divider } from "rich/component/view/grid";
import "./style.less";
import { ShyAlert } from "rich/component/lib/alert";
import { Avatar } from "rich/component/view/avator/face";
import lodash from "lodash";
import { Icon } from "rich/component/view/icon";
import { PlusSvg } from "rich/component/svgs";
import { ToolTip } from "rich/component/view/tooltip";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";
import { PopoverSingleton } from "rich/component/popover/popover";
import { PopoverPosition } from "rich/component/popover/position";
import { Spin } from "rich/component/view/spin";

class JoinFriend extends EventsComponent {
    render() {
        return <Dialoug className={'shy-join-friend'}>
            <div className="flex gap-h-10">
                <Input
                    onClear={() => { this.word = ''; this.list = []; this.forceUpdate() }}
                    onChange={e => { this.word = e; this.onSearch() }}
                    onEnter={e => this.onSearch()}
                    placeholder={lst("搜索好友")} clear>
                </Input>
            </div>
            <Divider></Divider>
            <div className="padding-b-10 ">
                {this.loading && <Spin block></Spin>}
                {this.list.length == 0 && <div className="remark flex-center h-40 f-14"><S>没有搜到任何用户</S></div>}
                {this.list.map(l => {
                    return <div className="flex item-hover padding-10 round" key={l.id}>
                        <Avatar showName showSn className="flex-fixed" userid={l.id} size={30}></Avatar>
                        <div className="flex-auto flex-end">
                            <ToolTip overlay={lst('添加好友')}><span onClick={e => this.joinUser(l.id)} className="size-24 text-1 flex-center round item-hover cursor">
                                <Icon size={16} icon={PlusSvg}></Icon>
                            </span>
                            </ToolTip>
                        </div>
                    </div>
                })}
            </div>
        </Dialoug>
    }
    loading: boolean = false;
    list: { id: string }[] = [];
    word: string = '';
    onSearch = lodash.debounce(async () => {
        this.loading = true;
        this.forceUpdate();
        var r = await channel.get('/user/word/query', { word: this.word });
        if (r.ok) this.list = r.data.list;
        else this.list = [];
        this.loading = false;
        this.forceUpdate()
    }, 1000)
    name: string = '';
    error: string = '';
    button: Button;
    async joinUser(userid: string) {
        var r = await channel.put('/friend/join', { userid });
        if (r.ok) {
            if (r.data.exists) {
                ShyAlert(lst('好友请求已发送'))
            }
            else if (r.data.exists == false) {
                ShyAlert(lst('帐号不存在'))
            }
            else if ((r.data as any).black == true) {
                ShyAlert(lst('你被TA拉黑，无法加好友'))
            }
            else if (r.data.refuse == true) {
                ShyAlert(lst('当前帐号不允许你加Ta为好友'))
            }
            else if (r.data.send) {
                ShyAlert(lst('已发送好友请求'))
                this.emit('close')
            }
        }
    }
    open() {

    }
}

export async function useJoinFriend(pos: PopoverPosition) {
    let popover = await PopoverSingleton(JoinFriend, { mask: true, shadow: true });
    let fv = await popover.open(pos);
    fv.open();
    return new Promise((resolve, reject) => {
        fv.only('close', () => {
            popover.close();
            resolve(true);
        });
        popover.only('close', () => {
            resolve(false);
        });
    })
}
