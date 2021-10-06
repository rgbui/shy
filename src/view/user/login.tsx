import React from "react";
import { AppLang } from "../../../i18n/enum";
import { appLangProvider } from "../../../i18n/provider";
import { SA } from "../../../i18n/view";
import { SyHistory } from "../history";
import { CacheKey, sCache } from "../../../net/cache";
import { surface } from "../surface";
import { userService } from "../../../services/user";
import { Button } from "rich/component/view/button";
import { Input } from "rich/component/view/input";

export class Login extends React.Component {
    /**
     * 登录方式
     */
    private mode: 'phone' | 'phoneName' | 'phonePwd' | 'weixin' = 'phone';
    private phone: string = '';
    private verifyPhoneCode: string = '';
    private name: string;
    private codeExpireCount: number = -1;
    private codeExpireCountTime: number;
    private signFailMsg: string = '';
    private updateNameFileMsg: string = '';
    async generatePhoneCode(event: globalThis.MouseEvent) {
        var result = await userService.generatePhoneCode(this.phone);
        if (result.ok) {
            if (result.data?.code) this.verifyPhoneCode = result.data.code;
            this.codeExpireCount = 120;
            if (this.codeExpireCountTime) clearInterval(this.codeExpireCountTime)
            this.codeExpireCountTime = setInterval(() => {
                this.codeExpireCount -= 1;
                if (this.codeExpireCount < 0) {
                    this.codeExpireCount = -1;
                    clearInterval(this.codeExpireCountTime)
                }
                this.forceUpdate();
            }, 1000);
            this.forceUpdate();
        }
        else alert(result.warn);
    }
    clear() {
        if (this.codeExpireCountTime) clearInterval(this.codeExpireCountTime);
    }
    async phoneSign(event?: globalThis.MouseEvent) {
        var button = event ? (event.target as HTMLButtonElement) : (this.el.querySelector('.shy-login-box-button button') as HTMLButtonElement);
        button.disabled = true;
        try {
            var result = await userService.phoneSign(this.phone, this.verifyPhoneCode);
            if (result.ok == false) this.signFailMsg = result.warn;
            else {
                await sCache.set(CacheKey.token, result.data.token, 180, 'd');
                Object.assign(surface.user, result.data.user);
                this.signFailMsg = '';
                if (result.data.justRegistered == true) this.mode = 'phoneName';
                else {
                    this.clear();
                    return SyHistory.push('/');
                }
            }
        }
        catch (ex) {

        }
        button.disabled = false;
        this.forceUpdate();
    }
    async inputName(event: globalThis.MouseEvent) {
        var button = event ? (event.target as HTMLButtonElement) : (this.el.querySelector('.shy-login-box-button button') as HTMLButtonElement);
        button.disabled = true;
        try {
            var rr = await userService.updateName(this.name);
            if (rr.ok) {
                surface.updateUser({ name: this.name });
                {
                    this.clear();
                    return SyHistory.push('/');
                }
            }
            else this.updateNameFileMsg = rr.warn;
        }
        catch (ex) {

        }
        button.disabled = false;
        this.forceUpdate();
    }
    private el: HTMLElement;
    render() {
        return <div className='shy-login' ref={e => this.el = e} >
            <div className='shy-login-head'><span>登录</span></div>
            {this.mode == 'phone' && <div className='shy-login-box'>
                <div className='shy-login-box-account'>
                    <Input value={this.phone} onChange={e => this.phone = e} placeholder={appLangProvider.getText(AppLang.Phone)}></Input>
                </div>
                <div className='shy-login-box-code'>
                    <Input value={this.verifyPhoneCode} placeholder={appLangProvider.getText(AppLang.PhoneVerifyCode)} onChange={e => this.verifyPhoneCode = e} onEnter={e => this.phoneSign()} />
                    {this.codeExpireCount == -1 && <Button size='medium' onClick={e => this.generatePhoneCode(e.nativeEvent)}>获取短信验证码</Button>}
                    {this.codeExpireCount > -1 && <Button size='medium' >{this.codeExpireCount}s</Button>}
                </div>
                <div className='shy-login-box-button'>
                    <Button size='medium' block onClick={e => this.phoneSign(e.nativeEvent)}><SA id={AppLang.Login}></SA></Button >
                </div>
                {this.signFailMsg && <div className='shy-login-box-fail'>{this.signFailMsg}</div>}
            </div>}
            {this.mode == 'phoneName' && <div className='shy-login-box'>
                <div className='shy-login-box-code'>
                    <Input placeholder={appLangProvider.getText(AppLang.PleashName)} value={this.name} onChange={e => this.name = e} onEnter={e => this.phoneSign()} />
                </div>
                <div className='shy-login-box-button'>
                    <Button size='medium' block onClick={e => this.inputName(e.nativeEvent)}>欢迎使用诗云</Button>
                </div>
                {this.updateNameFileMsg && <div className='shy-login-box-fail'>{this.updateNameFileMsg}</div>}
            </div>
            }
        </div>
    }
}