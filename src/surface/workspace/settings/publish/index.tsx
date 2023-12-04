import React from "react";
import { Divider } from "rich/component/view/grid";
import { Switch } from "rich/component/view/switch";
import { surface } from "../../../store";
import { observer } from "mobx-react";
import { channel } from "rich/net/channel";
import lodash from "lodash";
import { Workspace } from "../..";
import { makeObservable, observable, runInAction } from "mobx";
import { SaveTip } from "../../../../component/tip/save.tip";
import { Avatar } from "rich/component/view/avator/face";
import { Icon } from "rich/component/view/icon";
import { ArrowDownSvg, ArrowLeftSvg, ArrowRightSvg, ArrowUpSvg, ChevronDownSvg, NoneSvg, PlusAreaSvg, PlusSvg, SearchSvg, TrashSvg } from "rich/component/svgs";
import { config } from "../../../../../common/config";
import { Input } from "rich/component/view/input";
import { FileInput } from "rich/component/view/input/file";
import { SelectBox } from "rich/component/view/select/box";
import { Rect } from "rich/src/common/vector/point";
import { useSelectWorkspacePage } from "rich/extensions/link/select";
import { BoxTip } from "rich/component/view/tooltip/box";
import { ShyUtil } from "../../../../util";
import { useIconPicker } from "rich/extensions/icon";
import { Tip } from "rich/component/view/tooltip/tip";
import { lst } from "rich/i18n/store";
import { S, Sp } from "rich/i18n/view";
import { UrlRoute } from "../../../../history";
import { Textarea } from "rich/component/view/input/textarea";
import { WorkspaceNavMenuItem } from "rich/src/page/declare";

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
            defineBottom: false,
            allowSearch: false
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
    editItemDeep: number = 0;
    refInput: Input;
    refTextArea: Textarea;
    refPageText: Input;
    renderDefineTop() {
        var self = this;
        var h = 60;
        function renderNavs(childs: WorkspaceNavMenuItem[], deep = 0) {
            var style: React.CSSProperties = {
                top: h,
                right: 0
            }
            if (deep > 1) {
                style = {
                    left: '100%',
                    width: '100%',
                    top: 0,
                }
            }
            function mousedown(e: WorkspaceNavMenuItem) {
                self.editItem = e
                self.editItemDeep = deep;
                if (self.refInput) self.refInput.updateValue(e.text || lst('菜单项'))
                if (self.refTextArea) self.refTextArea.updateValue(e.remark || '')
                if (self.refPageText) self.refPageText.updateValue(e.pageText || '')
                e.spread = e.spread === true ? false : true;
                self.forceUpdate();
            }
            function renderItem(e: WorkspaceNavMenuItem) {
                var hasLink = e.urlType == 'page' && e.pageId || e.urlType == 'url' && e.url;
                return <div onMouseDown={eg => {
                    mousedown(e);
                }} className={"flex round min-w-120   padding-w-10 padding-h-5  " + (e.remark ? " flex-top " : "") + (hasLink ? " item-hover " : " remark f-12 ") + (self.editItem == e ? "dashed" : 'border-t')} >
                    {e.icon && <span className="flex-fixed size-20 flex-center"><Icon size={hasLink ? 16 : 12} icon={e.icon}></Icon></span>}
                    {!e.remark && <span className="flex-auto text-overflow">
                        {e.text || lst('菜单项')}
                    </span>}
                    {e.remark && <div className="flex-auto">
                        <div>{e.text || lst('菜单项')}</div>
                        <div className="remark">{e.remark}</div>
                    </div>}
                    <span className="flex-fixed flex">
                        {Array.isArray(e.childs) && e.childs.length > 0 && <span className="size-20 flex-center">
                            <Icon size={16} icon={ChevronDownSvg}></Icon>
                        </span>}
                    </span>
                </div>
            }
            return <div className="pos border padding-5 round bg-white"
                style={style}>{childs.map((e, i) => {
                    return <div className="relative"
                        key={e.id}>
                        <BoxTip disableMousedownClose overlay={
                            <div className="flex-center">
                                <Tip text={'上移'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, childs, 'down')} ><Icon size={16} icon={ArrowDownSvg}></Icon></a></Tip>
                                <Tip text={'下移'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, childs, 'up')}><Icon size={16} icon={ArrowUpSvg}></Icon></a></Tip>
                                <Tip text={'添加'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, childs, 'add')}><Icon size={16} icon={PlusSvg}></Icon></a></Tip>
                                <Tip text={'添加子菜单'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, childs, 'add-sub')}><Icon size={16} icon={PlusAreaSvg}></Icon></a></Tip>
                                <Tip text={'删除'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, childs, 'remove')}><Icon size={16} icon={TrashSvg}></Icon></a></Tip>
                            </div>
                        }>{renderItem(e)}
                        </BoxTip>
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
                if (self.refPageText) self.refPageText.updateValue(g.text);
                if (!item.text || item.text == lst('菜单项')) item.text = g.text;
                self.checkChange();
            }
        }
        async function changeIcon(e: React.MouseEvent, item: WorkspaceNavMenuItem) {
            var r = await useIconPicker({
                roundArea: Rect.fromEle(e.currentTarget as HTMLElement)
            });
            if (typeof r !== 'undefined') {
                item.icon = r;
                self.checkChange();
                self.forceUpdate()
            }
        }
        function renderEditForm(item: WorkspaceNavMenuItem, deep: number) {
            return <div className="card">
                <div className="h4"><S>自定义导航</S>{item.type == 'logo' ? "LOGO" : lst("菜单项")}</div>
                <div className="r-gap-h-10">
                    {item.type !== "logo" && <><div className="flex">
                        <label className="flex-fixed w-40 flex-end gap-r-5"><S>名称</S>:</label>
                        <div className="flex-auto flex">
                            <Tip text={'设置图标'}>
                                <span onMouseDown={e => {
                                    changeIcon(e, item)
                                }} className="size-30 cursor flex-fixed round item-hover flex-center gap-r-5"><Icon size={20} icon={item.icon || NoneSvg}></Icon></span>
                            </Tip>
                            <Input ref={e => self.refInput = e} className="flex-auto" value={item.text || lst('菜单项')}
                                onChange={e => { item.text = e; self.checkChange() }}></Input>
                        </div>
                    </div>
                        {deep > 0 && <div className="flex flex-top">
                            <label className="flex-fixed w-40 flex-end gap-r-5"><S>备注</S>:</label>
                            <div className="flex-auto flex">
                                <Textarea style={{ maxHeight: 60 }} placeholder={lst('填写菜单项描述信息')} ref={e => self.refTextArea = e} value={item.remark}
                                    onChange={e => {
                                        item.remark = e;
                                        self.checkChange()
                                    }}></Textarea>
                            </div>
                        </div>}
                    </>
                    }
                    {item.type == 'logo' &&
                        <><div className="flex">
                            <label className="flex-fixed w-40 flex-end gap-r-5"><S>名称</S>:</label>
                            <Input ref={e => self.refInput = e} className="flex-auto" value={item.text || lst('菜单项')}
                                onChange={e => { item.text = e; self.checkChange() }}></Input>
                        </div>
                            <div className="flex">
                                <label className="flex-fixed w-40 flex-end gap-r-5">LOGO:</label>
                                <FileInput className="flex-auto" mime="image" value={item.pic} onChange={e => { item.pic = e; self.checkChange() }}></FileInput>
                            </div>
                        </>
                    }
                    <div className="flex">
                        <label className="flex-fixed w-40 flex-end gap-r-5"><S>外链</S>:</label>
                        <div className="flex-auto">
                            <SelectBox border value={item.urlType} onChange={e => { item.urlType = e; self.checkChange() }} options={[
                                { text: lst('无连接'), value: 'none', icon: { name: 'bytedance-icon', code: 'unlink' } },
                                { text: lst('跳转页面'), value: 'page', icon: { name: 'bytedance-icon', code: 'align-text-center-one' } },
                                { text: lst('跳转网址'), value: 'url', icon: { name: 'bytedance-icon', code: 'link-one' } }
                            ]}></SelectBox>
                        </div>
                    </div>
                    {item.urlType == 'url' && <div className="flex">
                        <label className="flex-fixed w-40 flex-end gap-r-5"><S>网址</S>:</label>
                        <div className="flex-auto">
                            <Input placeholder={lst("输入网址")} value={item.url} onChange={e => { item.url = e; self.checkChange() }}></Input>
                        </div>
                    </div>}
                    {item.urlType == 'page' && <div className="flex">
                        <label className="flex-fixed w-40 flex-end gap-r-5"><S>页面</S>:</label>
                        <div className="flex-auto">
                            <Input ref={e => self.refPageText = e} onMousedown={e => openSelectPage(e, item)} value={item.pageText} readonly></Input>
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
                    pas.splice(at, 0,
                        {
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
                <span className="flex-auto"><S>自定义页面头部导航条</S></span>
                <Switch
                    checked={this.data.publishConfig.defineNavMenu}
                    onChange={e => {
                        this.change('publishConfig.defineNavMenu', e)
                    }}></Switch>
            </div>
            {this.data.publishConfig.defineNavMenu &&
                <div className="min-h-100">
                    <div className="flex f-14 gap-h-10">
                        <span className="remark f-12 gap-r-5"><S>开启搜索</S></span>
                        <Switch
                            checked={this.data.publishConfig.allowSearch}
                            onChange={e => {
                                this.change('publishConfig.allowSearch', e)
                            }}></Switch>
                    </div>
                    <div className="shadow gap-h-20 flex">
                        <div className="flex-auto flex r-gap-r-10">
                            {this.data.publishConfig.navMenus.map((e, i) => {
                                return <div className="relative"
                                    key={e.id}>
                                    <BoxTip disableMousedownClose overlay={
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
                                        this.editItemDeep = 0;
                                        if (self.refInput) self.refInput.updateValue(e.text || lst('菜单项'))
                                        if (self.refTextArea) self.refTextArea.updateValue(e.remark || '');
                                        self.forceUpdate();
                                    }} style={{ height: h }} className={"flex round padding-w-10  " + (this.editItem == e ? "dashed" : 'border-t')}>
                                            {e.type == 'logo' && e.pic && <img className="obj-center gap-r-10" style={{ height: 40 }} src={e.pic?.url} />}
                                            {e.icon && <span className="flex-fixed size-20 flex-center"><Icon size={18} icon={e.icon}></Icon></span>}
                                            <span className={"flex-auto" + (e.text ? " f-16 " : " remark")}>{e.text || lst('菜单项')}</span>
                                            <span className="flex-fixed flex">
                                                {Array.isArray(e.childs) && e.childs.length > 0 && <Icon size={16} icon={ChevronDownSvg}></Icon>}
                                            </span>
                                        </div></BoxTip>
                                    {Array.isArray(e.childs) && e.childs.length > 0 && e.spread == true && renderNavs(e.childs, 0 + 1)}
                                </div>
                            })}
                        </div>
                        <div className="flex-fixed gap-r-10 flex">
                            {this.data.publishConfig.allowSearch && <div className="w-120 gap-r-10"><Input placeholder={lst('搜索...')} prefix={<span className="flex-center remark size-20"><Icon size={16} icon={SearchSvg}></Icon></span>} size="small"></Input></div>}
                            <Avatar size={36} userid={surface.user.id}></Avatar>
                        </div>
                    </div>
                    <div className="flex-end">
                        {this.editItem && <div className="flex-fixed w-250 gap-l-10">
                            {renderEditForm(this.editItem, this.editItemDeep)}
                        </div>}
                    </div>
                </div>
            }
        </div>
    }

    renderContent() {
        return <div>
            <Divider></Divider>
            <div className="flex f-14">
                <span className="flex-auto"><S>关闭侧边栏</S></span>
                <Switch checked={this.data.publishConfig.defineContent && this.data.publishConfig.contentTheme == 'none'} onChange={e => {
                    this.change('publishConfig.defineContent', e)
                    this.change('publishConfig.contentTheme', 'none')
                }}></Switch>
            </div>
        </div>
    }
    render() {
        var domain = surface.workspace.siteDomain || surface.workspace.sn;
        return <div>
            <SaveTip ref={e => this.tip = e} save={e => this.save()} reset={e => this.reset()}></SaveTip><div className="h2">发布应用</div>
            <Divider></Divider>
            <div className="flex gap-t-20">
                <span className="flex-auto"><S>将空间发布成应用</S></span>
                <Switch checked={this.data.publishConfig.abled} onChange={async e => {
                    if (await surface.user.isFillPay(lst('需要充值才能发布应用')))
                        this.change('publishConfig.abled', e)
                }}></Switch>
            </div>
            <div className="flex">
                <span className="f-12 remark ">
                    <Sp text={'公开至互联网后发布才有效果'} data={{ url: `https://${domain}.` + UrlRoute.getHost() }}>发布后通过<a className={'underline link-remark'} href={`https://${domain}.` + UrlRoute.getHost()} target="_blank">{`https://${domain}.` + UrlRoute.getHost()}</a>访问</Sp>
                </span>
            </div>
            {this.data.publishConfig.abled && <div className="r-gap-h-10">
                {this.renderContent()}
                {this.renderDefineTop()}
            </div>}
        </div>
    }
}