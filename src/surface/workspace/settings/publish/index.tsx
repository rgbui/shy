import React from "react";
import { Divider } from "rich/component/view/grid";
import { Switch } from "rich/component/view/switch";
import { surface } from "../../../store";
import { observer } from "mobx-react";
import { channel } from "rich/net/channel";
import lodash from "lodash";
import { Workspace, WorkspaceNavMenuItem } from "../..";
import { makeObservable, observable, runInAction } from "mobx";
import { SaveTip } from "../../../../component/tip/save.tip";
import { Avatar } from "rich/component/view/avator/face";
import { Icon } from "rich/component/view/icon";
import { ArrowDownSvg, ArrowLeftSvg, ArrowRightSvg, ArrowUpSvg, ChevronDownSvg, NoneSvg, PlusAreaSvg, PlusSvg, TrashSvg } from "rich/component/svgs";
import { config } from "../../../../../common/config";
import { Input } from "rich/component/view/input";
import { FileInput } from "rich/component/view/input/file";
import { SelectBox } from "rich/component/view/select/box";
import { Rect } from "rich/src/common/vector/point";
import { useSelectWorkspacePage } from "rich/extensions/link/select";
import { ToolTip } from "rich/component/view/tooltip";
import { BoxTip } from "rich/component/view/tooltip/box";
import { ShyUtil } from "../../../../util";
import { useIconPicker } from "rich/extensions/icon";
import { PageContentView } from "rich/extensions/page";
import { Tip } from "rich/component/view/tooltip/tip";
import { lst } from "rich/i18n/store";
import { S, Sp } from "rich/i18n/view";
import { UrlRoute } from "../../../../history";

@observer
export class SitePublishView extends React.Component {
    constructor(props) {
        super(props);
        makeObservable(this, {
            data: observable,
            error: observable,
            editItem: observable
        })
    }
    data: { publishConfig: Workspace['publishConfig'] } = {
        publishConfig: {
            abled: false,
            defineNavMenu: false,
            navMenus: [],
            isFullWidth: true,
            smallFont: true,
            contentTheme: 'default',
            defineContent: false,
            defineBottom: false
        }
    };
    error: Record<string, any> = {};
    tip: SaveTip;
    async save() {
        var r = await channel.patch('/ws/patch', {
            data: {
                publishConfig: lodash.cloneDeep(this.data.publishConfig)
            }
        });
        if (r.ok) {
            runInAction(() => {
                surface.workspace.publishConfig = lodash.cloneDeep(this.data.publishConfig);
                this.tip.close();
            })
        }
    }
    async reset() {
        this.data = {
            publishConfig: lodash.cloneDeep(surface.workspace.publishConfig)
        };
        if (!this.data.publishConfig?.navMenus || Array.isArray(this.data.publishConfig?.navMenus) && this.data.publishConfig.navMenus.length == 0) {
            this.data.publishConfig.navMenus = [{
                id: config.guid(),
                date: Date.now(),
                userid: surface.user?.id,
                type: 'logo',
                text: surface.workspace.text,
            }]
        }
        this.error = {};
        if (this.tip) this.tip.close();
    }
    componentDidMount() {
        this.reset();
    }
    change(key: string, value) {
        lodash.set(this.data, key, value);
        this.checkChange();
    }
    checkChange() {
        if (this.tip) {
            if (lodash.isEqual(this.data, lodash.pick(surface.workspace, ['publishConfig']))) this.tip.close()
            else this.tip.open();
        }
    }
    editItem: WorkspaceNavMenuItem = null;
    refInput: Input;
    renderDefineTop() {
        var self = this;
        var h = 60;
        function renderNavs(childs: WorkspaceNavMenuItem[], deep = 0) {
            var style: React.CSSProperties = {
                top: h,
                right: 0
            }
            if (deep > 0) {
                style = {
                    left: '100%',
                    width: '100%',
                    top: 0,
                }
            }
            return <div className="pos border padding-5 round bg-white"
                style={style}>{childs.map((e, i) => {
                    return <div className="relative"
                        key={e.id}>
                        <BoxTip overlay={
                            <div className="flex-center">
                                <Tip text={'上移'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, childs, 'down')} ><Icon size={16} icon={ArrowDownSvg}></Icon></a></Tip>
                                <Tip text={'下移'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, childs, 'up')}><Icon size={16} icon={ArrowUpSvg}></Icon></a></Tip>
                                <Tip text={'添加'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, childs, 'add')}><Icon size={16} icon={PlusSvg}></Icon></a></Tip>
                                <Tip text={'添加子菜单'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, childs, 'add-sub')}><Icon size={16} icon={PlusAreaSvg}></Icon></a></Tip>
                                <Tip text={'删除'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, childs, 'remove')}><Icon size={16} icon={TrashSvg}></Icon></a></Tip>
                            </div>
                        }><div onMouseDown={eg => {
                            self.editItem = e
                            if (self.refInput) self.refInput.updateValue(e.text || lst('菜单项'))
                            e.spread = e.spread === true ? false : true;
                            self.forceUpdate();
                        }} className={"flex  round min-w-120 item-hover  padding-w-10 padding-h-5  " + (self.editItem == e ? "dashed" : 'border-t')} >
                                {e.icon && <span className="flex-fixed size-20 flex-center"><Icon size={18} icon={e.icon}></Icon></span>}
                                <span className="flex-auto text-overflow">{e.text || lst('菜单项')}</span>
                                <span className="flex-fixed">
                                    {Array.isArray(e.childs) && e.childs.length > 0 && <Icon size={16} icon={ChevronDownSvg}></Icon>}
                                </span>
                            </div></BoxTip>
                        {Array.isArray(e.childs) && e.childs.length > 0 && e.spread == true && renderNavs(e.childs, deep + 1)}
                    </div>
                })}</div>
        }
        async function openSelectPage(e: React.MouseEvent, item: WorkspaceNavMenuItem) {
            var g = await useSelectWorkspacePage({ roundArea: Rect.fromEle(e.currentTarget as HTMLElement) });
            if (g) {
                item.pageId = g.id;
                item.pageText = g.text;
                item.icon = g.icon;
                if (!item.text || item.text == lst('菜单项')) item.text = g.text;
                self.checkChange();
            }
        }
        async function changeIcon(e: React.MouseEvent, item: WorkspaceNavMenuItem) {
            var r = await useIconPicker({ roundArea: Rect.fromEle(e.currentTarget as HTMLElement) });
            if (typeof r !== 'undefined') {
                item.icon = r;
                self.checkChange();
                self.forceUpdate()
            }
        }
        function renderEditForm(item: WorkspaceNavMenuItem) {
            return <div className="card">
                <div className="h4"><S>自定义</S>{item.type == 'logo' ? "LOGO" : lst("项")}</div>
                <div className="r-gap-h-10">
                    {item.type !== "logo" && <div className="flex">
                        <label className="flex-fixed w-80 flex-end gap-r-5"><S>名称</S>:</label>
                        <div className="flex-auto flex">
                            <Tip text={'设置图标'}>
                                <span onMouseDown={e => {
                                    changeIcon(e, item)
                                }} className="size-30 cursor flex-fixed round item-hover flex-center"><Icon size={20} icon={item.icon || NoneSvg}></Icon></span>
                            </Tip>
                            <Input ref={e => self.refInput = e} className="flex-auto" value={item.text || lst('菜单项')}
                                onChange={e => { item.text = e; self.checkChange() }}></Input>
                        </div>
                    </div>}
                    {item.type == 'logo' &&
                        <><div className="flex">
                            <label className="flex-fixed w-80 flex-end gap-r-5"><S>名称</S>:</label>
                            <Input ref={e => self.refInput = e} className="flex-auto" value={item.text || lst('菜单项')}
                                onChange={e => { item.text = e; self.checkChange() }}></Input>
                        </div>
                            <div className="flex">
                                <label className="flex-fixed w-80 flex-end gap-r-5">LOGO:</label>
                                <FileInput className="flex-auto" mime="image" value={item.pic} onChange={e => { item.pic = e; self.checkChange() }}></FileInput>
                            </div>
                        </>
                    }
                    <div className="flex">
                        <label className="flex-fixed w-80 flex-end gap-r-5"><S>外链</S>:</label>
                        <div className="flex-auto">
                            <SelectBox border value={item.urlType} onChange={e => { item.urlType = e; self.checkChange() }} options={[
                                { text: lst('无连接'), value: 'none' },
                                { text: lst('跳转页面'), value: 'page' },
                                { text: lst('跳转网址'), value: 'url' }
                            ]}></SelectBox>
                        </div>
                    </div>
                    {item.urlType == 'url' && <div className="flex">
                        <label className="flex-fixed w-80 flex-end gap-r-5"><S>外链</S>:</label>
                        <div className="flex-auto">
                            <Input placeholder={lst("输入网址")} value={item.url} onChange={e => { item.url = e; self.checkChange() }}></Input>
                        </div>
                    </div>}
                    {item.urlType == 'page' && <div className="flex">
                        <label className="flex-fixed w-80 flex-end gap-r-5"><S>页面</S>:</label>
                        <div className="flex-auto">
                            <Input onMousedown={e => openSelectPage(e, item)} value={item.pageText} readonly></Input>
                        </div>
                    </div>}
                </div>
            </div>
        }
        function operatorItem(item: WorkspaceNavMenuItem, pas: WorkspaceNavMenuItem[], operator: 'down' | 'up' | 'add' | 'add-sub' | 'remove') {
            switch (operator) {
                case 'down':
                    var at = pas.findIndex(g => g === item);
                    ShyUtil.arrayMove(pas, item, at + 1);
                    self.checkChange()
                    break;
                case 'up':
                    var at = pas.findIndex(g => g === item);
                    ShyUtil.arrayMove(pas, item, at - 1);
                    self.checkChange()
                    break;
                case 'add':
                    var at = pas.findIndex(g => g === item);
                    if (at == -1) at = pas.length;
                    else at++;
                    pas.splice(at, 0, {
                        id: config.guid(),
                        date: Date.now(),
                        userid: surface.user?.id,
                        type: 'link',
                        text: '',
                        urlType: 'url'
                    })
                    self.checkChange()
                    break;
                case 'add-sub':
                    if (!Array.isArray(item.childs)) item.childs = [];
                    item.childs.push({
                        id: config.guid(),
                        date: Date.now(),
                        userid: surface.user?.id,
                        type: 'link',
                        text: '',
                        urlType: 'url'
                    })
                    self.checkChange()
                    break;
                case 'remove':
                    if (self.editItem?.id == item?.id) self.editItem = null;
                    lodash.remove(pas, g => g === item)
                    self.checkChange()
                    break;
            }
        }
        return <div>
            <Divider></Divider>
            <div className="flex f-14">
                <span><S>自定义应用头部导航条</S></span>
                <Switch checked={this.data.publishConfig.defineNavMenu} onChange={e => {
                    this.change('publishConfig.defineNavMenu', e)
                }}></Switch>
            </div>
            {this.data.publishConfig.defineNavMenu && <>
                <div className="flex min-h-100 flex-top">
                    <div className="flex-auto flex shadow gap-h-20">
                        <div className="flex-auto flex r-gap-r-10">
                            {this.data.publishConfig.navMenus.map((e, i) => {
                                return <div className="relative"
                                    key={e.id}>
                                    <BoxTip overlay={
                                        <div className="flex-center">
                                            {e.type != 'logo' && <>
                                                <Tip text={'前移'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, this.data.publishConfig.navMenus, 'up')} ><Icon size={16} icon={ArrowLeftSvg}></Icon></a></Tip>
                                                <Tip text={'后移'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, this.data.publishConfig.navMenus, 'down')}><Icon size={16} icon={ArrowRightSvg}></Icon></a></Tip>
                                                <Tip text={'添加'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, this.data.publishConfig.navMenus, 'add')}><Icon size={16} icon={PlusSvg}></Icon></a></Tip>
                                                <Tip text={'添加子菜单'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, this.data.publishConfig.navMenus, 'add-sub')}><Icon size={16} icon={PlusAreaSvg}></Icon></a></Tip>
                                                <Tip text={'删除'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, this.data.publishConfig.navMenus, 'remove')}><Icon size={16} icon={TrashSvg}></Icon></a></Tip>
                                            </>}
                                            {e.type == 'logo' && <>
                                                <Tip text={'添加菜单'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, this.data.publishConfig.navMenus, 'add')}><Icon size={16} icon={PlusAreaSvg}></Icon></a></Tip>
                                            </>}
                                        </div>
                                    }><div onMouseDown={eg => {
                                        e.spread = e.spread === true ? false : true;
                                        this.editItem = e
                                        if (self.refInput) self.refInput.updateValue(e.text || lst('菜单项'))
                                        self.forceUpdate();
                                    }} style={{ height: h }} className={"flex round padding-w-10  " + (this.editItem == e ? "dashed" : 'border-t')}>
                                            {e.type == 'logo' && e.pic && <img className="obj-center gap-r-10" style={{ height: 40 }} src={e.pic?.url} />}
                                            {e.icon && <span className="flex-fixed size-20 flex-center"><Icon size={18} icon={e.icon}></Icon></span>}
                                            <span className={"flex-auto" + (e.text ? " bold f-16" : " remark")}>{e.text || lst('菜单项')}</span>
                                            <span className="flex-fixed">
                                                {Array.isArray(e.childs) && e.childs.length > 0 && <Icon size={16} icon={ChevronDownSvg}></Icon>}
                                            </span>
                                        </div></BoxTip>
                                    {Array.isArray(e.childs) && e.childs.length > 0 && e.spread == true && renderNavs(e.childs)}
                                </div>
                            })}
                        </div>
                        <div className="flex-fixed gap-r-10">
                            <Avatar size={36} userid={surface.user.id}></Avatar>
                        </div>
                    </div>
                    {this.editItem && <div className="flex-fixed w-250 gap-l-10">
                        {renderEditForm(this.editItem)}
                    </div>}
                </div>
            </>}
        </div>
    }
    renderContent() {
        return <div>
            <div className="flex f-14">
                <span><S>自定义应用页面排版</S></span>
                <Switch checked={this.data.publishConfig.defineContent} onChange={e => {
                    this.change('publishConfig.defineContent', e)
                }}></Switch>
            </div>
            {this.data.publishConfig.defineContent && <><Divider></Divider>
                <div className="flex">
                    <div className="flex-auto"><S>页面排版</S></div>
                    <div className="flex-fixed">
                        <SelectBox border value={this.data.publishConfig.contentTheme || 'default'} options={
                            [
                                { text: lst('默认'), value: 'default' },
                                // { text: 'Wiki', value: 'wiki' },
                                { text: lst('无侧边栏'), value: 'none' }
                            ]
                        }
                            onChange={e => {
                                this.change('publishConfig.contentTheme', e)
                            }}
                        ></SelectBox>
                    </div>
                </div>
                {/* <div className="flex">
                    <span>页面宽屏</span>
                    <Switch checked={this.data.publishConfig.isFullWidth} onChange={e => {
                        this.change('publishConfig.isFullWidth', e)
                    }}></Switch>
                </div>
                <div className="flex">
                    <span>页面小字号</span>
                    <Switch checked={this.data.publishConfig.smallFont} onChange={e => {
                        this.change('publishConfig.smallFont', e)
                    }}></Switch>
                </div> */}
            </>}
        </div>
    }
    renderBottom() {
        return <div>
            <div className="flex f-14">
                <span><S>自定义应用底部内容</S></span>
                <Switch checked={this.data.publishConfig.defineBottom} onChange={e => {
                    this.change('publishConfig.defineBottom', e)
                }}></Switch>
            </div>
            {this.data.publishConfig.defineBottom && <div>
                <div className="relative h-300 overflow-y border round">
                    <PageContentView
                        requireSelectLayout={false}
                        onlyDisplayContent
                        wsId={surface.workspace.id}
                        canEdit
                        elementUrl="/Ws/doc/footer"></PageContentView>
                </div>
            </div>}
        </div>
    }
    render() {
        var domain = surface.workspace.siteDomain || surface.workspace.sn;
        return <div>
            <SaveTip ref={e => this.tip = e} save={e => this.save()} reset={e => this.reset()}></SaveTip><div className="h2">发布应用</div>
            <Divider></Divider>
            <div className="flex gap-t-20">
                <span className="flex-auto"><S>发布应用站点</S></span>
                <Switch checked={this.data.publishConfig.abled} onChange={e => {
                    this.change('publishConfig.abled', e)
                }}></Switch>
            </div>
            <div className="flex">
                <span className="f-14 remark ">
                    <Sp text={'公开至互联网后发布才有效果'} data={{url:`https://${domain}.`+UrlRoute.getHost()}}>公开至互联网后发布才有效果，发布后通过<a className={'underline link-remark'} href={`https://${domain}.`+UrlRoute.getHost()} target="_blank">{`https://${domain}.`+UrlRoute.getHost()}</a>访问</Sp>
            </span>
            </div>
            {this.data.publishConfig.abled && <div className="r-gap-h-10">
                {this.renderContent()}
                {this.renderDefineTop()}
                {/* {this.renderBottom()} */}
            </div>}
        </div>
    }
}