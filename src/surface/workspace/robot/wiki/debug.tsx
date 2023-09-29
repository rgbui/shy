import dayjs from "dayjs";
import lodash from "lodash";
import React from "react";
import { ReactNode } from "react";
import { EventsComponent } from "rich/component/lib/events.component";
import { Avatar } from "rich/component/view/avator/face";
import { UserBox } from "rich/component/view/avator/user";
import { Button } from "rich/component/view/button";
import { Textarea } from "rich/component/view/input/textarea";
import { SelectBox } from "rich/component/view/select/box";
import { getTemplateInstance } from "rich/extensions/ai/prompt";
import { channel } from "rich/net/channel";
import { GetRobotApplyArgs, RobotInfo } from "rich/types/user";
import { util } from "rich/util/util";
import { surface } from "../../../store";
import { marked } from "marked";
import { Divider } from "rich/component/view/grid";
import { CloseSvg, DoubleRightSvg, Edit1Svg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import { Tip } from "rich/component/view/tooltip/tip";
import { S } from "rich/i18n/view";
import { lst } from "rich/i18n/store";
import { getRobotWikiContext } from "rich/net/ai/robot";
import { Singleton } from "rich/component/lib/Singleton";
import { popoverLayer } from "rich/component/lib/zindex";
import { Point } from "rich/src/common/vector/point";

export class RobotDebug extends EventsComponent {
    constructor(props) {
        super(props);
    }
    prompt: ArrayOf<RobotInfo['prompts']> = null;
    robot: RobotInfo = null;
    spread: boolean = true;
    pos: Point = new Point(0, 0);
    async open(robotInfo: RobotInfo, prompt?: ArrayOf<RobotInfo['prompts']>) {
        this.robot = robotInfo;
        this.prompt = prompt;
        if (!prompt) this.prompt = this.robot.prompts?.first() || null;
        this.messages = [];
        this.spread = true;
        this.visible = true;
        this.pos = new Point(0, 0);
        this.forceUpdate();
    }
    messages: { id: string, promptId?: string, userid: string, date: Date, promptSpread?: boolean, content: string, prompt?: string }[] = [];
    renderMessages() {
        return this.messages.map(msg => {
            var pro = msg.promptId ? this.robot.prompts.find(p => p.id == msg.promptId) : undefined;
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
                            {pro && <div className="flex remark"><span><S>Prompt模板</S>:</span><span>{pro.text}</span></div>}
                            <div dangerouslySetInnerHTML={{ __html: msg.content }}>
                            </div>
                            {msg.prompt && <div>
                                {msg.promptSpread && <div className="remark f-12 item-hover round padding-5" onClick={e => {
                                    msg.promptSpread = false;
                                    this.forceUpdate()
                                }}>
                                    <pre>
                                        {msg.prompt}
                                    </pre>
                                </div>}
                                {!msg.promptSpread && <Tip text={'展开实际发送的prompt'}>
                                    <span onClick={e => { msg.promptSpread = true; this.forceUpdate() }} className="size-24 flex-center cursor round item-hover remark"><Icon icon={DoubleRightSvg}></Icon></span>
                                </Tip>}
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
            var sd = lodash.cloneDeep(this.sendData);
            for (let n in this.sendData) {
                this.sendData[n] = '';
            }
            if (this.sendEl) {
                var its = Array.from(this.sendEl.querySelectorAll('textarea,input')) as HTMLInputElement[];
                its.forEach(it => { it.value = '' })
            }
            b.loading = true;
            var args: { name: string, input?: boolean, text: string, tip?: string }[] = [];
            args = GetRobotApplyArgs(this.prompt?.apply);
            var parg = args.find(g => g.input == true);
            var ask = sd[parg.name];
            var sender = { id: util.guid(), userid: surface.user?.id, date: new Date(), promptSpread: false, prompt: ask, content: ask }
            this.messages.push(sender)
            this.forceUpdate();
            if (this.scrollEl) {
                this.scrollEl.scrollTop = this.scrollEl.scrollHeight;
            }
            var cb = { promptId: this.prompt?.id, id: util.guid(), userid: this.robot.id, date: new Date(), content: '' };
            this.messages.push(cb);
            this.forceUpdate();
            var cts = await getRobotWikiContext(this.robot, ask, this.prompt?.prompt || '')
            if (cts?.notFound) {
                cb.content = lst('未找到匹配的答案')
                self.forceUpdate(() => {
                    var el = document.querySelector('.typed-print');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'end' });
                });
            }
            else {
                var text = '';
                cb.content = `<span class='typed-print'></span>`;
                var content = this.prompt ? getTemplateInstance(this.prompt.prompt, {
                    ...sd,
                    context: cts?.context || '',
                }) : sd.prompt;
                sender.prompt = content;
                this.forceUpdate();
                await channel.post('/text/ai/stream', {
                    question: content,
                    model: self.robot.model || (window.shyConfig.isUS ? "gpt" : "ERNIE-Bot-turbo"),
                    callback(str, done) {
                        console.log(str, done);
                        if (typeof str == 'string') text += str;
                        cb.content = marked.parse(text + (done ? "" : "<span class='typed-print'></span>"));
                        self.forceUpdate(() => {
                            var el = document.querySelector('.typed-print');
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'end' });
                        });
                    }
                });
            }
            // }
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
        return <div ref={e => this.sendEl = e}>
            {args.filter(g => g.name != 'context').map((arg, i) => {
                return <div key={arg.name} className="flex flex-top gap-h-10 ">
                    <label className="flex-fixed flex-end gap-r-10 w-80 ">{arg.text}:</label>
                    <div className="flex-auto">
                        <Textarea
                            shiftEnter
                            style={{ height: 60 }}
                            value={this.sendData[arg.name] || ''}
                            onChange={e => {
                                this.sendData[arg.name] = e;
                            }}
                            placeholder={arg.tip || ''}
                            onEnter={e => {
                                this.sendData[arg.name] = e;
                                if (i == args.filter(g => g.name != 'context').length - 1) {
                                    this.send(null, this.button)
                                }
                            }}
                        ></Textarea>
                    </div>
                </div>
            })}
            <div className="flex  gap-h-10 ">
                <label className="flex-fixed w-80 gap-r-10 "></label>
                <div className="flex-auto">
                    <Button ref={e => this.button = e} onClick={(e, b) => this.send(e, b)}><S>发送</S></Button>
                    <span className="remark gap-l-10 f-12">shift + enter </span>
                </div>
            </div>
        </div>
    }
    button: Button;
    scrollEl: HTMLElement;
    sendEl: HTMLElement;
    visible: boolean = true;
    render(): ReactNode {
        var classList: string[] = [];
        var style: React.CSSProperties = {
            zIndex: popoverLayer.zoom(this), display: this.visible ? 'block' : 'none'
        };
        if (this.spread) {
            classList.push('pos-center');
        }
        else {
            style.bottom = 30;
            style.left = '50%';
            style.transform = 'translateX(-50%)'
        }
        return <div style={style} className={"bg-white border shadow pos  round  w-800  flex flex-full flex-col " + classList.join(" ")}>
            <div className="flex h-30 padding-w-10">
                <span className="flex-auto">
                    {/* <span className="flex-fixed gap-r-10"><S>调试</S></span> */}
                    {(this.robot?.prompts || []).length > 0 && <span className="flex-fixed w-120">
                        <SelectBox inline
                            value={this.prompt?.id}
                            onChange={e => {
                                this.prompt = (this.robot?.prompts || []).find(c => c.id == e)
                                this.forceUpdate()
                            }}
                            options={(this.robot?.prompts || []).map(pro => {
                                return {
                                    text: pro.text,
                                    value: pro.id,
                                    icon: pro.icon || Edit1Svg
                                }
                            })}></SelectBox>
                    </span>}
                </span>
                <span className="flex-fixed flex">
                    {!this.spread && <Tip text={'打开'}><span onMouseDown={e => { e.stopPropagation(); this.onSpread(true); }} className="size-24 flex-center cursor item-hover round"><Icon icon={{ name: 'bytedance-icon', code: 'double-up' }} size={18}></Icon></span></Tip>}
                    {this.spread && <Tip text={'折叠'}><span onMouseDown={e => { e.stopPropagation(); this.onSpread(false); }} className="size-24 flex-center cursor item-hover round"><Icon icon={{ name: 'bytedance-icon', code: 'click-to-fold' }} size={18}></Icon></span></Tip>}
                    <Tip text={'关闭'}>
                        <span onMouseDown={e => { e.stopPropagation(); this.onClose() }} className="size-24 flex-center cursor item-hover round"><Icon icon={CloseSvg} size={16}></Icon></span>
                    </Tip>
                </span>
            </div>
            {this.spread && <>
                <Divider></Divider>
                <div className="flex flex-full  padding-w-14">
                    <div ref={e => this.scrollEl = e} className="flex-auto max-h-400 min-h-120 padding-b-50 overflow-y padding-w-10">
                        {this.renderMessages()}
                        {this.messages.length == 0 && <div className="remark flex-center">
                            <S>无记录</S>
                        </div>}
                    </div>
                    {this.prompt && <div className="flex-fixed w-200 border-left padding-w-10">
                        <div className="flex"><S>Prompt模板</S>:</div>
                        <div className="remark pre">{this.prompt?.prompt}</div>
                    </div>}
                </div>
                <Divider></Divider>
                <div className="padding-w-14">
                    {this.renderSend()}
                </div>
            </>}
        </div>
    }
    onClose() {
        this.visible = false;
        this.emit('close');
        this.forceUpdate();
    }
    onSpread(spread: boolean) {
        this.spread = spread;
        this.forceUpdate();
    }
}

var uf: RobotDebug;
export var closeRobotDebug = () => {
    if (uf) {
        uf.onClose();
    }
}


export async function useRobotDebug(robotInfo: RobotInfo, prompt?: ArrayOf<RobotInfo['prompts']>) {
    uf = await Singleton(RobotDebug);
    uf.open(robotInfo, prompt);
    return new Promise((resolve: (d: ArrayOf<RobotInfo['prompts']>) => void, reject) => {
        uf.on('close', () => {
            resolve(null);
        })
        uf.on('save', () => {
            resolve(lodash.cloneDeep(uf.prompt));
        })
    })
}