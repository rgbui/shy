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
import { surface } from "../../../store";
import { Divider } from "rich/component/view/grid";
import { OpenFileDialoug } from "rich/component/file";
import { channel } from "rich/net/channel";
import { config } from "../../../../../common/config";
import {  checkModelPay, getAiDefaultModel, getAiModelOptions } from "rich/net/ai/cost";

@observer
export class RobotInfoDescriptionView extends React.Component<{ robot: RobotInfo }>{
    constructor(props) {
        super(props);
        var robot = this.props.robot;
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
        makeObservable(this, {
            localRobotInfo: observable,
        });
    }
    localRobotInfo: RobotInfo = null;
    onSave = async (b: Button, onlySave = false) => {

        try {
            b.loading = true;
            var props: Record<string, any> = {} as any;

            if (this.props.robot.name != this.localRobotInfo.name && this.localRobotInfo.name) {
                props.name = this.localRobotInfo.name;
            }
            if (this.props.robot.slogan != this.localRobotInfo.slogan && this.localRobotInfo.slogan) {
                props.slogan = this.localRobotInfo.slogan;
            }
            if (!lodash.isEqual(this.props.robot.avatar, this.localRobotInfo.avatar)) {
                props.avatar = this.localRobotInfo.avatar;
            }
            await masterSock.patch('/robot/set', {
                id: this.props.robot.id,
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
            Object.assign(this.props.robot, this.localRobotInfo)
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
        var robot = this.props.robot;
        return <div className="gap-b-200">
            <div className="flex gap-h-10">
                <div className="flex-auto remark f-12"></div>
                <div className="flex-fixed flex  r-gap-l-10">
                    <Button ref={e => this.button = e} onClick={(e, b) => this.onSave(b)}><S>保存</S></Button>
                </div>
            </div>
            <div className="flex flex-top">
                <div className="flex-auto  border round  padding-14">
                    <div className="remark  gap-t-10 gap-b-5 f-12" >
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
                        style={{ height: 80 }}
                        value={this.localRobotInfo.instructions}
                        onChange={e => {
                            this.localRobotInfo.instructions = e;
                            this.onLayzeSave()
                        }}
                    ></Textarea>
                </div>
                <div className="flex-fixed w-200 gap-l-10 border round padding-14">

                    <div className="remark gap-t-10 gap-b-5 f-12" >
                        <S>语言模型</S>
                    </div>
                    <div className="">
                        <SelectBox
                            small
                            dropWidth={250}
                            border
                            dropAlign="right"
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
                    <Divider></Divider>
                    <div className="remark  gap-t-10 gap-b-5">
                        <SwitchText
                            checked={this.localRobotInfo.disabledWorkspaceSearch == true ? false : true}
                            onChange={e => { this.localRobotInfo.disabledWorkspaceSearch = e ? false : true; this.onLayzeSave() }}
                            align="right"
                        ><S>开启空间检索功能</S></SwitchText>
                    </div>

                    <div className="remark  gap-t-10 gap-b-5">
                        <SwitchText
                            checked={this.localRobotInfo.disabledWiki == true ? false : true}
                            onChange={e => { this.localRobotInfo.disabledWiki = e ? false : true; this.onLayzeSave() }}
                            align="right"
                        ><S>开启知识库</S></SwitchText>
                    </div>
                    {this.localRobotInfo.disabledWiki != true && <>
                        <div className="remark  gap-t-10 gap-b-5  f-12"><S>向量存储</S></div>
                        <div>
                            <SelectBox
                                small
                                border
                                dropAlign="right"
                                dropWidth={300}
                                options={window.shyConfig.isUS ? [
                                    { text: 'OpenAI Embeddings', value: 'gpt' },
                                ] : [
                                    { text: lst('文言一心'), value: 'Baidu-Embedding-V1' },
                                    { text: 'GPT Embeddings', value: 'gpt', label: '仅限体验' },
                                ]}
                                value={getAiDefaultModel(this.localRobotInfo.embeddingModel, 'embedding')}
                                onChange={e => {
                                    this.localRobotInfo.embeddingModel = e;
                                    this.onLayzeSave()
                                }}
                            ></SelectBox>
                        </div>
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
                                        window.shyConfig.isUS ? [
                                            { text: 'OpenAI DALLE3', value: 'gpt-dall-3' },
                                            { text: 'OpenAI DALLE2', value: 'gpt' },
                                            { text: 'Stability', value: 'Stability' }
                                        ] :
                                            [
                                                { text: '6PEN', value: '6pen' },
                                                { text: 'Stability', value: 'Stability' },
                                                { text: 'OpenAI DALLE2', value: 'gpt', label: lst('仅限体验') },
                                                { text: 'OpenAI DALLE3', value: 'gpt-dall-3', label: lst('仅限体验') },
                                            ]
                                    }
                                    value={this.localRobotInfo.imageModel || (window.shyConfig.isUS ? "gpt-dall-3" : "6pen")}
                                    onChange={e => {
                                        this.localRobotInfo.imageModel = e;
                                        this.onLayzeSave()
                                    }}
                                ></SelectBox>
                            </div>
                        </>}
                        <Divider></Divider>
                        <div className="remark  gap-t-10 gap-b-5">
                            <SwitchText
                                checked={this.localRobotInfo.abledCommandModel == true ? false : true}
                                onChange={e => { this.localRobotInfo.abledCommandModel = e ? false : true; this.onLayzeSave() }}
                                align="right"
                            ><S>开启动作</S></SwitchText>
                        </div>
                    </>}

                </div>
            </div>

        </div>
    }
    render() {
        var robot = this.props.robot;
        return <div>
            {this.renderEdit()}
        </div>
    }
}