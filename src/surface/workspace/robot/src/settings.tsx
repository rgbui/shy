import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Button } from "rich/component/view/button";
import { Textarea } from "rich/component/view/input/textarea";

import { RobotInfo } from "rich/types/user";
import { masterSock } from "../../../../../net/sock";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";
import { SelectBox } from "rich/component/view/select/box";
import { Input } from "rich/component/view/input";
import { SwitchText } from "rich/component/view/switch";
import { MeasureView } from "rich/component/view/progress";
import lodash from "lodash";
import { CanSupportFeature, PayFeatureCheck } from "rich/component/pay";
import { surface } from "../../../app/store";
import { Divider } from "rich/component/view/grid";
import { OpenFileDialoug } from "rich/component/file";
import { channel } from "rich/net/channel";
import { config } from "../../../../../common/config";
import { checkModelPay, getAiDefaultModel, getAiEmbeddingsOptions, getAiImageModelOptions, getAiModelOptions } from "rich/net/ai/cost";
import { PopoverSingleton } from "rich/component/popover/popover";
import { PopoverPosition } from "rich/component/popover/position";
import { EventsComponent } from "rich/component/lib/events.component";

@observer
export class RobotSettingsView extends EventsComponent {
    constructor(props) {
        super(props);
        makeObservable(this, {
            localRobotInfo: observable,
        });
    }
    localRobotInfo: RobotInfo = null;
    robot: RobotInfo = null;
    onSave = async (b: Button, onlySave = false) => {

        try {
            b.loading = true;
            var props: Record<string, any> = {} as any;

            if (this.robot.name != this.localRobotInfo.name && this.localRobotInfo.name) {
                props.name = this.localRobotInfo.name;
            }
            if (this.robot.slogan != this.localRobotInfo.slogan && this.localRobotInfo.slogan) {
                props.slogan = this.localRobotInfo.slogan;
            }
            if (!lodash.isEqual(this.robot.avatar, this.localRobotInfo.avatar)) {
                props.avatar = this.localRobotInfo.avatar;
            }
            await masterSock.patch('/robot/set', {
                id: this.robot.id,
                data: {
                    model: this.localRobotInfo.model,
                    imageModel: this.localRobotInfo.imageModel,
                    disabledWiki: this.localRobotInfo.disabledWiki,
                    disabledImage: this.localRobotInfo.disabledImage,
                    disabledCommandModel: this.localRobotInfo.abledCommandModel,
                    disabledWorkspaceSearch: this.localRobotInfo.disabledWorkspaceSearch,
                    embeddingModel: this.localRobotInfo.embeddingModel,
                    instructions: this.localRobotInfo.instructions,
                    ...props,
                }
            })
            b.loading = false;
            Object.assign(this.robot, this.localRobotInfo)
        }
        catch (ex) {
            console.error(ex)
            b.loading = false;
        }
        finally {

        }
    }
    async onUploadFace() {
        var file = await OpenFileDialoug({ exts: ['image/*'] });
        if (file) {
            var r = await channel.post('/user/upload/file', { file, uploadProgress: (event) => { } })
            if (r.ok) {
                if (r.data.file.url) {
                    surface.user.onUpdateUserInfo({ avatar: { name: 'upload', url: r.data.file.url } })
                }
            }
        }
    }
    async removeFace() {
        surface.user.onUpdateUserInfo({ avatar: null })
    }
    onLayzeSave = lodash.debounce(async () => {
        this.onSave(this.button, true);
    }, 1000)
    button: Button;
    renderEdit() {
        return <div className="flex flex-top padding-10">
            <div className="flex-auto  ">
                <div className="remark   gap-b-5 f-12" >
                    <S>机器人名称</S>
                </div>
                <div className="">
                    <Input value={this.localRobotInfo.name} onChange={e => {
                        this.localRobotInfo.name = e;
                        this.onLayzeSave()
                    }} ></Input>
                </div>
                <div className="remark  gap-t-10 gap-b-5  f-12">
                    <S>描述</S>
                </div>
                <Textarea
                    placeholder={lst('描述机器人...')}
                    style={{ height: 50 }}
                    value={this.localRobotInfo.slogan}
                    onChange={e => {
                        this.localRobotInfo.slogan = e;
                        this.onLayzeSave()
                    }}
                ></Textarea>
                <div className="remark  gap-t-10 gap-b-5  f-12">
                    <S>指令角色</S>
                </div>
                <Textarea
                    placeholder={lst('描述机器人所扮演的角色...')}
                    style={{ height: 80 }}
                    value={this.localRobotInfo.instructions}
                    onChange={e => {
                        this.localRobotInfo.instructions = e;
                        this.onLayzeSave()
                    }}
                ></Textarea>
                <div className="remark  gap-t-10 gap-b-5  f-12" >
                    <S>语言模型</S>
                </div>
                <div className="">
                    <SelectBox
                        border
                        dropAlign="full"
                        checkChange={async e => {
                            return await checkModelPay(e, surface.workspace)
                        }}
                        options={
                            getAiModelOptions()
                        }
                        value={getAiDefaultModel(this.localRobotInfo.model)}
                        onChange={e => {
                            this.localRobotInfo.model = e;
                            this.onLayzeSave()
                        }}
                    ></SelectBox>
                </div>
            </div>
            <div className="flex-fixed w-200 gap-l-10 border round  gap-t-20 padding-10 ">
                <div className="remark   gap-b-5">
                    <SwitchText
                        checked={this.localRobotInfo.disabledWorkspaceSearch == true ? false : true}
                        onChange={e => { this.localRobotInfo.disabledWorkspaceSearch = e ? false : true; this.onLayzeSave() }}
                        align="left"
                    ><S>开启空间检索功能</S></SwitchText>
                </div>
                <div className="remark  gap-t-10 gap-b-5">
                    <SwitchText
                        checked={this.localRobotInfo.disabledWiki == true ? false : true}
                        onChange={e => { this.localRobotInfo.disabledWiki = e ? false : true; this.onLayzeSave() }}
                        align="left"
                    ><S>开启知识库</S></SwitchText>
                </div>
                {this.localRobotInfo.disabledWiki != true && <>
                    {/* <div className="remark  gap-t-10 gap-b-5  f-12"><S>向量存储</S></div>
                    <div>
                        <SelectBox
                            border
                            dropAlign="full"
                            options={getAiEmbeddingsOptions()}
                            value={getAiDefaultModel(this.localRobotInfo.embeddingModel, 'embedding')}
                            onChange={e => {
                                this.localRobotInfo.embeddingModel = e;
                                this.onLayzeSave()
                            }}
                        ></SelectBox>
                    </div> */}
                    <div className="remark  gap-t-10 gap-b-5  f-12"><S>检索片段数</S></div>
                    <div>
                        <MeasureView
                            value={this.localRobotInfo.wikiConfig?.fragmentSize || 5}
                            min={0}
                            max={10}
                            onChange={e => {
                                lodash.set(this.localRobotInfo, 'wikiConfig.fragmentSize', e);
                                this.onLayzeSave()
                            }}
                        ></MeasureView>
                    </div>
                    <div className="remark  gap-t-10 gap-b-5  f-12"><S>上下文片段数</S></div>
                    <div>
                        <MeasureView
                            value={this.localRobotInfo.wikiConfig?.fragmentContextSize || 10}
                            min={0}
                            max={20}
                            onChange={e => {
                                lodash.set(this.localRobotInfo, 'wikiConfig.fragmentContextSize', e);
                                this.onLayzeSave()
                            }}
                        ></MeasureView>
                    </div>
                    <div className="remark  gap-t-10 gap-b-5  f-12"><S>最低相似度</S></div>
                    <div>
                        <MeasureView
                            value={this.localRobotInfo.wikiConfig?.minLowerRank || 0.3}
                            min={0}
                            max={1}
                            ratio={0.1}
                            onChange={e => {
                                lodash.set(this.localRobotInfo, 'wikiConfig.minLowerRank', e);
                                this.onLayzeSave()
                            }}
                        ></MeasureView>
                    </div>
                </>}

                {config.isDev || config.isBeta || surface.workspace?.sn < 20 && <>
                    <Divider></Divider>
                    <div className="remark  gap-t-10 gap-b-5">
                        <SwitchText
                            checked={this.localRobotInfo.disabledImage == true ? false : true}
                            onChange={e => { this.localRobotInfo.disabledImage = e ? false : true; this.onLayzeSave() }}
                            align="right"
                        ><S>生成图片</S></SwitchText>
                    </div>

                    {this.localRobotInfo.disabledImage !== true && <>
                        <div>
                            <SelectBox
                                small
                                border
                                dropWidth={250}
                                dropAlign="right"
                                checkChange={async e => {
                                    return CanSupportFeature(PayFeatureCheck.aiImage, surface.workspace)
                                }}
                                options={
                                    getAiImageModelOptions()
                                }
                                value={this.localRobotInfo.imageModel || (window.shyConfig.isUS ? "gpt-dall-3" : "6pen")}
                                onChange={e => {
                                    this.localRobotInfo.imageModel = e;
                                    this.onLayzeSave()
                                }}
                            ></SelectBox>
                        </div>
                    </>}
                    {/* <Divider></Divider>
                    <div className="remark  gap-t-10 gap-b-5">
                        <SwitchText
                            checked={this.localRobotInfo.abledCommandModel == true ? false : true}
                            onChange={e => { this.localRobotInfo.abledCommandModel = e ? false : true; this.onLayzeSave() }}
                            align="right"
                        ><S>开启动作</S></SwitchText>
                    </div> */}
                </>}
            </div>
        </div>
    }
    render() {
        return <div className="w-600  bg-white shadow-s border round " >
            <div className="h-400">
                {this.localRobotInfo && this.renderEdit()}
            </div>
            <div className="border-top padding-h-5 flex-end padding-w-10">
                <Button ref={e => this.button = e} onClick={(e, b) => this.onSave(b)}><S>保存</S></Button>
            </div>
        </div>
    }
    open(robot: RobotInfo) {
        this.robot = robot;
        this.localRobotInfo = {
            slogan: robot.slogan || '',
            model: robot.model || (window.shyConfig.isUS ? "gpt-3.5-turbo" : "ERNIE-Bot-turbo"),
            name: robot.name || '',
            avatar: robot.avatar,
            instructions: robot.instructions || '',
            imageModel: robot.imageModel || '',
            disabledWiki: typeof robot.disabledWiki == 'boolean' ? robot.disabledWiki : false,
            disabledImage: typeof robot.disabledImage == 'boolean' ? robot.disabledImage : false,
            abledCommandModel: typeof robot.abledCommandModel == 'boolean' ? robot.abledCommandModel : false,
            embeddingModel: robot.embeddingModel || '',
            wikiConfig: robot.wikiConfig || {
                fragmentSize: 5,
                fragmentContextSize: 10,
                minLowerRank: 0.3
            }
        } as any;
    }
}

export async function useRobotSettings(robot: RobotInfo) {
    var pos: PopoverPosition = { center: true };
    let popover = await PopoverSingleton(RobotSettingsView, { mask: true, frame: true, shadow: true, });
    let fv = await popover.open(pos);
    fv.open(robot);
    return new Promise((resolve: (p: { id: string, content?: string }) => void, reject) => {
        fv.only('save', (value) => {
            popover.close();
            resolve(value);
        });
        fv.only('close', () => {
            popover.close();
            resolve(null);
        });
        popover.only('close', () => {
            resolve(null)
        });
    })
}

