import React from "react";
import { Workspace } from "../..";
import lodash from "lodash";
import {
    ChevronDownSvg,
    ArrowDownSvg,
    ArrowUpSvg,
    PlusSvg,
    PlusAreaSvg,
    TrashSvg,
    NoneSvg,
    ArrowLeftSvg,
    ArrowRightSvg,
    SearchSvg
} from "rich/component/svgs";

import { Avatar } from "rich/component/view/avator/face";
import { Icon } from "rich/component/view/icon";
import { Input } from "rich/component/view/input";
import { FileInput } from "rich/component/view/input/file";
import { Textarea } from "rich/component/view/input/textarea";
import { SelectBox } from "rich/component/view/select/box";
import { BoxTip } from "rich/component/view/tooltip/box";
import { Tip } from "rich/component/view/tooltip/tip";
import { useIconPicker } from "rich/extensions/icon";
import { useSelectWorkspacePage } from "rich/extensions/link/select";
import { lst } from "rich/i18n/store";
import { S } from "rich/i18n/view";
import { Rect } from "rich/src/common/vector/point";
import { WorkspaceNavMenuItem, getPageText } from "rich/src/page/declare";
import { config } from "../../../../../common/config";
import { ShyUtil } from "../../../../util";
import { surface } from "../../../app/store";
import { Switch } from "rich/component/view/switch";
import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import { Singleton } from "rich/component/lib/Singleton";
import { EventsComponent } from "rich/component/lib/events.component";
import { SelectButtons } from "rich/component/view/button/select";
import { channel } from "rich/net/channel";

@observer
export class PublishSite extends EventsComponent {
    constructor(props) {
        super(props);
        this.publishConfig = props.publishConfig;
        makeObservable(this, {
            editItem: observable,
            publishConfig: observable,
            mode: observable,
            visible: observable
        })
    }
    visible: boolean = false;
    mode: 'site' | 'app' = 'site';
    publishConfig: Workspace['publishConfig'] = null;
    editItem: WorkspaceNavMenuItem = null;
    editItemDeep: number = 0;
    refInput: Input;
    refTextArea: Textarea;
    refPageText: Input;
    renderNavTop() {
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
                item.pageText = getPageText(g);
                item.icon = g.icon;
                if (self.refPageText) self.refPageText.updateValue(item.pageText);
                if (!item.text || item.text == lst('菜单项')) item.text = g.text;
            }
        }
        async function changeIcon(e: React.MouseEvent, item: WorkspaceNavMenuItem) {
            var r = await useIconPicker({
                roundArea: Rect.fromEle(e.currentTarget as HTMLElement)
            });
            if (typeof r !== 'undefined') {
                item.icon = r;
                self.forceUpdate()
            }
        }
        function renderEditForm(item: WorkspaceNavMenuItem, deep: number) {
            return <div className="card">
                <div className="h4"><S>自定义菜单</S>{item.type == 'logo' ? "LOGO" : lst("菜单项")}</div>
                <div className="r-gap-h-10">
                    {item.type !== "logo" && <><div className="flex">
                        <label className="flex-fixed w-40 flex-end gap-r-5"><S>名称</S>:</label>
                        <div className="flex-auto flex">
                            <Tip text={'设置图标'}>
                                <span onMouseDown={e => {
                                    changeIcon(e, item)
                                }} className="size-30 cursor flex-fixed round item-hover flex-center gap-r-5"><Icon size={16} icon={item.icon || NoneSvg}></Icon></span>
                            </Tip>
                            <Input ref={e => self.refInput = e} className="flex-auto" placeholder={lst('菜单项')} value={item.text }
                                onChange={e => { item.text = e; }}></Input>
                        </div>
                    </div>
                        {deep > 0 && <div className="flex flex-top">
                            <label className="flex-fixed w-40 flex-end gap-r-5"><S>备注</S>:</label>
                            <div className="flex-auto flex">
                                <Textarea style={{ maxHeight: 60 }} placeholder={lst('菜单项描述信息...')} ref={e => self.refTextArea = e} value={item.remark}
                                    onChange={e => {
                                        item.remark = e;
                                    }}></Textarea>
                            </div>
                        </div>}
                    </>
                    }
                    {item.type == 'logo' &&
                        <><div className="flex">
                            <label className="flex-fixed w-40 flex-end gap-r-5"><S>名称</S>:</label>
                            <Input ref={e => self.refInput = e} className="flex-auto" placeholder={lst('菜单项')} value={item.text }
                                onChange={e => { item.text = e; }}></Input>
                        </div>
                            <div className="flex">
                                <label className="flex-fixed w-40 flex-end gap-r-5">LOGO:</label>
                                <FileInput className="flex-auto" mime="image" value={item.pic} onChange={e => { item.pic = e; }}></FileInput>
                            </div>
                        </>
                    }
                    <div className="flex">
                        <label className="flex-fixed w-40 flex-end gap-r-5"><S>外链</S>:</label>
                        <div className="flex-auto">
                            <SelectBox dropAlign="full" border value={item.urlType} onChange={e => { item.urlType = e; }} options={[
                                { text: lst('无连接'), value: 'none', icon: { name: 'bytedance-icon', code: 'text' } },
                                { text: lst('跳转页面'), value: 'page', icon: { name: 'bytedance-icon', code: 'corner-up-right' } },
                                { text: lst('跳转网址'), value: 'url', icon: { name: 'bytedance-icon', code: 'link-one' } }
                            ]}></SelectBox>
                        </div>
                    </div>
                    {item.urlType == 'url' && <div className="flex">
                        <label className="flex-fixed w-40 flex-end gap-r-5"><S>网址</S>:</label>
                        <div className="flex-auto">
                            <Input placeholder={lst("输入网址")} value={item.url} onChange={e => { item.url = e; }}></Input>
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
                    break;
                case 'up':
                    var at = pas.findIndex(g => g === item);
                    ShyUtil.arrayMove(pas, item, at - 1);
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
                        });
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
                    break;
                case 'remove':
                    if (self.editItem?.id == item?.id) self.editItem = null;
                    lodash.remove(pas, g => g === item)
                    break;
            }
        }
        return <div className="relative">
            <div className="flex shadow-s border-bottom-light h-50 bg-white  padding-w-20">
                <div className="flex-auto flex r-gap-r-10">
                    {this.publishConfig.navMenus.map((e, i) => {
                        return <div className="relative"
                            key={e.id}>
                            <BoxTip
                                disableMousedownClose
                                overlay={
                                    <div className="flex-center">
                                        {e.type != 'logo' && <>
                                            <Tip text={'前移'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, this.publishConfig.navMenus, 'up')} ><Icon size={16} icon={ArrowLeftSvg}></Icon></a></Tip>
                                            <Tip text={'后移'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, this.publishConfig.navMenus, 'down')}><Icon size={16} icon={ArrowRightSvg}></Icon></a></Tip>
                                            <Tip text={'添加'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, this.publishConfig.navMenus, 'add')}><Icon size={16} icon={PlusSvg}></Icon></a></Tip>
                                            <Tip text={'添加子菜单'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, this.publishConfig.navMenus, 'add-sub')}><Icon size={16} icon={PlusAreaSvg}></Icon></a></Tip>
                                            <Tip text={'删除'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, this.publishConfig.navMenus, 'remove')}><Icon size={16} icon={TrashSvg}></Icon></a></Tip>
                                        </>}
                                        {e.type == 'logo' && <>
                                            <Tip text={'添加菜单'}><a className="flex-center size-24 round item-hover gap-5 cursor text" onMouseDown={c => operatorItem(e, this.publishConfig.navMenus, 'add')}><Icon size={16} icon={PlusAreaSvg}></Icon></a></Tip>
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
                    {this.publishConfig.allowSearch && <div className="w-120 gap-r-10"><Input placeholder={lst('搜索...')} prefix={<span className="flex-center remark size-20"><Icon size={16} icon={SearchSvg}></Icon></span>} size="small"></Input></div>}
                    <Avatar size={36} userid={surface.user.id}></Avatar>
                </div>
            </div>
            <div style={{ top: 60, right: 10 }} className="flex-end pos">
                {this.editItem && <div className="flex-fixed w-350 gap-l-10">
                    {renderEditForm(this.editItem, this.editItemDeep)}
                </div>}
            </div>
        </div>
    }
    change(key: string, value) {
        lodash.set(this.publishConfig, key, value);
    }
    renderSiteContent() {
        var na: JSX.Element = null;
        if (this.publishConfig.defineNavMenu) {
            na = this.renderNavTop()
        }
        else {
            na = <div className=" flex h-50 border-bottom-light shadow-s bg-white padding-w-20">
                <div className="flex flex-auto">
                    <div className="sk-static-bg gap-r-10 circle" style={{ width: 20, height: 20 }}></div>
                    <div className="sk-static-bg round" style={{ width: 180, height: 20 }}></div>
                </div>
                <div className="flex-fixed flex">
                    {this.publishConfig.allowSearch && <div className="w-120 gap-r-10"><Input placeholder={lst('搜索...')} prefix={<span className="flex-center remark size-20"><Icon size={16} icon={SearchSvg}></Icon></span>} size="small"></Input></div>}
                    <Avatar size={36} userid={surface.user.id}></Avatar>
                </div>
            </div>
        }
        return <div className="sketelon">
            {na}
            {this.publishConfig.contentTheme != 'web' && <div className="flex gap-t-5  flex-full">
                <div className="flex-fixed w-250 r-round border-right-light padding-t-10" style={{ backgroundColor: '#fbfbfa' }}>
                    <div className="sk-static-bg gap-h-10" style={{ height: 20 }}></div>
                    <div className="sk-static-bg gap-h-10" style={{ height: 20 }}></div>
                    <div className="sk-static-bg gap-h-10" style={{ height: 20 }}></div>
                    <div className="sk-static-bg gap-h-10" style={{ height: 20 }}></div>
                    <div className="sk-static-bg gap-h-10" style={{ height: 20 }}></div>
                    <div className="sk-static-bg gap-h-10" style={{ height: 20 }}></div>
                </div>
                <div className="flex-auto  padding-w-30 bg-white">
                    <div className="sk-static-bg round gap-h-20" style={{ height: 400 }}></div>
                </div>
            </div>}
            {this.publishConfig.contentTheme == 'web' && <div >
                <div className="sk-static-bg  round gap-w-50  gap-h-20" style={{ height: 400 }}></div>
            </div>}
        </div>
    }
    renderSite() {
        return <div>
            <div className="flex gap-h-10 h-30 r-flex r-gap-r-10">
                <span><S>自定义页面顶部菜单</S>
                    <Switch className={'gap-l-3'}
                        checked={this.publishConfig.defineNavMenu}
                        onChange={e => {
                            this.change('defineNavMenu', e)
                        }}></Switch>
                </span>
                <span>
                    <S>开启搜索</S>
                    <Switch className={'gap-l-3'}
                        checked={this.publishConfig.allowSearch}
                        onChange={e => {
                            this.change('allowSearch', e)
                        }}></Switch>
                </span>
                <span>
                    <span className={'gap-r-3'}><S>模式</S></span>
                    <SelectBox
                        border
                        small
                        onChange={e => {
                            this.change('contentTheme', e)
                        }}
                        value={this.publishConfig.contentTheme || 'wiki'}
                        options={[
                            { text: lst('web'), value: 'web' },
                            { text: lst('wiki'), value: 'wiki' }
                        ]}
                    ></SelectBox>
                </span>
            </div>
            <div>
                <div className='flex r-gap-r-10' style={{ height: 24, background: '#444', borderRadius: '16px 16px 0px 0px' }}>
                    <div className='size-10 gap-l-10 circle bg-white'></div>
                    <div className='size-10 circle bg-white'></div>
                    <div className='size-10 circle bg-white'></div>
                </div><div className="min-h-400"
                    style={{
                        borderStyle: 'solid',
                        borderColor: '#444',
                        borderWidth: '0px 10px 10px 10px',
                        borderRadius: '0px 0px 16px 16px'
                    }}>
                    {this.renderSiteContent()}
                </div>
            </div>
        </div>
    }
    renderApp() {
        return <div className="gap-t-20">
            <div className="flex-center gap-h-20"><S>敬请期待...</S></div>
            <div className="flex-center">
                <div className="bg-white round-16 w-300 h-500" style={{ border: '10px solid #444' }}>

                </div>
            </div>
        </div>
    }
    render() {
        if (!this.visible) return <></>
        if (this.publishConfig)
            return <div style={{ zIndex: '10001', overflowY: 'scroll' }} className='shy-ws-settings fixed-full'>
                <div className="screen-content-1000">
                    <div className="h-30 gap-t-30"
                        onMouseDown={e => {
                            this.onClose();
                        }}>
                        <span className="flex-fixed item-hover l-20 h-20 padding-r-5  round flex flex-inline"><Icon icon={{ name: 'byte', code: 'left' }}></Icon><S>后退</S>
                        </span>
                    </div>
                    <div className="flex-center">
                        <SelectButtons
                            theme="ghost"
                            onChange={e => this.mode = e}
                            value={this.mode}
                            block
                            options={[
                                { text: lst('web站点'), value: 'site' },
                                { text: lst('app应用'), value: 'app' }
                            ]}></SelectButtons>
                    </div>
                    <div>
                        {this.mode == 'site' && this.renderSite()}
                        {this.mode == 'app' && this.renderApp()}
                    </div>
                </div>
            </div>
        else return <div></div>
    }
    onOpen(publishConfig: Workspace['publishConfig']) {
        runInAction(() => {
            this.publishConfig = publishConfig;
            this.visible = true;
        })
    }
    async onClose() {
        this.visible = false;
        await channel.patch('/ws/patch', {
            data: {
                publishConfig: lodash.cloneDeep(this.publishConfig)
            }
        });
        this.emit('close')
    }
}


export async function usePublishSite(publishConfig: Workspace['publishConfig']) {
    var popover = await Singleton(PublishSite);
    popover.onOpen(publishConfig);
}