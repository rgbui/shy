import dayjs from "dayjs";
import lodash from "lodash";
import React from "react";
import { ReactNode } from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Avatar } from "rich/component/view/avator/face";
import { UserBox } from "rich/component/view/avator/user";
import { Button } from "rich/component/view/button";
import { Textarea } from "rich/component/view/input/textarea";
import { Markdown } from "rich/component/view/markdown";
import { SelectBox } from "rich/component/view/select/box";
import { getTemplateInstance } from "rich/extensions/ai/prompt";
import { PopoverSingleton } from "rich/extensions/popover/popover";
import { channel } from "rich/net/channel";
import { GetRobotApplyArgs, RobotInfo } from "rich/types/user";
import { util } from "rich/util/util";
import { surface } from "../../../store";
import { marked } from "marked";
import { makeObservable, observable, toJS } from "mobx";
import { observer } from "mobx-react";
import { Divider } from "rich/component/view/grid";
import { DoubleRightSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { ToolTip } from "rich/component/view/tooltip";

export class RobotDebug extends EventsComponent {
    constructor(props) {
        super(props);
    }
    prompt: ArrayOf<RobotInfo['prompts']> = null;
    robot: RobotInfo = null;
    async open(robotInfo: RobotInfo, prompt?: ArrayOf<RobotInfo['prompts']>) {
        this.robot = robotInfo;
        this.prompt = prompt;
        if (!prompt) this.prompt = this.robot.prompts?.first() || null;
        this.forceUpdate();
    }
    messages: { id: string, userid: string, date: Date, promptSpread?: boolean, content: string, prompt?: string }[] = [];
    renderMessages() {
        return this.messages.map(msg => {
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
                            {msg.prompt && <div>
                                {msg.promptSpread && <div onClick={e => msg.promptSpread = false}><Markdown md={msg.prompt}></Markdown></div>}
                                {!msg.promptSpread && <ToolTip overlay={'展开实际发送的prompt'}>
                                    <span onClick={e => msg.promptSpread = true} className="size-24 flex-center cursor round item-hover"><Icon icon={DoubleRightSvg}></Icon></span>
                                </ToolTip>}
                            </div>}
                        </div>
                    </div>
                }}</UserBox>
            </div>
        })
    }
    async send(event: React.MouseEvent, b: Button) {
        try {
            var self = this;
            b.loading = true;
            var args: { name: string, input?: boolean, text: string, tip?: string }[] = [];
            args = GetRobotApplyArgs(this.prompt.apply);
            var parg = args.find(g => g.input == true);
            var ask = this.sendData[parg.name];
            var sd = { id: util.guid(), userid: surface.user?.id, date: new Date(), promptSpread: false, prompt: ask, content: ask }
            this.messages.push(sd)
            this.forceUpdate();
            var cb = { id: util.guid(), userid: this.robot.id, date: new Date(), content: '' };
            this.messages.push(cb);
            this.forceUpdate();
            var g = await channel.get('/query/wiki/answer', { robotId: this.robot.id, ask: ask });
            if (g.data?.contents?.length > 0) {
                var text = '';
                cb.content = `<span class='typed-print'></span>`;
                var content = getTemplateInstance(this.prompt.prompt, {
                    ...this.sendData,
                    context: g.data.contents[0].content
                });
                sd.prompt = content;
                this.forceUpdate();
                await channel.post('/text/ai/stream', {
                    question: content,
                    callback(str, done) {
                        console.log(str, done);
                        if (typeof str == 'string') text += str;
                        cb.content = marked.parse(text + (done ? "" : "<span class='typed-print'></span>"));
                        self.forceUpdate();
                    }
                });
            }
        }
        catch (ex) {
            console.error(ex);
        }
        finally {
            b.loading = false;
        }
    }
    sendData: Record<string, any> = {};
    renderSend() {
        if (!this.prompt) return null;
        var args: { name: string, text: string, tip?: string }[] = [];
        args = GetRobotApplyArgs(this.prompt.apply);
        return <div>
            {args.filter(g => g.name != 'context').map(arg => {
                return <div key={arg.name} className="flex flex-top gap-h-10 ">
                    <label className="flex-fixed flex-end gap-r-10 w-80 ">{arg.text}:</label>
                    <div className="flex-auto">
                        <Textarea
                            style={{ height: 40 }}
                            value={this.sendData[arg.name] || ''}
                            onChange={e => {
                                this.sendData[arg.name] = e;
                            }}
                            placeholder={arg.tip || ''}
                        ></Textarea>
                    </div>
                </div>
            })}
            <div className="flex  gap-h-10 ">
                <label className="flex-fixed w-80 gap-r-10 "></label>
                <div className="flex-auto">
                    <Button onClick={(e, b) => this.send(e, b)}>发送</Button>
                </div>
            </div>
        </div>
    }
    render(): ReactNode {
        return <div className="bg-white round padding-14 w-800 min-h-300 flex flex-full flex-col">
            <div className="flex h-30">
                <span className="flex-fixed gap-r-10">测试</span>
                <span className="flex-fixed w-120">
                    <SelectBox
                        value={this.prompt?.id}
                        onChange={e => {
                            this.prompt = (this.robot?.prompts || []).find(c => c.id == e)
                        }}
                        options={(this.robot?.prompts || []).map(pro => {
                            return {
                                text: pro.text,
                                value: pro.id
                            }
                        })}></SelectBox>
                </span>
            </div>
            <Divider></Divider>
            <div className="flex">
                <div className="flex-auto max-h-400 min-h-60 overflow-y padding-w-10">
                    {this.renderMessages()}
                    {this.messages.length == 0 && <div className="remark flex-center">
                        无记录
                    </div>}
                </div>
                <div className="flex-fixed w-200 border-left padding-w-10">
                    <div className="flex">prompt模板:</div>
                    <div className="remark">{this.prompt?.prompt}</div>
                </div>
            </div>
            <Divider></Divider>
            <div>
                {this.renderSend()}
            </div>
        </div>
    }
}


export async function useRobotDebug(robotInfo: RobotInfo, prompt?: ArrayOf<RobotInfo['prompts']>) {
    var popover = await PopoverSingleton(RobotDebug);
    var uf = await popover.open({ center: true, centerTop: 100 });
    uf.open(robotInfo, prompt);
    return new Promise((resolve: (d: ArrayOf<RobotInfo['prompts']>) => void, reject) => {
        uf.on('close', () => {
            popover.close()
            resolve(null);
        })
        uf.on('save', () => {
            popover.close()
            resolve(lodash.cloneDeep(uf.prompt));
        })
        popover.on('close', () => {
            resolve(null);
        })
    })
}