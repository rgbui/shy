import React from "react";
import { ReactNode } from "react";
import { Avatar } from "rich/component/view/avator/face";
import { UserBox } from "rich/component/view/avator/user";
import { Button } from "rich/component/view/button";
import { RobotInfo } from "rich/types/user";
import { util } from "rich/util/util";
import { surface } from "../../../../app/store";
import { Divider } from "rich/component/view/grid";
import { S } from "rich/i18n/view";
import { AgentRequest } from "rich/net/ai/robot";
import { Point } from "rich/src/common/vector/point";
import { LinkPageItem, getPageIcon, getPageText } from "rich/src/page/declare";
import { DivInput } from "rich/component/view/input/div";
import { lst } from "rich/i18n/store";
import { PublishSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { ToolTip } from "rich/component/view/tooltip";
import { channel } from "rich/net/channel";
import Pic from "../../../../../assert/img/pig.png";

var messages: {
    id: string,
    userid: string,
    date: Date, refs: { elementUrl: string, page: LinkPageItem, blockIds: string[] }[], content: string
}[] = [];

export class RobotChat extends React.Component<{ robot: RobotInfo, close: () => void }> {
    constructor(props) {
        super(props);
    }
    pos: Point = new Point(0, 0);
    renderMessages() {
        return messages.map(msg => {
            return <div key={msg.id} className="gap-w-20 gap-b-10" >
                <UserBox userid={msg.userid}>{(user) => {
                    return <div className="flex flex-top gap-h-10">
                        <div className="flex-fixed gap-r-10">
                            <Avatar size={30} user={user}></Avatar>
                        </div>
                        <div className="flex-atuo">
                            <div className="flex">
                                <span className="flex-fixed">{user.name}</span>
                                <span className="flex-auto gap-l-10 remark f-12">{util.showTime(msg.date
                                )}</span>
                            </div>
                            <div className="f-14 text-1 md">
                                <div dangerouslySetInnerHTML={{ __html: msg.content }}>
                                </div>
                            </div>
                            {msg.refs && msg.refs.length > 0 && <div className="f-12 remark gap-b-3"><S>引用页面</S></div>}
                            {msg.refs?.map(rf => {
                                return <div className="flex gap-b-5" key={rf.page?.id}>
                                    <span onMouseDown={e => this.openPage(rf)} className="flex item-hover round gap-r-5 padding-w-3 l-20 "><Icon size={16} icon={getPageIcon(rf.page)}></Icon><span className="gap-l-5">{getPageText(rf.page)}</span></span>
                                    {rf.blockIds.length > 1 && <span className="flex flex-fixed ">{rf.blockIds.map((b, i) => {
                                        return <em onMouseDown={e => this.openPage(rf, b)} className="bg-hover bg-p-light text-p  padding-w-3 round gap-w-5 cursor" key={b}>{i}</em>
                                    })}</span>}
                                </div>
                            })}
                        </div>
                    </div>
                }}</UserBox>
            </div>
        })
    }
    openPage(page: {
        blockIds: string[];
        page: LinkPageItem<{}>;
        elementUrl: string;
    }, blockId?: string) {
        if (!blockId) blockId = page.blockIds[0];
        channel.air('/page/open', { elementUrl: page.elementUrl, config: { force: true, blockId: blockId } })
        // this.emit('close');
        if (this.props.close) this.props.close();
    }
    async send(event?: React.MouseEvent, b?: Button) {
        var message = this.message;
        messages.push({
            userid: surface.user.id,
            id: util.guid(),
            content: this.message,
            refs: [],
            date: new Date()
        })
        this.message = '';
        if (this.input) this.input.innerHTML = '';
        var cb = { userid: this.props.robot.robotId, id: util.guid(), content: '', refs: [], date: new Date() };
        messages.push(cb);
        this.forceUpdate(() => {
            if (this.scrollEl) {
                this.scrollEl.scrollTop = this.scrollEl.scrollHeight;
            }
        })
        await AgentRequest(this.props.robot, message, { isAt: false }, async (options) => {
            cb.content = options.done ? options.content : options.msg;
            cb.refs = options.refs;
            this.forceUpdate(() => {
                if (this.scrollEl) {
                    this.scrollEl.scrollTop = this.scrollEl.scrollHeight;
                }
            })
        })
    }
    message: string = '';
    renderSend() {
        return <div className="flex gap-w-20 padding-w-10    border shadow-s round-16 gap-t-10 gap-b-10" style={{ minHeight: 36 }}>
            <div className="flex-auto ">
                <DivInput
                    value={this.message}
                    rf={e => this.input == e}
                    onInput={e => { this.message = e }}
                    onEnter={e => { this.message = e; this.send() }}
                    className='min-h-20 l-20'
                    placeholder={lst("与机器人对话聊天...")} ></DivInput>
            </div>
            <ToolTip overlay={<div>
                <div className="flex"><span style={{ color: '#bbb' }}>Enter</span><span className="gap-l-5"><S>发送</S></span></div>
                <div className="flex"><span style={{ color: '#bbb' }}>Shift+Enter</span><span className="gap-l-5"><S>换行</S></span></div>
            </div>}><div onMouseDown={e => this.send()} className="flex-fixed text-1 size-24 flex-center item-hover round">
                    <Icon size={16} icon={PublishSvg}></Icon>
                </div>
            </ToolTip>
        </div>
    }
    input: HTMLElement;
    scrollEl: HTMLElement;
    visible: boolean = true;
    render(): ReactNode {
        var classList: string[] = [];
        var style: React.CSSProperties = {};
        return <div style={style} className={"bg-white border shadow-s   round    flex flex-full flex-col gap-b-100 " + classList.join(" ")}>
            <div>
                <div ref={e => this.scrollEl = e} className="max-h-400 min-h-300 padding-b-50 overflow-y padding-w-10">
                    {messages.length == 0 && <div className="flex-center gap-t-50">
                        <img src={Pic} className="obj-center " style={{ maxWidth: 500 }} />
                    </div>}
                    {this.renderMessages()}
                </div>
            </div>
            <Divider></Divider>
            <div className="padding-w-14">
                {this.renderSend()}
            </div>
        </div>
    }
}

