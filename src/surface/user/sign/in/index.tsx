import React from "react";
import { AppLang } from "../../../../../i18n/enum";
import { appLangProvider } from "../../../../../i18n/provider";
import { ShyUrl, UrlRoute } from "../../../../history";
import { CacheKey, sCache } from "../../../../../net/cache";
import { surface } from "../../..";
import { Button } from "rich/component/view/button";
import { Input } from "rich/component/view/input";
import { observer, useLocalObservable } from "mobx-react";
import { inviteCode, phoneCode, phoneRegex } from "../../../../common/verify";
import { useLocation } from "react-router-dom";
import { channel } from "rich/net/channel";
import Logo from "../../../../assert/img/shy.256.png";
import "./wsLogin.js";
import { Divider } from "rich/component/view/grid";
import { Icon } from "rich/component/view/icon";
export var Login = observer(function () {
    var local = useLocalObservable<{
        step: 'phone' | 'login' | 'register' | 'name',
        loginType: 'paw' | 'code',
        phone: string,
        verifyPhoneCode: string,
        name: string,
        paw: string,
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
            loginType: 'paw',
            name: '',
            inviteCode: '',
            failMsg: '',
            expireCount: -1,
            expireTime: null,
            agree: false,
            paw: ''
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
        local.failMsg = '';
        if (lockButton()) return;
        if (!local.phone) return unlockButton() && (local.failMsg = '请输入手机号');
        if (!(phoneRegex.test(local.phone) || local.phone.toString().startsWith('5') && local.phone.length == '13524169334'.length)) return unlockButton() && (local.failMsg = '手机号格式不正确');
        var r = await channel.get('/phone/check/sign', { phone: local.phone });
        if (r && r.ok && r.data) {
            if (r.data.sign) local.step = 'login'
            else local.step = 'register'
        }
        else local.failMsg = r.warn;
        unlockButton();
    }
    function renderPhone() {
        return <div className='shy-login-box'>
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
        </div>
    }
    /**
     * 输入手机验证码
     */
    async function genCode() {
        if (local.expireCount == -1) {
            local.expireCount = 120;
            var result = await channel.post('/phone/sms/code', { phone: local.phone });
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
        local.failMsg = '';
        if (lockButton()) return;
        if (!local.phone) return unlockButton() && (local.failMsg = '请输入手机号');
        if (!phoneRegex.test(local.phone)) return unlockButton() && (local.failMsg = '手机号格式不正确');
        if (local.loginType == 'paw' && local.step == 'login') {
            if (!local.paw) return unlockButton() && (local.failMsg = '密码不能为空');
            if (local.paw.length < 5) return unlockButton() && (local.failMsg = '密码输入不合法');
        }
        else {
            if (!local.verifyPhoneCode) return unlockButton() && (local.failMsg = '请输入手机短信验证码');
            if (!phoneCode.test(local.verifyPhoneCode)) return unlockButton() && (local.failMsg = '手机短信验证码格式不正确');
        }
        if (local.step == 'register') {
            if (!local.inviteCode) return unlockButton() && (local.failMsg = '请输入邀请码');
            if (!inviteCode.test(local.inviteCode)) return unlockButton() && (local.failMsg = '邀请码输入不正确');
            if (!local.agree) return unlockButton() && (local.failMsg = '如您不同意诗云相关的服务协议将无法注册!');
        }
        var result = local.loginType == 'paw' && local.step == 'login' ? await channel.put('/paw/sign', { phone: local.phone, paw: local.paw, inviteCode: undefined }) : await channel.put('/phone/sign', { phone: local.phone, code: local.verifyPhoneCode, inviteCode: local.step == 'register' ? local.inviteCode : undefined })
        unlockButton();
        if (result.ok == false) local.failMsg = result.warn;
        else {
            await sCache.set(CacheKey.token, result.data.token, 180, 'd');
            surface.user.syncUserInfo(result.data.user);
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
        if (local.step == 'register') {
            return <div className='shy-login-box'>
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
                    <input type='checkbox' checked={local.agree} onChange={e => local.agree = e.target.checked} /><label>同意诗云<a href='https://shy.live/service_protocol' target='_blank'>《服务协议》</a>及<a href='https://shy.live/privacy_protocol' target='_blank'>《隐私协议》</a></label>
                </div>}
                <div className='shy-login-box-button'>
                    <Button size='medium' block onClick={e => loginOrRegister()}>{'注册'}</Button >
                </div>
                {local.failMsg && <div className='shy-login-box-fail'>{local.failMsg}</div>}
            </div>
        }
        else {
            return <div className='shy-login-box'>
                <div className='shy-login-box-account'>
                    <Input value={local.phone} name='phone' onChange={e => local.phone = e} placeholder={'请输入您的手机号'}></Input>
                </div>
                {local.loginType == 'paw' && <div className='shy-login-box-account'>
                    <Input type='password' value={local.paw} name='paw' onChange={e => local.paw = e} placeholder={'请输入您的密码'}></Input>
                </div>}
                {local.loginType == 'code' && <div className='shy-login-box-code'>
                    <Input value={local.verifyPhoneCode}
                        name={'code'}
                        placeholder={appLangProvider.getText(AppLang.PhoneVerifyCode)}
                        onChange={e => local.verifyPhoneCode = e}
                        onEnter={e => local.step == 'login' ? loginOrRegister() : undefined} />
                    {local.expireCount == -1 && <Button size='medium' onClick={e => genCode()}>获取短信验证码</Button>}
                    {local.expireCount > -1 && <Button size='medium' >{local.expireCount}s</Button>}
                </div>}
                <div className='shy-login-box-button'>
                    <Button size='medium' block onClick={e => loginOrRegister()}>{'登录'}</Button >
                </div>
                <div className="shy-login-box-type">
                    <span>您也可以使用<a onMouseDown={e => { local.loginType = local.loginType == "code" ? "paw" : "code"; local.failMsg = ''; }}>{local.loginType == 'code' ? "密码登录" : "手机短信登录"}</a></span>
                </div>
                {local.failMsg && <div className='shy-login-box-fail'>{local.failMsg}</div>}
            </div>
        }
    }
    /**
     * 注册在添加用户名
     * @returns 
     */
    async function updateName() {
        local.failMsg = '';
        if (lockButton()) return;
        if (!local.name) return unlockButton() && (local.failMsg = '称呼不能为空');
        if (local.name.length < 2) return unlockButton() && (local.failMsg = '称呼太短，至少两位');
        if (local.name.length > 64) return unlockButton() && (local.failMsg = '称呼过长，长度限制在20位');
        if (!local.paw) return unlockButton() && (local.failMsg = '密码不能为空');
        if (local.paw.length < 5) return unlockButton() && (local.failMsg = '密码长度不能小于6位');
        await channel.patch('/sign/patch', { name: local.name, paw: local.paw });
        surface.user.name = local.name;
        if (local.expireTime) { clearInterval(local.expireTime); local.expireTime = null; }
        return successAfter()
    }
    function renderName() {
        return <div className='shy-login-box'>
            <div className='shy-login-box-account'>
                <Input value={local.name} onEnter={e => updateName()} onChange={e => local.name = e} placeholder={'请输入称呼'}></Input>
            </div>
            <div className='shy-login-box-account'>
                <Input type='password' value={local.paw} onEnter={e => updateName()} onChange={e => local.paw = e} placeholder={'请输入密码'}></Input>
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
        function receiveMessage(event) {
            var data = JSON.parse(event.data);
            if (data.state == 'success') {
                //Sock.post('/login/verify_ok', data.userinfo);
            }
            else if (data.state == 'refuse') {
                alert('请在微信扫码后确认，否则无法登录');
                //vm.openWeixinQr(true);
            }
            else if (data.state == 'bind') {
                var info = data.info;
                // Sock.post("/login/toReg", { bindInfo: info }, function (err, result) {
                // });
            }
        }
        window.addEventListener("message", receiveMessage, false);
    }, []);

    async function openWeixin(state: string) {
        new (window as any).WxLogin({
            self_redirect: true,
            id: "QRCodePanel",
            appid: "wx2393b2ce548478c3",
            scope: "snsapi_login",
            redirect_uri: encodeURIComponent("https://viewparse.com/user_open/weixin_back"),
            state: state
        });
    }

    return <div className='shy-login-panel' ref={e => el = e}>
        <div className='shy-login-logo'><a href='/'><img style={{ width: 30, height: 30 }} src={Logo} /><span>诗云</span></a></div>
        <div className='shy-login'>
            <div className='shy-login-head'>
                {!['login', 'register', 'name'].includes(local.step) && <span>登录/注册&nbsp;诗云</span>}
                {local.step == 'register' && <span>注册&nbsp;诗云</span>}
                {local.step == 'login' && <span>登录&nbsp;诗云</span>}
                {local.step == 'name' && <span>完善个人信息</span>}
            </div>
            {local.step == 'phone' && renderPhone()}
            {(local.step == 'login' || local.step == 'register') && renderLogin()}
            {local.step == 'name' && renderName()}
            <Divider></Divider>
            <div className="shy-login-open">
                <Icon icon={ }></Icon>
            </div>
        </div>
    </div>
})