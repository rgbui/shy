import React from "react";
import { history } from "../history";
import { UserService } from "../service/user";
export class Login extends React.Component {
    /**
     * 登录方式
     */
    private mode: 'phone' | 'phonePwd' | 'weixin' = 'phone';
    private phone: string = '';
    private verifyPhoneCode: string = '';
    private codeExpireCounter: number = -1;
    private codeExpireCounterTime;
    private signFailMsg: string = '';
    async GeneratePhoneCode(event: MouseEvent) {
        var result = await UserService.GeneratePhoneCode(this.phone);
        if (result.success) {
            this.codeExpireCounter = 120;
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
        else alert(result.error);
    }
    async phoneSign(event?: MouseEvent) {
        var button = event ? (event.target as HTMLButtonElement) : (this.el.querySelector('.sy-login-box-button button') as HTMLButtonElement);
        button.disabled = true;
        try {
            var result = await UserService.phoneSign(this.phone, this.verifyPhoneCode);
            if (result.success == false && result.error) this.signFailMsg = result.error;
            else {
                this.signFailMsg = '';
            }
        }
        catch (ex) {

        }
        finally {
            button.disabled = false;
            this.forceUpdate();
        }
    }
    async keydown(event: KeyboardEvent) {
        if (event.key == 'Enter') await this.phoneSign()
    }
    private el: HTMLElement;
    render() {

        return <div className='sy-cover' ref={e => this.el = e} style={{ visibility: history.location.pathname == '/login' ? "hidden" : "visible" }}><div className='sy-login'>
            <div className='sy-login-head'><span>诗云</span></div>
            {this.mode == 'phone' && <div className='sy-login-box'>
                <div className='sy-login-box-account'>
                    <input type='text' onInput={
                        e => this.phone = (e.nativeEvent.target as HTMLInputElement).value
                    } defaultValue={this.phone} placeholder='手机号' />
                </div>
                <div className='sy-login-box-code'>
                    <input type='text' onKeyDown={e => this.keydown(e.nativeEvent)} defaultValue={this.verifyPhoneCode} onInput={
                        e => this.verifyPhoneCode = (e.nativeEvent.target as HTMLInputElement).value
                    } placeholder='短信验证码' />
                    {this.codeExpireCounter == -1 && <button onMouseDown={e => this.GeneratePhoneCode(e.nativeEvent)}>获取短信验证码</button>}
                    {this.codeExpireCounter > -1 && <button>{this.codeExpireCounter}s</button>}
                </div>
                <div className='sy-login-box-button'>
                    <button onMouseDown={e => this.phoneSign(e.nativeEvent)}>登录</button>
                </div>
                {this.signFailMsg && <div className='sy-login-box-fail'>{this.signFailMsg}</div>}
            </div>}
        </div>
        </div>
    }
}