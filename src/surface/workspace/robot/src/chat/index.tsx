import dayjs from "dayjs";
import React from "react";
import { ReactNode } from "react";
import { Avatar } from "rich/component/view/avator/face";
import { UserBox } from "rich/component/view/avator/user";
import { Button } from "rich/component/view/button";
import { RobotInfo } from "rich/types/user";
import { util } from "rich/util/util";
import { surface } from "../../../../store";
import { Divider } from "rich/component/view/grid";
import { S } from "rich/i18n/view";
import { AgentRequest } from "rich/net/ai/robot";
import { Point } from "rich/src/common/vector/point";
import { Input } from "rich/component/view/input";
import { LinkPageItem } from "rich/src/page/declare";

var messages: {
    id: string,
    userid: string,
    date: Date, refs: { elementUrl: string, page: LinkPageItem, blockIds: string[] }[], content: string
}[] = [];
export class RobotChat extends React.Component<{ robot: RobotInfo }> {
    constructor(props) {
        super(props);
    }
    pos: Point = new Point(0, 0);
    renderMessages() {
        return messages.map(msg => {
            return <div key={msg.id} >
                <UserBox userid={msg.userid}>{(user) => {
                    return <div className="flex flex-top gap-h-10">
                        <div className="flex-fixed gap-r-10">
                            <Avatar size={30} user={user}></Avatar>
                        </div>
                        <div className="flex-atuo">
                            <div className="flex">
                                <span className="flex-fixed">{user.name}</span>
                                <span className="flex-auto gap-l-10 remark">{dayjs(msg.date).format('YYYY-MM-DD HH:mm:ss')}</span>
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: msg.content }}>
                            </div>
                        </div>
                    </div>
                }}</UserBox>
            </div>
        })
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
        if (this.input)
            this.input.updateValue('');
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
        return <div className="gap-b-10">
            <Input ref={e => this.input = e} value={this.message}
                onChange={e => {
                    this.message = e;
                }}
                onEnter={e => {
                    this.message = e;
                    this.send();
                }}
            ></Input>
        </div>
    }
    input: Input;
    scrollEl: HTMLElement;

    visible: boolean = true;
    render(): ReactNode {
        var classList: string[] = [];
        var style: React.CSSProperties = {};

        return <div style={style} className={"bg-white border shadow   round    flex flex-full flex-col gap-b-100 " + classList.join(" ")}>

            <div>
                <div ref={e => this.scrollEl = e} className="max-h-400 min-h-120 padding-b-50 overflow-y padding-w-10">
                    {this.renderMessages()}
                    {messages.length == 0 && <div className="remark flex-center gap-h-30">
                        <S text="与{name}对话聊天" data={{ name: this.props.robot.name }}>与name对话聊天</S>
                    </div>}
                </div>
            </div>
            <Divider></Divider>
            <div className="padding-w-14">
                {this.renderSend()}
            </div>
        </div>
    }


}

