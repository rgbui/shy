
/**
 * 
 * 海外用户登录
 */

import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { isMobileOnly } from "react-device-detect";
import { Button } from "rich/component/view/button";
import { Input } from "rich/component/view/input";
import { lst } from "rich/i18n/store";
import { S, Sp } from "rich/i18n/view";
import { ShyUrl, UrlRoute } from "../../../../history";
import { masterSock } from "../../../../../net/sock";
import { CacheKey, sCache } from "../../../../../net/cache";
import { surface } from "../../../store";
import { EmailRegex } from "../../../../../services/common/base";

@observer
export class UsLogin extends React.Component<{ call?: () => void }> {
    constructor(props) {
        super(props);
        makeObservable(this, { local: observable })
    }
    local: {
        step: 'none' | 'login' | 'register',
        loginType: 'paw' | 'code',
        email: string,
        name: string,
        paw: string,
        inviteCode: string,
        failMsg: string,
        agree: boolean,
        el: HTMLElement,
        button: Button,
        expireCount: number,
        expireTime: any,
        code: string,
    } = {
            step: 'none',
            email: '',
            loginType: 'paw',
            name: '',
            inviteCode: '',
            failMsg: '',
            agree: false,
            paw: '',
            el: null,
            button: null,
            code: '',
            expireCount: -1,
            expireTime: null
        }
    renderInputEmail() {
        var local = this.local;
        async function checkInputEmail(button: Button) {
            local.button.loading = true;
            try {
                if (!local.email) {
                    local.failMsg = lst('请输入您的邮箱');
                    return;
                }
                if (!EmailRegex.test(local.email)) {
                    local.failMsg = lst('邮箱格式不正确');
                    return;
                }
                var r = await masterSock.get('/account/is/sign', { account: local.email });
                if (r?.ok) {
                    if (r.data.sign) {
                        local.failMsg = '';
                        local.step = 'login';
                    }
                    else {
                        local.failMsg = '';
                        local.step = 'register';
                    }
                }
            }
            catch (ex) {

            }
            finally {
                local.button.loading = false;
            }
        }
        return <div className='shy-login-box'>
            <div className='shy-login-box-account'>
                <Input size="larger" value={local.email}
                    name={'email'}
                    onEnter={e => checkInputEmail(local.button)}
                    onChange={e => local.email = e}
                    placeholder={lst('请输入您的邮箱')}></Input>
            </div>
            {local.failMsg && <div className='shy-login-box-fail'>{local.failMsg}</div>}
            <div className='shy-login-box-button'>
                <Button tag='button' ref={e => local.button = e} size='larger' block onClick={(e, b) => checkInputEmail(b)}><S>继续</S></Button >
            </div>
        </div>
    }
    renderLogin() {
        var local = this.local;
        var self = this;
        async function login(button: Button) {
            try {
                button.loading = true;
                if (!local.email) {
                    local.failMsg = lst('请输入您的邮箱');
                    return;
                }
                if (!EmailRegex.test(local.email)) {
                    local.failMsg = lst('邮箱格式不正确');
                    return;
                }
                if (local.loginType == 'paw') {
                    if (!local.paw) {
                        local.failMsg = lst('请输入您的密码');
                        return;
                    }
                    if (local.paw.length < 6) {
                        local.failMsg = lst('密码长度不能小于6位');
                        return;
                    }
                }
                else {
                    if (!local.code) {
                        local.failMsg = lst('请输入邮箱校验码');
                        return;
                    }
                    if (local.code.length !== 4) {
                        local.failMsg = lst('邮箱校验码长度不正确');
                        return;
                    }
                }
                var r = await masterSock.post('/account/sign', {
                    account: local.email,
                    paw: local.loginType == 'paw' ? local.paw : undefined,
                    code: local.loginType == 'code' ? local.code : undefined
                });
                if (r?.ok) {
                    if (r.data.sign === false) {
                        if (local.loginType == 'paw') local.failMsg = lst('邮箱或密码错误');
                        else local.failMsg = lst('邮箱或校验码错误');
                    }
                    else {
                        self.success(r.data.token, r.data.user);
                    }
                }
            }
            catch (ex) {

            }
            finally {
                button.loading = false;
            }
        }
        async function genCode() {
            if (local.expireCount == -1) {
                local.expireCount = 120 * 5;
                var result = await masterSock.post('/account/send/verify/code', { account: local.email });
                if (result.ok) {
                    if (result.data?.code) local.code = result.data.code;
                    local.expireCount = 120 * 5;
                    if (local.expireTime) clearInterval(local.expireTime)
                    local.expireTime = setInterval(() => {
                        local.expireCount -= 1;
                        if (local.expireCount < 0) {
                            local.expireCount = -1;
                            clearInterval(local.expireTime)
                        }
                    }, 1000);
                }
                else { local.expireCount = -1; local.failMsg = result.warn; }
            }
        }
        return <div className='shy-login-box'>
            <div className='shy-login-box-account'>
                <Input size="larger" value={local.email}
                    name={'email'}
                    onEnter={e => login(local.button)}
                    onChange={e => local.email = e}
                    placeholder={lst('请输入您的邮箱')}></Input>
            </div>
            {local.loginType == 'paw' && <div className='shy-login-box-account'>
                <Input size="larger" onEnter={e => login(local.button)} type='password' value={local.paw} name='paw' onChange={e => local.paw = e} placeholder={lst('请输入您的密码')}></Input>
            </div>}
            {local.loginType == 'code' && <div className='shy-login-box-code'>
                <Input size="larger" value={local.code}
                    name={'code'}
                    placeholder={lst('邮箱校验码')}
                    onChange={e => local.code = e}
                    onEnter={e => login(local.button)} />
                {local.expireCount == -1 && <Button tag='button' size='medium' onClick={e => genCode()}><S>发送邮箱校验码</S></Button>}
                {local.expireCount > -1 && <Button tag='button' size='medium' >{Math.round(local.expireCount / 60)}<S>分钟</S></Button>}
            </div>}
            {local.failMsg && <div className='shy-login-box-fail'>{local.failMsg}</div>}
            <div className='shy-login-box-button'>
                <Button tag='button' ref={e => local.button = e} size='larger' block onClick={(e, b) => login(b)}><S>登录</S></Button >
            </div>
            <div className="shy-login-box-type">
                <span><S>您也可以使用</S><a onMouseDown={e => { local.loginType = local.loginType == "code" ? "paw" : "code"; local.failMsg = ''; }}>{local.loginType == 'code' ? lst("密码登录") : lst("邮箱校验码登录")}</a></span>
            </div>
        </div>
    }
    renderRegister() {
        var local = this.local;
        var self = this;
        async function register(button: Button) {
            try {
                button.loading = true;
                if (!local.agree) {
                    local.failMsg = lst('请同意诗云服务协议');
                    return;
                }
                if (!local.email) {
                    local.failMsg = lst('请输入您的邮箱');
                    return;
                }
                if (!EmailRegex.test(local.email)) {
                    local.failMsg = lst('邮箱格式不正确');
                    return;
                }
                if (!local.paw) {
                    local.failMsg = lst('请输入您的密码');
                    return;
                }
                if (local.paw.length < 6) {
                    local.failMsg = lst('密码长度不能小于6位');
                    return;
                }
                if (!local.name) {
                    local.failMsg = lst('请输入您的昵称');
                    return;
                }
                if (local.name.length < 2) {
                    local.failMsg = lst('昵称长度不能小于2位');
                    return;
                }
                if (local.name.length > 20) {
                    local.failMsg = lst('昵称长度不能大于20位');
                    return;
                }
                var r = await masterSock.post('/account/reg', {
                    account: local.email,
                    paw: local.paw,
                    name: local.name,
                    inviteCode: local.inviteCode,
                })
                if (r?.ok) {
                    if (r.data.reg == false) {
                        self.local.failMsg = lst('注册失败');
                        return;
                    }
                    else self.success(r.data.token, r.data.user);
                }
            }
            catch (ex) {

            }
            finally {
                button.loading = false;
            }
        }
        return <div className='shy-login-box'>
            <div className='shy-login-box-account'>
                <Input size="larger" value={local.email}
                    name={'email'}
                    onEnter={e => register(local.button)}
                    onChange={e => local.email = e}
                    placeholder={lst('邮箱')}></Input>
            </div>
            <div className='shy-login-box-account'>
                <Input size="larger" value={local.name} name='paw' onChange={e => local.name = e} placeholder={lst('昵称')}></Input>
            </div>
            <div className='shy-login-box-account'>
                <Input size="larger" type='password' value={local.paw} name='paw' onChange={e => local.paw = e} placeholder={lst('密码')}></Input>
            </div>
            <div className='shy-login-box-account'>
                <Input size="larger" value={local.inviteCode} name='inviteCode' onChange={e => local.inviteCode = e} placeholder={lst('邀请码(选填)')}></Input>
            </div>
            <div className='shy-login-box-agree'>
                <input type='checkbox' checked={local.agree} onChange={e => local.agree = e.target.checked} /><label><Sp text={'同意诗云服务协议'}>同意诗云<a className="link-red" href='https://shy.live/service_protocol' target='_blank'>《服务协议》</a>及<a className="link-red" href='https://shy.live/privacy_protocol' target='_blank'>《隐私协议》</a></Sp></label>
            </div>
            {local.failMsg && <div className='shy-login-box-fail'>{local.failMsg}</div>}
            <div className='shy-login-box-button'>
                <Button tag='button' ref={e => local.button = e} size='larger' block onClick={(e, b) => register(b)}><S>注册</S></Button >
            </div>
        </div>
    }
    async success(token: string, user: Record<string, any>) {
        await sCache.set(CacheKey.token, token, 180, 'd');
        surface.user.syncUserInfo(user);
        await surface.user.createTim();
        if (typeof this.props.call == 'function') {
            this.props.call();
        }
        else {
            if (window.shyConfig.isServerSide) {
                return UrlRoute.push(ShyUrl.serverCenter)
            }
            var url = new URL(window.location.href);
            var back = url.searchParams.get('back');
            if (back) UrlRoute.redict(back);
            else UrlRoute.push(ShyUrl.home);
        }
    }
    render() {
        var local = this.local;
        return <div className={'shy-login desk-no-drag' + (isMobileOnly ? "  border-box vw100-c40" : " w-350")} >
            <div className="text-center gap-b-10 error"><S>需要邀请码才能注册</S></div>
            <div className='shy-login-head'>
                {!['login', 'register', 'name'].includes(local.step) && <span><S>登录/注册</S>&nbsp;<S>诗云</S></span>}
                {local.step == 'register' && <span><S>注册</S>&nbsp;<S>诗云</S></span>}
                {local.step == 'login' && <span><S>登录</S>&nbsp;<S>诗云</S></span>}
            </div>
            {local.step == 'none' && this.renderInputEmail()}
            {local.step == 'login' && this.renderLogin()}
            {local.step == 'register' && this.renderRegister()}
        </div>

    }
    componentWillUnmount(): void {
        if (this.local?.expireTime) {
            clearInterval(this.local.expireTime);
            this.local.expireTime = null;
        }
    }
}