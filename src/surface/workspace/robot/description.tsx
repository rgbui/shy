import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { ShyAlert } from "rich/component/lib/alert";
import { EditSvg } from "rich/component/svgs";
import { Button } from "rich/component/view/button";
import { Icon } from "rich/component/view/icon";
import { Textarea } from "rich/component/view/input/textarea";
import { Markdown } from "rich/component/view/markdown";
import { RobotInfo } from "rich/types/user";
import { masterSock } from "../../../../net/sock";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";
import { SelectBox } from "rich/component/view/select/box";
import { MenuItemType } from "rich/component/view/menu/declare";
import { Input } from "rich/component/view/input";
import { SwitchText } from "rich/component/view/switch";
import { MeasureView } from "rich/component/view/progress";
import lodash from "lodash";

@observer
export class RobotInfoDescriptionView extends React.Component<{ robot: RobotInfo }>{
    constructor(props) {
        super(props);
        if (!this.props.robot.remark) this.isEdit = true;
        var robot = this.props.robot;
        this.localRobotInfo = {
            remark: robot.remark || '',
            model: robot.model || (window.shyConfig.isUS ? "gpt-3.5-turbo" : "ERNIE-Bot-turbo"),
            name: robot.name || '',
            imageModel: robot.imageModel || '',
            disabledWiki: typeof robot.disabledWiki == 'boolean' ? robot.disabledWiki : false,
            embeddingModel: robot.embeddingModel || '',
            wikiConfig: robot.wikiConfig || {
                fragmentSize: 5,
                fragmentContextSize: 10,
                minLowerRank: 0.3
            }
        } as any;
        makeObservable(this, {
            isEdit: observable,
            localRobotInfo: observable,
        });
    }
    isEdit: boolean = false;
    localRobotInfo: RobotInfo = null;
    onSave = async (b: Button, onlySave = false) => {
        if (!this.localRobotInfo.remark) return ShyAlert(lst('请介绍一下机器人,如何使用它'))
        try {
            b.loading = true;
            await masterSock.patch('/robot/set', {
                id: this.props.robot.id,
                data: {
                    remark: this.localRobotInfo.remark,
                    model: this.localRobotInfo.model,
                    imageModel: this.localRobotInfo.imageModel,
                    disabledWiki: this.localRobotInfo.disabledWiki,
                    embeddingModel: this.localRobotInfo.embeddingModel,
                }
            })
            if (this.props.robot.name != this.localRobotInfo.name && this.localRobotInfo.name) {
                await masterSock.patch('/robot/set', { id: this.props.robot.id, data: { name: this.localRobotInfo.name } })
                this.props.robot.name = this.localRobotInfo.name;
            }
            b.loading = false;
            Object.assign(this.props.robot, this.localRobotInfo)
            if (onlySave !== true)
                this.isEdit = false;
        }
        catch (ex) {
            console.error(ex)
            b.loading = false;
        }
        finally {

        }
    }
    onLayzeSave = lodash.debounce(async () => {
        this.onSave(this.button, true);
    }, 1000)
    button: Button;
    renderEdit() {
        var robot = this.props.robot;
        if (robot.scene == 'wiki') {
            return <div className="gap-b-200">
                <div className="flex gap-h-10">
                    <div className="flex-auto remark f-12"></div>
                    <div className="flex-fixed flex  r-gap-l-10">
                        <Button ref={e => this.button = e} onClick={(e, b) => this.onSave(b)}><S>保存</S></Button>
                        <Button onClick={e => this.isEdit = false} ghost><S>退出编辑</S></Button>
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
                        <div className="remark gap-t-10 gap-b-5 f-12" >
                            <S>文本生成</S>
                        </div>
                        <div className="">
                            <SelectBox
                                small
                                dropWidth={250}
                                border
                                dropAlign="right"
                                options={
                                    window.shyConfig.isUS ? [
                                        { text: 'OpenAI', type: MenuItemType.text },
                                        { text: 'GPT-3.5', value: 'gpt-3.5-turbo' },
                                        { text: 'GPT-4', value: 'gpt-4' },
                                    ] : [
                                        { text: lst('百度千帆'), type: MenuItemType.text, label: '文言一心' },
                                        { text: 'ERNIE-Bot', value: 'ERNIE-Bot' },
                                        { text: 'ERNIE-Bot-turbo', value: 'ERNIE-Bot-turbo' },

                                        { text: 'Llama', type: MenuItemType.text },
                                        { text: 'Llama-2-7b-chat', value: 'Llama-2-7b-chat' },
                                        { text: 'Llama-2-13b-chat', value: 'Llama-2-13b-chat' },
                                        { text: 'Llama-2-70B-Chat', value: 'Llama-2-70B-Chat' },

                                        { text: lst('智谱'), type: MenuItemType.text },
                                        // { text: 'ChatGLM2-6B', value: 'ChatGLM2-6B' },
                                        { text: 'ChatGLM2-6B-32K', value: 'ChatGLM2-6B-32K' },
                                        // { text: 'ChatGLM2-6B-INT4', value: 'ChatGLM2-6B-INT4' },

                                        { text: 'OpenAI', type: MenuItemType.text, label: lst('仅用于体验') },
                                        { text: 'GPT-3.5', value: 'gpt-3.5-turbo', label: lst('仅用于体验') },
                                        { text: 'GPT-4', value: 'gpt-4', label: lst('仅用于体验') },
                                    ]
                                }
                                value={this.localRobotInfo.model || (window.shyConfig.isUS ? "gpt-3.5-turbo" : "ERNIE-Bot-turbo")}
                                onChange={e => {
                                    this.localRobotInfo.model = e;
                                    this.onLayzeSave()
                                }}
                            ></SelectBox>
                        </div>
                        <div className="remark  gap-t-10 gap-b-5  f-12"><S>图像生成</S></div>
                        <div>
                            <SelectBox
                                small
                                border
                                dropWidth={250}
                                dropAlign="right"
                                options={
                                    window.shyConfig.isUS ? [
                                        { text: 'OpenAI DALLE2', value: 'gpt' },
                                        { text: 'Stability', value: 'Stability' }
                                    ] :
                                        [
                                            { text: '6pen', value: '6pen' },
                                            { text: 'Stability', value: 'Stability' },
                                            { text: 'OpenAI DALLE2', value: 'gpt', label: lst('仅用于体验') },
                                        ]
                                }
                                value={this.localRobotInfo.imageModel || (window.shyConfig.isUS ? "gpt" : "6pen")}
                                onChange={e => {
                                    this.localRobotInfo.imageModel = e;
                                    this.onLayzeSave()
                                }}
                            ></SelectBox>
                        </div>
                        <div className="remark  gap-t-10 gap-b-5  f-12">
                            <S>介绍一下机器人</S>
                        </div>
                        <Textarea
                            style={{ height: 500 }}
                            placeholder={lst("介绍一下机器人", "介绍一下机器人,如何使用它，支持markdown语法")}
                            value={this.localRobotInfo.remark}
                            onChange={e => {
                                this.localRobotInfo.remark = e;
                                this.onLayzeSave()
                            }}
                        ></Textarea></div>
                    <div className="flex-fixed w-200 gap-l-10 border round padding-14">
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
                                        { text: lst('百度文心向量Embeddings'), value: 'Baidu-Embedding-V1' },
                                        { text: 'OpenAI Embeddings', value: 'gpt', label: '仅用于体验' },
                                    ]}
                                    value={this.localRobotInfo.embeddingModel || (window.shyConfig.isUS ? "gpt" : "Baidu-Embedding-V1")}
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
                    </div>
                </div>
            </div>
        }
        else {
            return <div className="gap-b-200">
                <div className="flex gap-h-10">
                    <div className="flex-auto remark f-12"></div>
                    <div className="flex-fixed flex  r-gap-l-10">
                        <Button ref={e => this.button = e} onClick={(e, b) => this.onSave(b)}><S>保存</S></Button>
                        <Button onClick={e => this.isEdit = false} ghost><S>退出编辑</S></Button>
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
                            <S>介绍一下机器人</S>
                        </div>
                        <Textarea
                            style={{ height: 500 }}
                            placeholder={lst("介绍一下机器人", "介绍一下机器人,如何使用它，支持markdown语法")}
                            value={this.localRobotInfo.remark}
                            onChange={e => {
                                this.localRobotInfo.remark = e;
                                this.onLayzeSave()
                            }}
                        ></Textarea></div>
                    <div className="flex-fixed w-200 gap-l-10 border round padding-14">
                        <div className="remark  gap-t-10 gap-b-5">
                            <SwitchText
                                checked={this.localRobotInfo.abledCommandModel == true ? true : false}
                                onChange={e => { this.localRobotInfo.abledCommandModel = e; this.onLayzeSave() }}
                                align="right"
                            ><S>开启大模型</S></SwitchText>
                        </div>
                        {this.localRobotInfo.disabledWiki != true && <>
                            <div className="remark gap-t-10 gap-b-5 f-12" >
                                <S>文本生成</S>
                            </div>
                            <div className="">
                                <SelectBox
                                    small
                                    dropWidth={250}
                                    border
                                    dropAlign="right"
                                    options={
                                        window.shyConfig.isUS ? [
                                            { text: 'OpenAI', type: MenuItemType.text },
                                            { text: 'GPT-3.5', value: 'gpt-3.5-turbo' },
                                            { text: 'GPT-4', value: 'gpt-4' },
                                        ] : [
                                            { text: lst('百度千帆'), type: MenuItemType.text, label: '文言一心' },
                                            { text: 'ERNIE-Bot', value: 'ERNIE-Bot' },
                                            { text: 'ERNIE-Bot-turbo', value: 'ERNIE-Bot-turbo' },

                                            { text: 'Llama', type: MenuItemType.text },
                                            { text: 'Llama-2-7b-chat', value: 'Llama-2-7b-chat' },
                                            { text: 'Llama-2-13b-chat', value: 'Llama-2-13b-chat' },
                                            { text: 'Llama-2-70B-Chat', value: 'Llama-2-70B-Chat' },

                                            { text: lst('智谱'), type: MenuItemType.text },
                                            // { text: 'ChatGLM2-6B', value: 'ChatGLM2-6B' },
                                            { text: 'ChatGLM2-6B-32K', value: 'ChatGLM2-6B-32K' },
                                            // { text: 'ChatGLM2-6B-INT4', value: 'ChatGLM2-6B-INT4' },

                                            { text: 'OpenAI', type: MenuItemType.text, label: lst('仅用于体验') },
                                            { text: 'GPT-3.5', value: 'gpt-3.5-turbo', label: lst('仅用于体验') },
                                            { text: 'GPT-4', value: 'gpt-4', label: lst('仅用于体验') },
                                        ]
                                    }
                                    value={this.localRobotInfo.model || (window.shyConfig.isUS ? "gpt-3.5-turbo" : "ERNIE-Bot-turbo")}
                                    onChange={e => {
                                        this.localRobotInfo.model = e;
                                        this.onLayzeSave()
                                    }}
                                ></SelectBox>
                            </div>
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
                                        { text: lst('百度文心向量Embeddings'), value: 'Baidu-Embedding-V1' },
                                        { text: 'OpenAI Embeddings', value: 'gpt', label: '仅用于体验' },
                                    ]}
                                    value={this.localRobotInfo.embeddingModel || (window.shyConfig.isUS ? "gpt" : "Baidu-Embedding-V1")}
                                    onChange={e => {
                                        this.localRobotInfo.embeddingModel = e;
                                        this.onLayzeSave()
                                    }}
                                ></SelectBox>
                            </div>
                        </>}
                    </div>
                </div>
            </div>
        }
    }
    render() {
        var robot = this.props.robot;
        return <div>
            {this.isEdit && this.renderEdit()}
            {!this.isEdit && <div className="visible-hover">
                <div className="visible flex h-30">
                    <span className="flex-auto"></span>
                    <span className="flex-fixed link underline cursor flex r-gap-l-5 f-12"
                        onMouseDown={e => {
                            runInAction(() => {
                                this.isEdit = true;
                                this.localRobotInfo = {
                                    remark: robot.remark || '',
                                    model: robot.model || (window.shyConfig.isUS ? "gpt-3.5-turbo" : "ERNIE-Bot-turbo"),
                                    name: robot.name || '',
                                    imageModel: robot.imageModel || '',
                                    disabledWiki: typeof robot.disabledWiki == 'boolean' ? robot.disabledWiki : false,
                                    embeddingModel: robot.embeddingModel || '',
                                } as any;
                            })
                        }}
                    >
                        <Icon size={14} icon={EditSvg}></Icon>
                        <span><S>编辑</S></span>
                    </span>
                </div>
                <Markdown md={this.localRobotInfo.remark}></Markdown>
            </div>}
        </div>
    }
}