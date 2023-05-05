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
import { Point } from "rich/src/common/vector/point";
import { SelectBox } from "rich/component/view/select/box";
import { MenuFolderSvg, TreeListSvg } from "rich/component/svgs";

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
        var g = await useSelectWorkspacePage({ roundPoint: Point.from(e) });
        if (g) {
            this.data.defaultPageId = g.id;
            this.data.defaultPageTitle = g.text;
            this.checkChange();
        }
    }
    render() {
        return <div className='shy-ws-manage'>
            <SaveTip ref={e => this.tip = e} save={e => this.save()} reset={e => this.reset()}></SaveTip>
            <div className="h2">空间管理</div>
            <Divider></Divider>
            <div className="gap-h-10">
                <div className="bold f-14">新页面默认选项</div>
                <div className="remark f-12 gap-h-10">在创建新页面时，默认开启以下配置</div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1">自适应宽度</div>
                    <div className="flex-fixed"><Switch onChange={e => this.change('createPageConfig.isFullWidth', e)} checked={this.data.createPageConfig.isFullWidth}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1">小字体</div>
                    <div className="flex-fixed"><Switch onChange={e => this.change('createPageConfig.smallFont', e)} checked={this.data.createPageConfig.smallFont}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1">目录大纲</div>
                    <div className="flex-fixed"><Switch onChange={e => this.change('createPageConfig.nav', e)} checked={this.data.createPageConfig.nav}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1">显示关联引用(反链）</div>
                    <div className="flex-fixed"><Switch onChange={e => this.change('createPageConfig.autoRefPages', e)} checked={this.data.createPageConfig.autoRefPages}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1">父页面引用子页面</div>
                    <div className="flex-fixed"><Switch onChange={e => this.change('createPageConfig.autoRefSubPages', e)} checked={this.data.createPageConfig.autoRefSubPages}></Switch></div>
                </div>
            </div>
            <Divider></Divider>
            <div className="gap-h-10">
                <div className="bold f-14">空间默认首页</div>
                <div className="remark f-12 gap-h-10">通过自定义域名打开时，默认显示初始页面</div>
                <div className="max-w-500">
                    <Input onMousedown={e => this.open(e)} value={this.data.defaultPageTitle} readonly></Input>
                </div>
            </div>
            <Divider></Divider>
            <div className="gap-h-10">
                <div className="bold f-14">资源管理器(侧栏）设置</div>
                <div className="remark f-12 gap-h-10">资源项的风格显示设置</div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1">资源项自定义图标</div>
                    <div className="flex-fixed"><Switch onChange={e => this.change('allowSlnIcon', e ? false : true)} checked={surface.workspace.allowSlnIcon ? false : true}></Switch></div>
                </div>
                <div className="flex gap-h-10">
                    <div className="flex-auto  f-14 text-1">资源布局风格</div>
                    <div className="flex-fixed">
                        <SelectBox
                            small
                            border
                            options={[
                                { text: '目录', value: 'note', icon: TreeListSvg },
                                { text: '菜单', value: 'menu', icon: MenuFolderSvg },
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