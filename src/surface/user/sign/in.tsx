import React from "react";
import { AppLang } from "../../../../i18n/enum";
import { appLangProvider } from "../../../../i18n/provider";
import { ShyUrl, UrlRoute } from "../../../history";
import { CacheKey, sCache } from "../../../../net/cache";
import { surface } from "../..";
import { userService } from "../../../../services/user";
import { Button } from "rich/component/view/button";
import { Input } from "rich/component/view/input";
import { observer, useLocalObservable } from "mobx-react";
import { inviteCode, phoneCode, phoneRegex } from "../../../../net/verify";
import { useLocation } from "react-router-dom";
import { config } from "../../../common/config";
import { workspaceService } from "../../../../services/workspace";

export var Login = observer(function () {
    var local = useLocalObservable<{
        step: 'phone' | 'login' | 'register' | 'name',
        phone: string,
        verifyPhoneCode: string,
        name: string,
        inviteCode: string,
        failMsg: string,
        expireCount: number,
        expireTime: any,
        agree: boolean
    }>(() => {
        return {
            phone: '',
            verifyPhoneCode: '',
            step: 'phone',
            name: '',
            inviteCode: '',
            failMsg: '',
            expireCount: -1,
            expireTime: null,
            agree: false
        }
    })
    var { current: el } = React.useRef<HTMLElement>(null);
    function lockButton() {
        var button = (el.querySelector('.shy-login-box-button button') as HTMLButtonElement);
        if (button.disabled == true) return true;
        button.disabled = true;
        return false;
    }
    function unlockButton() {
        if (el) {
            var button = (el.querySelector('.shy-login-box-button button') as HTMLButtonElement);
            button.disabled = false;
        }
        return true;
    }
    /**
     * 输入手机号
     * @returns 
     */
    async function phoneSign() {
        if (lockButton()) return;
        if (!local.phone) return unlockButton() && (local.failMsg = '请输入手机号');
        if (!phoneRegex.test(local.phone)) return unlockButton() && (local.failMsg = '手机号格式不正确');
        var r = await userService.checkPhone(local.phone);
        if (r && r.ok && r.data) {
            if (r.data.isUser) local.step = 'login'
            else local.step = 'register'
        }
        else local.failMsg = r.warn;
        unlockButton();
    }
    function renderPhone() {
        return <form><div className='shy-login-box'>
            <div className='shy-login-box-account'>
                <Input value={local.phone}
                    name={'phone'}
                    onEnter={e => phoneSign()}
                    onChange={e => local.phone = e}
                    placeholder={'请输入您的手机号'}></Input>
            </div>
            {local.failMsg && <div className='shy-login-box-fail'>{local.failMsg}</div>}
            <div className='shy-login-box-button'>
                <Button size='medium' block onClick={e => phoneSign()}>继续</Button >
            </div>
        </div></form>
    }
    /**
     * 输入手机验证码
     */
    async function genCode() {
        if (local.expireCount == -1) {
            local.expireCount = 120;
            var result = await userService.generatePhoneCode(local.phone);
            if (result.ok) {
                if (result.data?.code) local.verifyPhoneCode = result.data.code;
                local.expireCount = 120;
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
    async function loginOrRegister() {
        if (lockButton()) return;
        if (!local.phone) return unlockButton() && (local.failMsg = '请输入手机号');
        if (!phoneRegex.test(local.phone)) return unlockButton() && (local.failMsg = '手机号格式不正确');
        if (!local.verifyPhoneCode) return unlockButton() && (local.failMsg = '请输入手机短信验证码');
        if (!phoneCode.test(local.verifyPhoneCode)) return unlockButton() && (local.failMsg = '手机短信验证码格式不正确');
        if (local.step == 'register') {
            if (!local.inviteCode) return unlockButton() && (local.failMsg = '请输入邀请码');
            if (!inviteCode.test(local.inviteCode)) return unlockButton() && (local.failMsg = '邀请码输入不正确');
            if (!local.agree) return unlockButton() && (local.failMsg = '如您不同意诗云相关的服务协议将无法注册!');
        }
        var result = await userService.phoneSign(local.phone, local.verifyPhoneCode, local.step == 'register' ? local.inviteCode : undefined);
        unlockButton();
        if (result.ok == false) local.failMsg = result.warn;
        else {
            await sCache.set(CacheKey.token, result.data.token, 180, 'd');
            Object.assign(surface.user, result.data.user);
            local.failMsg = '';
            if (local.step == 'register') {
                local.step = 'name';
            }
            else {
                if (local.expireTime) { clearInterval(local.expireTime); local.expireTime = null; }
                return successAfter()
            }
        }
    }
    function renderLogin() {
        return <form><div className='shy-login-box'>
            <div className='shy-login-box-account'>
                <Input value={local.phone} name='phone' onChange={e => local.phone = e} placeholder={'请输入您的手机号'}></Input>
            </div>
            <div className='shy-login-box-code'>
                <Input value={local.verifyPhoneCode}
                    name={'code'}
                    placeholder={appLangProvider.getText(AppLang.PhoneVerifyCode)}
                    onChange={e => local.verifyPhoneCode = e}
                    onEnter={e => local.step == 'login' ? loginOrRegister() : undefined} />
                {local.expireCount == -1 && <Button size='medium' onClick={e => genCode()}>获取短信验证码</Button>}
                {local.expireCount > -1 && <Button size='medium' >{local.expireCount}s</Button>}
            </div>
            {local.step == 'register' && <div className='shy-login-box-account'>
                <Input name={'account'} value={local.inviteCode} onEnter={e => loginOrRegister()} onChange={e => local.inviteCode = e} placeholder={'请输入邀请码'}></Input>
            </div>}
            {local.step == 'register' && <div className='shy-login-box-agree'>
                <input type='checkbox' checked={local.agree} onChange={e => local.agree = e.target.checked} /><label>同意诗云<a href='/service/protocol' target='_blank'>《服务协议》</a>及<a href='/privacy/protocol' target='_blank'>《隐私协议》</a></label>
            </div>}
            <div className='shy-login-box-button'>
                <Button size='medium' block onClick={e => loginOrRegister()}>{local.step == 'register' ? '注册' : '登录'}</Button >
            </div>
            {local.failMsg && <div className='shy-login-box-fail'>{local.failMsg}</div>}
        </div></form>
    }
    /**
     * 注册在添加用户名
     * @returns 
     */
    async function updateName() {
        if (lockButton()) return;
        if (!local.name) return unlockButton() && (local.failMsg = '称呼不能为空');
        if (local.name.length < 2) return unlockButton() && (local.failMsg = '称呼太短，至少两位');
        if (local.name.length > 64) return unlockButton() && (local.failMsg = '称呼过长，长度限制在20位');
        var rr = await userService.update({ name: local.name });
        if (rr.ok) {
            surface.updateUser({ name: local.name });
            if (local.expireTime) { clearInterval(local.expireTime); local.expireTime = null; }
            return successAfter()
        }
        else local.failMsg = rr.warn;
        unlockButton();
    }
    function renderName() {
        return <div className='shy-login-box'>
            <div className='shy-login-box-account'>
                <Input value={local.name} onEnter={e => updateName()} onChange={e => local.name = e} placeholder={'请输入称呼'}></Input>
            </div>
            {local.failMsg && <div className='shy-login-box-fail'>{local.failMsg}</div>}
            <div className='shy-login-box-button'>
                <Button size='medium' block onClick={e => updateName()}>保存</Button >
            </div>
        </div>
    }
    let location = useLocation();
    async function successAfter() {
        if ((location?.state as any)?.back) {
            UrlRoute.redict((location?.state as any)?.back)
        }
        else {
            UrlRoute.push(ShyUrl.myWorkspace);
        }
    }
    React.useEffect(() => {
        if ((location?.state as any)?.phone) {
            local.phone = (location?.state as any)?.phone;
            phoneSign()
        }
    }, []);
    return <div className='shy-login-panel' ref={e => el = e}>
        <div className='shy-login-logo'><a href='/'>诗云</a></div>
        <div className='shy-login'  >
            <div className='shy-login-head'><span>登录</span></div>
            {local.step == 'phone' && renderPhone()}
            {(local.step == 'login' || local.step == 'register') && renderLogin()}
            {local.step == 'name' && renderName()}
        </div>
    </div>
})