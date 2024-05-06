import lodash from "lodash";
import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Divider } from "rich/component/view/grid";
import { Input } from "rich/component/view/input";
import { Switch, SwitchText } from "rich/component/view/switch";
import { channel } from "rich/net/channel";
import { Workspace } from "../..";
import { surface } from "../../../app/store";
import { SaveTip } from "../../../../component/tip/save.tip";
import { useSelectWorkspacePage } from "rich/extensions/link/select"
import { Rect } from "rich/src/common/vector/point";
import { SelectBox } from "rich/component/view/select/box";
import { S } from "rich/i18n/view";

import { CanSupportFeature, PayFeatureCheck } from "rich/component/pay";
import { getPageText } from "rich/src/page/declare";
import { checkModelPay, getAiDefaultModel, getAiImageModelOptions, getAiModelOptions } from "rich/net/ai/cost";
import { HelpText } from "rich/component/view/text";

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
            text: getAiDefaultModel(undefined, 'text'),
            image: getAiDefaultModel(undefined, 'image'),
            embedding: getAiDefaultModel(undefined, 'embedding'),
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
            if (lodash.isEqual(this.data, lodash.pick(surface.workspace, ['allowSlnIcon', 'aiConfig', 'slnStyle', 'createPageConfig', 'defaultPageId']))) this.tip.close()
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
                <div className="remark f-12 gap-b-10 gap-t-5"><S text='创建新页面时默认开启以下配置'>在创建新页面时，默认开启以下配置</S></div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1"><S>页面宽版</S></div>
                    <div className="flex-fixed"><Switch size="small" onChange={e => this.change('createPageConfig.isFullWidth', e)} checked={this.data.createPageConfig.isFullWidth}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1"><S>小字体</S></div>
                    <div className="flex-fixed"><Switch size="small" onChange={e => this.change('createPageConfig.smallFont', e)} checked={this.data.createPageConfig.smallFont}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1"><S>目录大纲</S></div>
                    <div className="flex-fixed"><Switch size="small" onChange={e => this.change('createPageConfig.nav', e)} checked={this.data.createPageConfig.nav}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1 flex">
                        <span className="gap-r-3"><S text='显示页面引用'>显示页面引用</S></span>
                        <HelpText url={window.shyConfig?.isUS ? "https://help.shy.red/page/57" : "https://help.shy.live/page/1894"}><S>了解页面引用</S></HelpText>
                    </div>
                    <div className="flex-fixed"><Switch size="small" onChange={e => this.change('createPageConfig.autoRefPages', e)} checked={this.data.createPageConfig.autoRefPages}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1 flex">
                        <span className="gap-r-3"> <S>父页面自动引用子页面</S></span>
                        <HelpText url={window.shyConfig?.isUS ? "https://help.shy.red/page/58#6j3epcxrGGxhoK2QbYjqfR" : "https://help.shy.live/page/1895#4F8weVwLrAVNjh2qwJDWqg"}><S>了解父页面引用</S></HelpText>
                    </div>
                    <div className="flex-fixed"><Switch size="small" onChange={e => this.change('createPageConfig.autoRefSubPages', e)} checked={this.data.createPageConfig.autoRefSubPages}></Switch></div>
                </div>
            </div>
            <Divider></Divider>
            <div className="gap-t-10 gap-b-20">
                <div className="bold f-14"><S>空间默认首页</S></div>
                <div className="remark f-12 gap-b-10 gap-t-5"><S text={'通过自定义域名打开时'}>通过自定义域名打开时，默认显示初始页面</S></div>
                <div className="max-w-500">
                    <Input onMousedown={e => this.open(e)} value={this.data.defaultPageTitle} readonly></Input>
                </div>
            </div>

            <Divider></Divider>
            <div className="gap-t-10 gap-b-20">

                <div className="bold f-14"><S>空间搜索</S></div>

                <div className="flex gap-t-10">
                    <div className="flex-auto  f-14 text-1"><S>空间搜索</S></div>
                    <div className="flex-fixed">
                        <Switch size="small" onChange={e => this.change('aiConfig.esSearch', e)} checked={this.data.aiConfig.esSearch}></Switch>
                    </div>
                </div>
                <div className="gap-b-10 f-12 remark"><S>基于Elasticsearch空间内搜索</S></div>

                <div className="flex gap-t-10">
                    <div className="flex-auto  f-14 text-1 flex">
                        <span className="gap-r-3"><S>智能搜索</S></span>
                        <span><HelpText url={window.shyConfig.isUS ? "https://help.shy.red/page/61#36astuDyScJiKa7xgSMFwq" : "https://help.shy.live/page/1553#5btvRFFL217adGAnGsT74D"}><S>了解诗云AI智能搜索</S></HelpText></span>
                    </div>
                    <div className="flex-fixed"><SwitchText size="small"
                        onChange={e => this.change('aiConfig.aiSearch', e)}
                        checked={this.data.aiConfig.aiSearch}>
                    </SwitchText></div>
                </div>
                <div className="gap-b-10 f-12 remark"><S>基于AI大模型QA问答搜索</S></div>

                <div className="flex gap-t-10">
                    <div className="flex-auto  f-14 text-1"><S>SEO优化</S></div>
                    <div className="flex-fixed"><SwitchText size="small"
                        onChange={e => this.change('aiConfig.seoSearch', e)}
                        checked={this.data.aiConfig.seoSearch}>
                    </SwitchText></div>
                </div>
                <div className="gap-b-10 f-12 remark"><S text='支持百度Google收录搜索'>支持百度、Google收录搜索</S></div>
            </div>

            <Divider></Divider>
            <div className="gap-t-10 gap-b-20">
                <div className="bold f-14"><S>空间侧边栏设置</S></div>
                <div className="flex gap-t-10">
                    <div className="flex-auto  f-14 text-1"><S>允许自定义图标</S></div>
                    <div className="flex-fixed"><Switch size="small" onChange={e => this.change('allowSlnIcon', e)} checked={this.data.allowSlnIcon}></Switch></div>
                </div>
                <div className="remark f-12 gap-b-10"><S>允许侧边栏页面图标自定义显示</S></div>
            </div>

            <Divider></Divider>
            <div className="gap-t-10 gap-b-20">
                <div className="flex">
                    <span className="bold f-14"><S>AI写作</S></span>
                    <HelpText url={window.shyConfig?.isUS ? "https://help.shy.red/page/60#ayTcRfRYxzeBSZ1H7DNzTF" : "https://help.shy.live/page/1552"}><S>了解诗云AI写作</S></HelpText>
                </div>
                <div className="f-12 gap-h-10 flex">
                    <span className="flex-auto flex">
                        <SwitchText size="small"
                            align="right"
                            onChange={e => this.change('aiConfig.disabled', e ? false : true)}
                            checked={this.data.aiConfig.disabled ? false : true}><span
                            ><S>开启AI写作</S></span>
                        </SwitchText>
                    </span>
                </div>
                {!(this.data.aiConfig.disabled == true) && <>
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
                                    getAiModelOptions()
                                }
                                value={getAiDefaultModel(this.data.aiConfig?.text)}
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
                                    getAiImageModelOptions()
                                }
                                value={getAiDefaultModel(this.data.aiConfig.image, 'image')}
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