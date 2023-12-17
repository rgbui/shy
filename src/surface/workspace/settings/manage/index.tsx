import lodash from "lodash";
import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Divider } from "rich/component/view/grid";
import { Input } from "rich/component/view/input";
import { Switch, SwitchText } from "rich/component/view/switch";
import { channel } from "rich/net/channel";
import { Workspace } from "../..";
import { surface } from "../../../store";
import { SaveTip } from "../../../../component/tip/save.tip";
import { useSelectWorkspacePage } from "rich/extensions/link/select"
import { Rect } from "rich/src/common/vector/point";
import { SelectBox } from "rich/component/view/select/box";
import { S } from "rich/i18n/view";

import { CanSupportFeature, PayFeatureCheck } from "rich/component/pay";
import { getPageText } from "rich/src/page/declare";
import { WsConsumeType, checkModelPay, getModelOptions } from "rich/net/ai/cost";
import { config } from "../../../../../common/config";

@observer
export class WorkspaceManage extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            data: observable,
            error: observable
        })
    }
    data: { createPageConfig: Workspace['createPageConfig'], aiConfig: Workspace['aiConfig'] } & { defaultPageId?: string, defaultPageTitle?: string, allowSlnIcon?: boolean } = {
        createPageConfig: {
            isFullWidth: true,
            smallFont: false,
            nav: false,
            autoRefPages: false,
            autoRefSubPages: true,
        },
        defaultPageId: null,
        defaultPageTitle: '',
        allowSlnIcon: false,
        aiConfig: {
            text: config.isUS ? WsConsumeType.gpt_35_turbo : WsConsumeType.ERNIE_Bot,
            image: config.isUS ? WsConsumeType.dall_3 : WsConsumeType.badiu_Stable_Diffusion_XL,
            embedding: config.isUS ? WsConsumeType.gpt_embedding : WsConsumeType.baidu_embedding,
            aiSearch: false,
            disabled: false
        }
    };
    error: Record<string, any> = {};
    tip: SaveTip;
    componentDidMount() {
        this.reset();
    }
    change(key: string, value) {
        lodash.set(this.data, key, value);
        this.checkChange();
    }
    checkChange() {
        if (this.tip) {
            if (lodash.isEqual(this.data, lodash.pick(surface.workspace, ['allowSlnIcon', 'aiConfig', 'slnStyle', 'createPageConfig', 'defaultPageId'])))
                this.tip.close()
            else this.tip.open();
        }
    }
    async save() {
        var r = await channel.patch('/ws/patch', {
            data: {
                createPageConfig: lodash.cloneDeep(this.data.createPageConfig),
                defaultPageId: lodash.cloneDeep(this.data.defaultPageId),
                allowSlnIcon: this.data.allowSlnIcon,
                aiConfig: lodash.cloneDeep(this.data.aiConfig)
            }
        });
        if (r.ok) {
            runInAction(() => {
                surface.workspace.createPageConfig = lodash.cloneDeep(this.data.createPageConfig);
                surface.workspace.defaultPageId = lodash.cloneDeep(this.data.defaultPageId);
                surface.workspace.allowSlnIcon = this.data.allowSlnIcon;
                surface.workspace.aiConfig = lodash.cloneDeep(this.data.aiConfig);

                this.tip.close();
            })
        }
    }
    async reset() {
        this.data.defaultPageTitle = '';
        this.data = {
            aiConfig: lodash.cloneDeep(surface.workspace.aiConfig),
            createPageConfig: lodash.cloneDeep(surface.workspace.createPageConfig)
        };
        this.data.defaultPageId = surface.workspace.defaultPageId;
        this.data.allowSlnIcon = surface.workspace.allowSlnIcon;
        if (this.data.defaultPageId) {
            var r = await channel.get('/page/query/info', { id: this.data.defaultPageId });
            if (r.ok) {
                this.data.defaultPageTitle = getPageText(r.data);
            }
        }
        this.error = {};
        if (this.tip) this.tip.close();
    }
    async open(e: React.MouseEvent) {
        var g = await useSelectWorkspacePage({ roundArea: Rect.fromEle(e.currentTarget as HTMLElement) });
        if (g) {
            this.data.defaultPageId = g.id;
            this.data.defaultPageTitle = getPageText(g);
            this.checkChange();
        }
    }
    render() {
        return <div className='shy-ws-manage'>
            <SaveTip ref={e => this.tip = e} save={e => this.save()} reset={e => this.reset()}></SaveTip>
            <div className="h2"><S>空间管理</S></div>
            <Divider></Divider>
            <div className="gap-t-10 gap-b-20">
                <div className="bold f-14"><S>新页面默认选项</S></div>
                <div className="remark f-12 gap-h-10"><S text='创建新页面时默认开启以下配置'>在创建新页面时，默认开启以下配置</S></div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1"><S>自适应宽度</S></div>
                    <div className="flex-fixed"><Switch onChange={e => this.change('createPageConfig.isFullWidth', e)} checked={this.data.createPageConfig.isFullWidth}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1"><S>小字体</S></div>
                    <div className="flex-fixed"><Switch onChange={e => this.change('createPageConfig.smallFont', e)} checked={this.data.createPageConfig.smallFont}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1"><S>目录大纲</S></div>
                    <div className="flex-fixed"><Switch onChange={e => this.change('createPageConfig.nav', e)} checked={this.data.createPageConfig.nav}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1"><S text='显示关联引用'>显示关联引用(反链）</S></div>
                    <div className="flex-fixed"><Switch onChange={e => this.change('createPageConfig.autoRefPages', e)} checked={this.data.createPageConfig.autoRefPages}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1"><S>父页面引用子页面</S></div>
                    <div className="flex-fixed"><Switch onChange={e => this.change('createPageConfig.autoRefSubPages', e)} checked={this.data.createPageConfig.autoRefSubPages}></Switch></div>
                </div>
            </div>
            <Divider></Divider>
            <div className="gap-t-10 gap-b-20">
                <div className="bold f-14"><S>空间默认首页</S></div>
                <div className="remark f-12 gap-h-10"><S text={'通过自定义域名打开时'}>通过自定义域名打开时，默认显示初始页面</S></div>
                <div className="max-w-500">
                    <Input onMousedown={e => this.open(e)} value={this.data.defaultPageTitle} readonly></Input>
                </div>
            </div>

            <Divider></Divider>
            <div className="gap-t-10 gap-b-20">

                <div className="bold f-14"><S>空间搜索</S></div>

                <div className="flex gap-t-10">
                    <div className="flex-auto  f-14 text-1"><S>站内搜索</S></div>
                    <div className="flex-fixed">
                        <Switch onChange={e => this.change('aiConfig.esSearch', e)} checked={this.data.aiConfig.esSearch}></Switch>
                    </div>
                </div>
                <div className="gap-b-10 f-12 remark"><S>基于Elasticsearch空间内搜索</S></div>

                <div className="flex gap-t-10">
                    <div className="flex-auto  f-14 text-1"><S>智能搜索</S></div>
                    <div className="flex-fixed"><SwitchText
                        onChange={e => this.change('aiConfig.aiSearch', e)}
                        checked={this.data.aiConfig.aiSearch}>
                    </SwitchText></div>
                </div>
                <div className="gap-b-10 f-12 remark"><S>基于AI大模型QA问答搜索</S></div>

                <div className="flex gap-t-10">
                    <div className="flex-auto  f-14 text-1"><S>SEO优化</S></div>
                    <div className="flex-fixed"><SwitchText
                        onChange={e => this.change('aiConfig.seoSearch', e)}
                        checked={this.data.aiConfig.seoSearch}>
                    </SwitchText></div>
                </div>
                <div className="gap-b-10 f-12 remark"><S>支持百度、Google收录搜索</S></div>
            </div>

            <Divider></Divider>
            <div className="gap-t-10 gap-b-20">
                <div className="bold f-14"><S>空间侧边栏设置</S></div>
                <div className="flex gap-t-10">
                    <div className="flex-auto  f-14 text-1"><S>关闭自定义图标</S></div>
                    <div className="flex-fixed"><Switch onChange={e => this.change('allowSlnIcon', e ? false : true)} checked={this.data.allowSlnIcon === false ? false : true}></Switch></div>
                </div>
                <div className="remark f-12 gap-b-10"><S>关闭侧边栏页面图标自定义显示</S></div>
            </div>

            <Divider></Divider>
            <div className="gap-t-10 gap-b-20">
                <div className="bold f-14"><S>AI写作</S></div>
                <div className="f-12 gap-h-10 flex">
                    <span className="flex-auto flex">
                        <SwitchText
                            align="right"
                            onChange={e => this.change('aiConfig.disabled', e ? false : true)}
                            checked={this.data.aiConfig.disabled ? false : true}><span
                            ><S>开启AI写作</S></span>
                        </SwitchText>
                    </span>
                </div>
                {!(this.data.aiConfig.disabled == true) && <>
                    {!window.shyConfig.isUS && <div className="flex f-12 remark">
                        <S text="OpenAI涉及数据安全">OpenAI涉及数据安全，不建立使用，仅限体验，由此引发的数据安全，自行承担责任。</S>
                    </div>}
                    <div className="flex gap-h-10">
                        <div className="flex-auto  f-14 text-1"><S>文本生成</S></div>
                        <div className="flex-fixed">
                            <SelectBox
                                small
                                dropWidth={250}
                                border
                                dropAlign="right"
                                checkChange={async e => {
                                    return await checkModelPay(e, surface.workspace)
                                }}
                                options={
                                    getModelOptions()
                                }
                                value={this.data.aiConfig?.text || (window.shyConfig.isUS ? WsConsumeType.gpt_35_turbo : WsConsumeType.ERNIE_Bot_turbo)}
                                onChange={e => { this.change('aiConfig.text', e) }}
                            ></SelectBox>
                        </div>
                    </div>
                    <div className="flex gap-h-10">
                        <div className="flex-auto  f-14 text-1"><S>图像生成</S></div>
                        <div className="flex-fixed">
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
                                        { text: 'DALLE-2', value: WsConsumeType.dall_2 },
                                        { text: 'DALLE-3', value: WsConsumeType.dall_3 },
                                        { text: 'Stability', value: WsConsumeType.stability }
                                    ] : [
                                        { text: 'Stable Diffusion XL', value: WsConsumeType.badiu_Stable_Diffusion_XL },
                                        { text: '6pen', value: WsConsumeType.pen_6 },
                                        { text: 'Stability', value: WsConsumeType.stability, label: '仅用于体验' },
                                        { text: 'DALLE-2', value: WsConsumeType.dall_2, label: '仅用于体验' },
                                        { text: 'DALLE-3', value: WsConsumeType.dall_3, label: '仅用于体验' },
                                    ]
                                }
                                value={this.data.aiConfig.image || (window.shyConfig.isUS ? WsConsumeType.dall_3 : WsConsumeType.pen_6)}
                                onChange={e => { this.change('aiConfig.image', e) }}
                            ></SelectBox>
                        </div>
                    </div>
                </>}
            </div>


            <div className="gap-h-200"></div>
        </div>
    }
}