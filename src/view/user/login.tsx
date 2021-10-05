import React from "react";
import { AppLang } from "../../../i18n/enum";
import { appLangProvider } from "../../../i18n/provider";
import { SA } from "../../../i18n/view";
import { SyHistory } from "../history";
import { CacheKey, sCache } from "../../../service/cache";
import { surface } from "../surface";
import { userService } from "./service";

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
    async keydown(event: KeyboardEvent) {
        if (event.key == 'Enter') await this.phoneSign()
    }
    private el: HTMLElement;
    render() {
        return <div className='shy-mask' ref={e => this.el = e} >
            <div className='shy-login'>
                <div className='shy-login-head'><span>诗云</span></div>
                {this.mode == 'phone' && <div className='shy-login-box'>
                    <div className='shy-login-box-account'>
                        <input className='input' type='text' onInput={
                            e => this.phone = (e.nativeEvent.target as HTMLInputElement).value
                        } defaultValue={this.phone} placeholder={appLangProvider.getText(AppLang.Phone)} />
                    </div>
                    <div className='shy-login-box-code'>
                        <input className='input' type='text' onKeyDown={e => this.keydown(e.nativeEvent)} defaultValue={this.verifyPhoneCode} onInput={
                            e => this.verifyPhoneCode = (e.nativeEvent.target as HTMLInputElement).value
                        } placeholder={appLangProvider.getText(AppLang.PhoneVerifyCode)} />
                        {this.codeExpireCount == -1 && <button className='button' onMouseDown={e => this.generatePhoneCode(e.nativeEvent)}>获取短信验证码</button>}
                        {this.codeExpireCount > -1 && <button className='button'>{this.codeExpireCount}s</button>}
                    </div>
                    <div className='shy-login-box-button'>
                        <button className='button' onMouseDown={e => this.phoneSign(e.nativeEvent)}><SA id={AppLang.Login}></SA></button>
                    </div>
                    {this.signFailMsg && <div className='shy-login-box-fail'>{this.signFailMsg}</div>}
                </div>}
                {
                    this.mode == 'phoneName' && <div className='shy-login-box'>
                        <div className='shy-login-box-code'>
                            <input className='input' type='text' onKeyDown={e => this.keydown(e.nativeEvent)} defaultValue={this.name} onInput={
                                e => this.name = (e.nativeEvent.target as HTMLInputElement).value
                            } placeholder={appLangProvider.getText(AppLang.PleashName)} />
                        </div>
                        <div className='shy-login-box-button'>
                            <button className='button' onMouseDown={e => this.inputName(e.nativeEvent)}>欢迎使用诗云</button>
                        </div>
                        {this.updateNameFileMsg && <div className='shy-login-box-fail'>{this.updateNameFileMsg}</div>}
                    </div>
                }
            </div>
        </div>
    }
}