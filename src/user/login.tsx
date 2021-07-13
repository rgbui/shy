import React, { MouseEvent } from "react";
import { SyHistory } from "../history";

import { CacheKey, sCache } from "../service/cache";
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
    private codeExpireCounter: number = -1;
    private codeExpireCounterTime: number;
    private signFailMsg: string = '';
    private updateNameFileMsg: string = '';
    async generatePhoneCode(event: globalThis.MouseEvent) {
        var result = await userService.generatePhoneCode(this.phone);
        if (result.ok) {
            if (result.data?.code) this.verifyPhoneCode = result.data.code;
            this.codeExpireCounter = 120;
            if (this.codeExpireCounterTime) clearInterval(this.codeExpireCounterTime)
            this.codeExpireCounterTime = setInterval(() => {
                this.codeExpireCounter -= 1;
                if (this.codeExpireCounter < 0) {
                    this.codeExpireCounter = -1;
                    clearInterval(this.codeExpireCounterTime)
                }
                this.forceUpdate();
            }, 1000);
            this.forceUpdate();
        }
        else alert(result.warn);
    }
    async phoneSign(event?: globalThis.MouseEvent) {
        var button = event ? (event.target as HTMLButtonElement) : (this.el.querySelector('.sy-login-box-button button') as HTMLButtonElement);
        button.disabled = true;
        try {
            var result = await userService.phoneSign(this.phone, this.verifyPhoneCode);
            if (result.ok == false) this.signFailMsg = result.warn;
            else {
                sCache.set(CacheKey.token, result.data.token, 180, 'd');
                Object.assign(surface.user, result.data.user);
                this.signFailMsg = '';
                if (result.data.justRegistered == true)
                    this.mode = 'phoneName';
                else return SyHistory.push('/')
            }
        }
        catch (ex) {

        }
        button.disabled = false;
        this.forceUpdate();
    }
    async inputName(event: globalThis.MouseEvent) {
        var button = event ? (event.target as HTMLButtonElement) : (this.el.querySelector('.sy-login-box-button button') as HTMLButtonElement);
        button.disabled = true;
        try {
            var rr = await userService.updateName(this.name);
            if (rr.ok) return SyHistory.push('/');
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
    async componentDidMount() {

    }
    private el: HTMLElement;
    render() {
        return <div className='sy-cover' ref={e => this.el = e} >
            <div className='sy-login'>
                <div className='sy-login-head'><span>诗云</span></div>
                {this.mode == 'phone' && <div className='sy-login-box'>
                    <div className='sy-login-box-account'>
                        <input className='input' type='text' onInput={
                            e => this.phone = (e.nativeEvent.target as HTMLInputElement).value
                        } defaultValue={this.phone} placeholder='手机号' />
                    </div>
                    <div className='sy-login-box-code'>
                        <input className='input' type='text' onKeyDown={e => this.keydown(e.nativeEvent)} defaultValue={this.verifyPhoneCode} onInput={
                            e => this.verifyPhoneCode = (e.nativeEvent.target as HTMLInputElement).value
                        } placeholder='短信验证码' />
                        {this.codeExpireCounter == -1 && <button className='button' onMouseDown={e => this.generatePhoneCode(e.nativeEvent)}>获取短信验证码</button>}
                        {this.codeExpireCounter > -1 && <button className='button'>{this.codeExpireCounter}s</button>}
                    </div>
                    <div className='sy-login-box-button'>
                        <button className='button' onMouseDown={e => this.phoneSign(e.nativeEvent)}>登录</button>
                    </div>
                    {this.signFailMsg && <div className='sy-login-box-fail'>{this.signFailMsg}</div>}
                </div>}
                {
                    this.mode == 'phoneName' && <div className='sy-login-box'>
                        <div className='sy-login-box-code'>
                            <input className='input' type='text' onKeyDown={e => this.keydown(e.nativeEvent)} defaultValue={this.name} onInput={
                                e => this.name = (e.nativeEvent.target as HTMLInputElement).value
                            } placeholder='请输入称呼' />
                        </div>
                        <div className='sy-login-box-button'>
                            <button className='button' onMouseDown={e => this.inputName(e.nativeEvent)}>欢迎使用诗云</button>
                        </div>
                        {this.updateNameFileMsg && <div className='sy-login-box-fail'>{this.updateNameFileMsg}</div>}
                    </div>
                }
            </div>
        </div>
    }
}