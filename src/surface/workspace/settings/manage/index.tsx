import lodash from "lodash";
import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Divider } from "rich/component/view/grid";
import { Input } from "rich/component/view/input";
import { Switch } from "rich/component/view/switch";
import { channel } from "rich/net/channel";
import { Workspace } from "../..";
import { surface } from "../../../store";
import { SaveTip } from "../../../../component/tip/save.tip";
import { useSelectWorkspacePage } from "rich/extensions/link/select"
import { Point, Rect } from "rich/src/common/vector/point";
import { SelectBox } from "rich/component/view/select/box";
import { MenuFolderSvg, TreeListSvg } from "rich/component/svgs";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";

@observer
export class WorkspaceManage extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            data: observable,
            error: observable
        })
    }
    data: { createPageConfig: Workspace['createPageConfig'] } & { defaultPageId?: string, defaultPageTitle?: string, allowSlnIcon?: boolean, slnStyle?: Workspace['slnStyle'] } = {
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
        slnStyle: 'note'
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
            if (lodash.isEqual(this.data, lodash.pick(surface.workspace, ['allowSlnIcon', 'slnStyle', 'createPageConfig', 'defaultPageId'])))
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
                slnStyle: this.data.slnStyle
            }
        });
        if (r.ok) {
            runInAction(() => {
                surface.workspace.createPageConfig = lodash.cloneDeep(this.data.createPageConfig);
                surface.workspace.defaultPageId = lodash.cloneDeep(this.data.defaultPageId);
                surface.workspace.allowSlnIcon = this.data.allowSlnIcon;
                surface.workspace.slnStyle = this.data.slnStyle;
                this.tip.close();
            })
        }
    }
    async reset() {
        this.data.defaultPageTitle = '';
        this.data = { createPageConfig: lodash.cloneDeep(surface.workspace.createPageConfig) };
        this.data.defaultPageId = surface.workspace.defaultPageId;
        this.data.slnStyle = surface.workspace.slnStyle;
        this.data.allowSlnIcon = surface.workspace.allowSlnIcon;
        if (this.data.defaultPageId) {
            var page = await channel.get('/page/query/info', { id: this.data.defaultPageId });
            if (page.ok) {
                this.data.defaultPageTitle = page.data.text;
            }
        }
        this.error = {};
        if (this.tip)
            this.tip.close();
    }
    async open(e: React.MouseEvent) {
        var g = await useSelectWorkspacePage({ roundArea: Rect.fromEle(e.currentTarget as HTMLElement) });
        if (g) {
            this.data.defaultPageId = g.id;
            this.data.defaultPageTitle = g.text;
            this.checkChange();
        }
    }
    render() {
        return <div className='shy-ws-manage'>
            <SaveTip ref={e => this.tip = e} save={e => this.save()} reset={e => this.reset()}></SaveTip>
            <div className="h2"><S>空间管理</S></div>
            <Divider></Divider>
            <div className="gap-h-10">
                <div className="bold f-14"><S>新页面默认选项</S></div>
                <div className="remark f-12 gap-h-10"><S>在创建新页面时，默认开启以下配置</S></div>
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
                    <div className="flex-auto  f-14 text-1"><S>显示关联引用(反链）</S></div>
                    <div className="flex-fixed"><Switch onChange={e => this.change('createPageConfig.autoRefPages', e)} checked={this.data.createPageConfig.autoRefPages}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1"><S>父页面引用子页面</S></div>
                    <div className="flex-fixed"><Switch onChange={e => this.change('createPageConfig.autoRefSubPages', e)} checked={this.data.createPageConfig.autoRefSubPages}></Switch></div>
                </div>
            </div>
            <Divider></Divider>
            <div className="gap-h-10">
                <div className="bold f-14"><S>空间默认首页</S></div>
                <div className="remark f-12 gap-h-10"><S>通过自定义域名打开时，默认显示初始页面</S></div>
                <div className="max-w-500">
                    <Input onMousedown={e => this.open(e)} value={this.data.defaultPageTitle} readonly></Input>
                </div>
            </div>
            <Divider></Divider>
            <div className="gap-h-10">
                <div className="bold f-14"><S>左边侧边栏设置</S></div>
                <div className="remark f-12 gap-h-10"><S>左边侧边栏风格显示设置</S></div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1"><S>自定义图标</S></div>
                    <div className="flex-fixed"><Switch onChange={e => this.change('allowSlnIcon', e ? false : true)} checked={this.data.allowSlnIcon ? false : true}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1"><S>布局风格</S></div>
                    <div className="flex-fixed">
                        <SelectBox
                            small
                            border
                            options={[
                                { text: lst('目录'), value: 'note', icon: TreeListSvg },
                                { text: lst('菜单'), value: 'menu', icon: MenuFolderSvg },
                            ]}
                            value={this.data.slnStyle}
                            onChange={e => { this.change('slnStyle', e) }}
                        ></SelectBox>
                    </div>
                </div>
            </div>
        </div>
    }
}