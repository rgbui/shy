import React from 'react';
import { EventsComponent } from 'rich/component/lib/events.component';
import { UserSettingsView } from './content/settings';
import "./style.less";
import { SyHistory } from '../../../history';
import { observer } from 'mobx-react';
import { makeObservable, observable } from 'mobx';
import { Singleton } from 'rich/component/lib/Singleton';
import { Divider } from 'rich/component/view/grid';
import { Remark } from 'rich/component/view/text';
import { config } from "../../../common/config";
import { UserSettingProfile } from './content/profile';
import { ShyAppUpdate } from './content/update';
import { ShyAppLang } from './content/lang';

@observer
class UserSettings extends EventsComponent {
    constructor(props) {
        super(props);
        makeObservable(this, {
            visible: observable,
            mode: observable
        })
    }
    visible: boolean = false;
    mode: string = 'user-settings';
    open() {
        this.visible = true;
    }
    close() {
        this.visible = false;
    }
    singout() {
        SyHistory.push('/sign/out');
        this.close()
    }
    render() {
        if (this.visible == false) return <div style={{ display: 'none' }}></div>
        return <div className='shy-settings'>
            <div className='shy-settings-slide'>
                <div>
                    <h4>用户设置</h4>
                    <a onMouseDown={e => this.mode = 'user-settings'} className={this.mode == 'user-settings' ? "hover" : ""} >我的帐号</a>
                    <a onMouseDown={e => this.mode = 'user-profile'} className={this.mode == 'user-profile' ? "hover" : ""} >用户个人资料</a>
                    <a onMouseDown={e => this.mode = 'user-safe'} className={this.mode == 'user-safe' ? "hover" : ""} >隐私与安全</a>
                    <Divider style={{ margin: '0px 15px' }}></Divider>
                    <h4>帐单设置</h4>
                    <a>充值</a>
                    <a>帐单</a>
                    <Divider style={{ margin: '0px 15px' }}></Divider>
                    <h4>APP设置</h4>
                    <a>外观</a>
                    <a onMouseDown={e => this.mode = 'lang'} className={this.mode == 'lang' ? "hover" : ""}>语言</a>
                    <Divider style={{ margin: '0px 15px' }}></Divider>
                    <a onMouseDown={e => this.mode = 'update'} className={this.mode == 'update' ? "hover" : ""}>更新日志</a>
                    <Remark style={{ marginLeft: 15 }}>v{config.version}</Remark>
                    <Divider style={{ margin: '0px 15px' }}></Divider>
                    <a className='warn' onClick={e => this.singout()}> 退出登录</a>
                </div>
            </div>
            <div className='shy-settings-content'>
                <div className='shy-settings-content-wrapper'>
                    <div className='shy-settings-operators'>
                        <a onMouseDown={e => this.close()}>
                            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path
                                fill="hsl(218, calc(var(--saturation-factor, 1) * 4.6%), 46.9%)"
                                d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
                        </a>
                    </div>
                    <div className='shy-settings-content-wrapper-scroll'>
                        {this.mode == 'user-settings' && <UserSettingsView setMode={() => { this.mode = 'user-profile' }}></UserSettingsView>}
                        {this.mode == 'user-profile' && <UserSettingProfile></UserSettingProfile>}
                        {this.mode == 'update' && <ShyAppUpdate></ShyAppUpdate>}
                        {this.mode == 'lang' && <ShyAppLang></ShyAppLang>}
                    </div>
                </div>
            </div>
        </div>
    }
}

export async function useOpenUserSettings() {
    var us = await Singleton(UserSettings);
    us.open();
}