import React from 'react';
import { EventsComponent } from 'rich/component/lib/events.component';
import { UserSettingsView } from './content/settings';
import { observer } from 'mobx-react';
import { makeObservable, observable } from 'mobx';
import { Singleton } from 'rich/component/lib/Singleton';
import { Divider } from 'rich/component/view/grid';
import { Remark } from 'rich/component/view/text';
import { UserSettingProfile } from './content/profile';
import { ShyAppUpdate } from './app/upgrade';
import { ShyAppLang } from './app/lang';
import { ShyWallet } from './order/wallet';
import { ShyPayList } from './order/list';
import { ShyFeature } from './order/feature';
import { ShyOpen } from './content/open';
import { ShySafe } from './content/safe';
import { ShyAppear } from './app/appear';
import { SaveTip } from '../../../component/tip/save.tip';
import { ShyUserPks } from './content/keys';
import { InviteList } from './task/invite';
import { S } from 'rich/i18n/view';
import { surface } from '../../store';
import { LocalDataSource } from './app/local';
import { PrivateClound } from './app/private';
import { config } from '../../../../common/config';
import "./style.less";

@observer
export default class UserSettings extends EventsComponent {
    constructor(props) {
        super(props);
        makeObservable(this, {
            visible: observable,
            mode: observable
        })
    }
    visible: boolean = false;
    mode: string = 'user-settings';
    open(mode) {
        if (mode) this.mode = mode;
        else this.mode = 'user-settings';
        this.visible = true;
    }
    setMode(mode) {
        if (SaveTip.isOf(this.el)) return;
        this.mode = mode;
    }
    close() {
        if (SaveTip.isOf(this.el)) return;
        this.visible = false;
        this.emit('close');
    }
    singout() {
        var r = surface.user.logout()
        if (r == 1) this.close()
    }
    el: HTMLElement;
    render() {
        if (this.visible == false) return <div style={{ display: 'none' }}></div>
        return <div ref={e => this.el = e} className='shy-user-settings fixed-full'>
            <div className='screen-content-1000 flex-full h100 relative'>
                <div style={{ marginTop: config.isDesk ? 30 : undefined }} className='flex-fixed w-200 shy-user-settings-slide h100 box-border overflow-y'>
                    <div className={config.isDesk ? "padding-t-30 padding-b-60" : 'padding-h-60'}>
                        <h4><S>用户设置</S></h4>
                        <a onMouseDown={e => this.setMode('user-settings')} className={this.mode == 'user-settings' ? "hover" : ""} ><S>我的帐号</S></a>
                        <a onMouseDown={e => this.setMode('user-profile')} className={this.mode == 'user-profile' ? "hover" : ""} ><S>个人资料</S></a>
                        <a onMouseDown={e => this.setMode('open')} className={this.mode == 'open' ? "hover" : ""} ><S>第三方帐户</S></a>
                        <Divider style={{ margin: '0px 15px' }}></Divider>
                        <h4><S>帐单设置</S></h4>
                        <a onMouseDown={e => this.setMode('wallet')} className={this.mode == 'wallet' ? "hover" : ""}><S>钱包</S></a>
                        <a onMouseDown={e => this.setMode('orderList')} className={this.mode == 'orderList' ? "hover" : ""}><S>帐单</S></a>
                        <a onMouseDown={e => this.setMode('price')} className={this.mode == 'price' ? "hover" : ""}><S>定价</S></a>
                        <Divider style={{ margin: '0px 15px' }}></Divider>
                        <h4><S>活动中心</S></h4>
                        <a onMouseDown={e => this.setMode('invite')} className={this.mode == 'invite' ? "hover" : ""}><S>邀请好友</S></a>

                        <Divider style={{ margin: '0px 15px' }}></Divider>
                        <h4><S>安全设置</S></h4>
                        <a onMouseDown={e => this.setMode('user-pks')} className={this.mode == 'user-pks' ? "hover" : ""} ><S>个人私钥</S></a>
                        <a onMouseDown={e => this.setMode('user-safe')} className={this.mode == 'user-safe' ? "hover" : ""} ><S>隐私与安全</S></a>
                        <Divider style={{ margin: '0px 15px' }}></Divider>
                        <h4><S>本地及私有云</S></h4>
                        <a onMouseDown={e => this.setMode('local-store')} className={this.mode == 'local-store' ? "hover" : ""} ><S>本地存储</S></a>
                        <a onMouseDown={e => this.setMode('PrivateClound')} className={this.mode == 'PrivateClound' ? "hover" : ""} ><S>私有云</S></a>

                        <Divider style={{ margin: '0px 15px' }}></Divider>
                        <h4><S>APP设置</S></h4>
                        {/*<a onMouseDown={e => this.setMode('appear')} className={this.mode == 'appear' ? "hover" : ""}>外观</a> */}
                        <a onMouseDown={e => this.setMode('lang')} className={this.mode == 'lang' ? "hover" : ""}><S>语言</S></a>
                        {/*<Divider style={{ margin: '0px 15px' }}></Divider> */}
                        <a onMouseDown={e => this.setMode('update')} className={this.mode == 'update' ? "hover" : ""}><S>更新日志</S></a>
                        <Remark style={{ marginLeft: 15 }}>v{window.shyConfig.version}</Remark>
                        <Divider style={{ margin: '0px 15px' }}></Divider>
                        <a className='warn' onClick={e => this.singout()}><S>退出登录</S></a>
                    </div>
                </div>
                <div className='flex-fixed shy-user-settings-content  h100 box-border overflow-y'>
                    <div className='padding-h-60'>
                        {this.mode == 'user-settings' && <UserSettingsView setMode={() => { this.mode = 'user-profile' }}></UserSettingsView>}
                        {this.mode == 'user-profile' && <UserSettingProfile></UserSettingProfile>}
                        {this.mode == 'user-pks' && <ShyUserPks></ShyUserPks>}
                        {this.mode == 'update' && <ShyAppUpdate></ShyAppUpdate>}
                        {this.mode == 'lang' && <ShyAppLang></ShyAppLang>}
                        {this.mode == 'wallet' && <ShyWallet></ShyWallet>}
                        {this.mode == 'orderList' && <ShyPayList></ShyPayList>}
                        {this.mode == 'price' && <ShyFeature></ShyFeature>}
                        {this.mode == 'open' && <ShyOpen></ShyOpen>}
                        {this.mode == 'user-safe' && <ShySafe></ShySafe>}
                        {this.mode == 'appear' && <ShyAppear></ShyAppear>}
                        {this.mode == 'invite' && <InviteList></InviteList>}
                        {this.mode == 'local-store' && <LocalDataSource></LocalDataSource>}
                        {this.mode == 'PrivateClound' && <PrivateClound></PrivateClound>}
                    </div>
                </div>
                <div className='shy-user-settings-operators'>
                    <a onMouseDown={e => this.close()}>
                        <span>
                            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path
                                fill="hsl(218, calc(var(--saturation-factor, 1) * 4.6%), 46.9%)"
                                d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
                        </span>
                        <label><S>退出</S></label>
                    </a>
                </div>
            </div>
        </div >
    }
}

