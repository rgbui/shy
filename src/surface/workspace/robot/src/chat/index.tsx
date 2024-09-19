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
import { PublishSvg, TrashSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { ToolTip } from "rich/component/view/tooltip";
import { channel } from "rich/net/channel";
import Pic from "../../../../../assert/img/pig.png";

const ROBOT_SEARCH_MESSAGES = 'ROBOT_SEARCH_MESSAGES';
export class RobotChat extends React.Component<{ robot: RobotInfo, close: () => void }> {
    constructor(props) {
        super(props);
    }
    messages: {
        id: string,
        userid: string,
        date: number,
        refs: { elementUrl: string, page: LinkPageItem, blockIds: string[] }[], content: string
    }[] = [];
    pos: Point = new Point(0, 0);
    renderMessages() {
        return this.messages.map(msg => {
            return <div key={msg.id} className="gap-w-20 gap-b-10" >
                <UserBox userid={msg.userid}>{(user) => {
                    return <div className="flex flex-top gap-h-10">
                        <div className="flex-fixed gap-r-10">
                            <Avatar size={30} user={user}></Avatar>
                        </div>
                        <div className="flex-atuo">
                            <div className="flex">
                                <span className="flex-fixed">{user.name}</span>
                                <span className="flex-auto gap-l-10 remark f-12">{util.showTime(typeof msg.date == 'number' ? new Date(msg.date) : msg.date)}</span>
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
        channel.act('/page/open', { elementUrl: page.elementUrl, config: { force: true, blockId: blockId } })
        if (this.props.close) this.props.close();
    }
    async send(event?: React.MouseEvent, b?: Button) {
        var message = this.message;
        this.messages.push({
            userid: surface.user.id,
            id: util.guid(),
            content: this.message,
            refs: [],
            date: Date.now()
        })
        this.message = '';
        if (this.input) this.input.setValue('');
        var cb = { userid: this.props.robot.robotId, id: util.guid(), content: '', refs: [], date: Date.now() };
        this.messages.push(cb);
        this.forceUpdate(() => {
            if (this.scrollEl) {
                this.scrollEl.scrollTop = this.scrollEl.scrollHeight;
            }
        })
        var ms = this.messages.filter(m => m.userid ? true : false);
        ms = ms.slice(0, -1);
        ms = util.getLatestDataWithMinInterval(ms, 1000 * 60 * 30);
        await AgentRequest(this.props.robot, message, {
            isAt: true,
            historyMessages: ms.map(c => c.content)
        }, async (options) => {
            cb.content = options.done ? options.content : options.msg;
            cb.refs = options.refs;
            await channel.act('/cache/set', { key: this.getCacheKey(), value: this.messages })
            this.forceUpdate(() => {
                if (this.scrollEl) {
                    this.scrollEl.scrollTop = this.scrollEl.scrollHeight;
                }
                if (this.input) this.input.setValue('');
                if (this.input)
                    this.input.focus();
            })
        })
    }
    message: string = '';
    renderSend() {
        return <div className="flex gap-w-20 padding-w-10    card-border round-16 gap-t-10 gap-b-10" style={{ minHeight: 36 }}>
            <div className="flex-auto ">
                <DivInput
                    value={this.message}
                    ref={e => { this.input = e }}
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
    getCacheKey() {
        return ROBOT_SEARCH_MESSAGES + this.props.robot.robotId;
    }
    async loadMessages() {
        var rs = await channel.query('/cache/get', { key: this.getCacheKey() });
        if (Array.isArray(rs)) this.messages = rs;
        this.forceUpdate();
    }
    input: DivInput;
    scrollEl: HTMLElement;
    visible: boolean = true;
    render(): ReactNode {
        var classList: string[] = [];
        var style: React.CSSProperties = {};
        return <div style={style} className={"bg-white card   round    flex flex-full flex-col gap-b-100 " + classList.join(" ")}>
            <div className="flex">
                <div className="flex-auto"></div>
                <div className="flex-fixed">
                    <ToolTip overlay={<S>清理会话</S>}>
                        <span onMouseDown={e => {
                            this.messages = [];
                            this.forceUpdate();
                            channel.act('/cache/set', { key: this.getCacheKey(), value: [] })
                        }} className="size-20 text-1 flex-center round item-hover cursor">
                            <Icon icon={TrashSvg} size={16}></Icon>
                        </span>
                    </ToolTip>
                </div>
            </div>
            <div>
                <div ref={e => this.scrollEl = e} className="max-h-400 min-h-300 padding-b-50 overflow-y padding-w-10">
                    {this.messages.length == 0 && <div className="flex-center gap-t-50">
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
    componentDidMount(): void {
        this.loadMessages();
    }
    shouldComponentUpdate(nextProps: Readonly<{ robot: RobotInfo; close: () => void; }>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (this.props.robot.robotId != nextProps.robot.robotId) {
            this.messages = [];
            this.loadMessages();
        }
        return true;
    }
}

