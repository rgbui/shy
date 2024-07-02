import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { isMobileOnly } from "react-device-detect";
import { Button } from "rich/component/view/button";
import { Input } from "rich/component/view/input";
import { lst } from "rich/i18n/store";
import { S, Sp } from "rich/i18n/view";
import { sCache, CacheKey } from "../../../../../net/cache";
import { masterSock } from "../../../../../net/sock";
import { UrlRoute, ShyUrl } from "../../../../history";
import { surface } from "../../../app/store";
import { channel } from "rich/net/channel";
import { WeixinOpen } from "../../../../component/winxin/open";
import { Divider } from "rich/component/view/grid";
import { Icon } from "rich/component/view/icon";
import { WechatSvg } from "../../../../component/svgs";
import { EmailRegex, PhoneRegex } from "../../../../../services/common/base";
import { config } from "../../../../../common/config";


@observer
export class CnLogin extends React.Component<{ call?: () => void }> {
    constructor(props) {
        super(props);
        if (config.isPro) {
            this.local.step = 'wixin';
        }
        makeObservable(this, {
            local: observable
        })
    }
    local: {
        step: 'wixin' | 'input' | 'login' | 'register' | 'setName',
        loginType: 'paw' | 'code',
        account: string,
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
        sign: { token: string, user: Record<string, any> }
    } = {
            step: 'input',
            account: '',
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
            expireTime: null,
            sign: null
        }
    renderInputAccount() {
        var local = this.local;
        async function checkInputEmail() {
            local.button.loading = true;
            local.failMsg = '';
            try {
                if (!local.account) {
                    local.failMsg = lst('请输入您的手机号或邮箱');
                    return;
                }
                if (!(EmailRegex.test(local.account) || PhoneRegex.test(local.account))) {
                    local.failMsg = lst('邮箱或手机号格式不正确');
                    return;
                }
                var r = await masterSock.get('/account/is/sign', { account: local.account });
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
        return <><div className='shy-login-box'>
            <div className='shy-login-box-account'>
                <Input size="larger" value={local.account}
                    name={'email'}
                    onEnter={e => checkInputEmail()}
                    onChange={e => local.account = e}
                    placeholder={'邮箱或手机号...'}></Input>
            </div>
            <div className='shy-login-box-button'>
                <Button tag='button' ref={e => local.button = e} size='larger' block onClick={(e, b) => checkInputEmail()}><S>继续</S></Button >
            </div>
            {local.failMsg && <div className='shy-login-box-fail'>{local.failMsg}</div>}
        </div>
            <Divider style={{ marginTop: 20 }} align="center"><S>其他登录方式</S></Divider>
            <div className="shy-login-open">
                <Icon className={'cursor'} onClick={e => local.step = 'wixin'} size={40} icon={WechatSvg}></Icon>
            </div>
        </>
    }
    renderLogin() {
        var local = this.local;
        var self = this;
        async function login(button: Button) {
            try {
                button.loading = true;
                if (!local.account) {
                    local.failMsg = lst('请输入您的手机号或邮箱');
                    return;
                }
                if (!(PhoneRegex.test(local.account) || EmailRegex.test(local.account))) {
                    local.failMsg = lst('帐号格式不正确');
                    return
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
                        local.failMsg = lst('请输入验证码');
                        return;
                    }
                    if (local.code.length !== 4) {
                        local.failMsg = lst('验证码长度不正确');
                        return;
                    }
                }
                var r = await masterSock.post('/account/sign', {
                    account: local.account,
                    paw: local.loginType == 'paw' ? local.paw : undefined,
                    code: local.loginType == 'code' ? local.code : undefined
                });
                if (r?.ok) {
                    if (r.data.sign === false) {
                        if (local.loginType == 'paw')
                            if (PhoneRegex.test(local.account)) local.failMsg = lst('手机号或密码错误');
                            else local.failMsg = lst('邮箱或密码错误');
                        else {
                            if (PhoneRegex.test(local.account)) local.failMsg = lst('手机号或验证码错误');
                            else local.failMsg = lst('邮箱或验证码错误');
                        }
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
                var longcount = EmailRegex.test(local.account) ? 120 * 5 : 120;
                local.expireCount = longcount;
                var result = await masterSock.post('/account/send/verify/code', { account: local.account });
                if (result.ok) {
                    if (result.data?.sended) {
                        local.expireCount = -1;
                        local.failMsg = EmailRegex.test(local.account) ? lst('邮箱校验码已发送') : lst('短信验证码已发送');
                    }
                    else {
                        if (result.data?.code) local.code = result.data.code;
                        local.expireCount = longcount;
                        if (local.expireTime) clearInterval(local.expireTime)
                        local.expireTime = setInterval(() => {
                            local.expireCount -= 1;
                            if (local.expireCount < 0) {
                                local.expireCount = -1;
                                clearInterval(local.expireTime)
                            }
                        }, 1000);
                    }
                }
                else { local.expireCount = -1; local.failMsg = result.warn; }
            }
        }
        return <div className='shy-login-box'>
            <div className='shy-login-box-account'>
                <Input
                    size="larger"
                    value={local.account}
                    name={'account'}
                    onEnter={e => login(local.button)}
                    onChange={e => local.account = e}
                    placeholder={lst('请输入您的帐号')}></Input>
            </div>
            {local.loginType == 'paw' && <div className='shy-login-box-account'>
                <Input size="larger" onEnter={e => login(local.button)} type='password' value={local.paw} name='paw' onChange={e => local.paw = e} placeholder={lst('请输入您的密码')}></Input>
            </div>}
            {local.loginType == 'code' && <div className='shy-login-box-code'>
                <Input size="larger" value={local.code}
                    name={'code'}
                    placeholder={EmailRegex.test(local.account) ? lst('邮箱校验码') : lst('短信验证码')}
                    onChange={e => local.code = e}
                    onEnter={e => login(local.button)} />
                {local.expireCount == -1 && <Button tag='button' size='medium' onClick={e => genCode()}>{EmailRegex.test(local.account) ? <S>发送邮箱校验码</S> : <S>发送手机短信码</S>}</Button>}
                {local.expireCount > -1 && <Button tag='button' size='medium' >{EmailRegex.test(local.account) ? (Math.round(local.expireCount / 60) + lst('分钟')) : (local.expireCount + 's')}</Button>}
            </div>}
            {local.failMsg && <div className='shy-login-box-fail'>{local.failMsg}</div>}
            <div className='shy-login-box-button'>
                <Button tag='button' ref={e => local.button = e} size='larger' block onClick={(e, b) => login(b)}><S>登录</S></Button >
            </div>
            <div className="shy-login-box-type">
                <div className="flex-fixed f-14 cursor" onMouseDown={e => {
                    this.local.step = 'input';
                }}>后退</div>
                <div className="flex-auto">

                </div>
                <span className="flex-fixed f-14"><a style={{ textDecoration: 'underline' }} onMouseDown={e => { local.loginType = local.loginType == "code" ? "paw" : "code"; local.failMsg = ''; }}>{local.loginType == 'code' ? "密码登录" : "手机短信或邮箱校验登录"}</a></span>
            </div>
        </div>
    }
    renderRegister() {
        var local = this.local;
        var self = this;
        async function genCode() {
            if (local.expireCount == -1) {
                local.expireCount = 120;
                var result = await masterSock.post('/account/send/verify/code', { account: local.account });
                if (result.ok) {
                    if (result.data?.sended) {
                        local.expireCount = -1;
                        local.failMsg = EmailRegex.test(local.account) ? lst('邮箱校验码已发送') : lst('短信验证码已发送');
                    }
                    else {
                        if (result.data?.code) local.code = result.data.code;
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
                }
                else { local.expireCount = -1; local.failMsg = result.warn; }
            }
        }
        async function register(button: Button) {
            try {
                button.loading = true;
                if (!local.agree) {
                    local.failMsg = lst('请同意诗云服务协议');
                    return;
                }
                if (!local.account) {
                    local.failMsg = lst('请输入您的手机号或邮箱');
                    return;
                }
                if (!(PhoneRegex.test(local.account) || EmailRegex.test(local.account))) {
                    local.failMsg = lst('帐号格式不正确');
                    return;
                }
                if (PhoneRegex.test(local.account)) {
                    if (!local.code) {
                        local.failMsg = lst('请输入验证码');
                        return;
                    }
                    if (local.code.length !== 4) {
                        local.failMsg = lst('验证码长度不正确');
                        return;
                    }
                }

                var r = await masterSock.post('/account/reg', {
                    account: local.account,
                    code: local.code,
                    // password: local.paw,
                    // name: local.name,
                    inviteCode: local.inviteCode,
                })
                if (r?.ok) {
                    if (r.data.reg == false) {
                        self.local.failMsg = lst('注册失败');
                        return;
                    }
                    else {
                        self.local.sign = { token: r.data.token, user: r.data.user };
                        self.local.step = 'setName';
                        self.local.name = r.data.user.name;
                        self.success(r.data.token, r.data.user, false, true);
                    }
                }
            }
            catch (ex) {

            }
            finally {
                button.loading = false;
            }
        }
        var isEmail = EmailRegex.test(this.local.account);
        return <div className='shy-login-box'>
            <div className='shy-login-box-account'>
                <Input size="larger" value={local.account}
                    readonly={true}
                    name={'phone'}
                    onEnter={e => register(local.button)}
                    onChange={e => local.account = e}
                    placeholder={lst('手机号或邮箱')}></Input>
            </div>
            {!isEmail && <div className='shy-login-box-code'>
                <Input
                    size="larger"
                    value={local.code}
                    name={'code'}
                    placeholder={lst('手机短信码')}
                    onChange={e => local.code = e}
                />
                {local.expireCount == -1 && <Button tag='button' size='medium' onClick={e => genCode()}><S>发送手机短信码</S></Button>}
                {local.expireCount > -1 && <Button tag='button' size='medium' >{Math.round(local.expireCount)}s</Button>}
            </div>}
            <div className='shy-login-box-account'>
                <Input size="larger" value={local.inviteCode} name='inviteCode' onChange={e => local.inviteCode = e} placeholder={lst('邀请码(选填)')}></Input>
            </div>
            <div className='shy-login-box-agree'>
                <input type='checkbox' checked={local.agree} onChange={e => local.agree = e.target.checked} /><label><Sp text={'同意诗云服务协议'}>同意诗云<a className="link-red" href='https://shy.live/service_protocol' target='_blank'>《服务协议》</a>及<a className="link-red" href='https://shy.live/privacy_protocol' target='_blank'>《隐私协议》</a></Sp></label>
            </div>
            <div className='shy-login-box-button'>
                <Button tag='button' ref={e => local.button = e} size='larger' block onClick={(e, b) => register(b)}><S>注册</S></Button >
            </div>
            {local.failMsg && <div className='shy-login-box-fail'>{local.failMsg}</div>}
        </div>
    }
    async success(token: string, user: Record<string, any>, isRedict: boolean = true, isSign: boolean = true) {
        if (isSign) {
            await sCache.set(CacheKey.token, token, 180, 'd');
            surface.user.syncUserInfo(user);
            await surface.user.createTim();
        }
        if (isRedict) {
            this.redict();
        }
    }
    redict() {
        if (typeof this.props.call == 'function') this.props.call()
        else {
            if (window.shyConfig.isServerSide) {
                return UrlRoute.push(ShyUrl.serverCenter)
            }
            var url = new URL(window.location.href);
            var back = url.searchParams.get('back');
            if (back) {
                location.href = back;
            }
            else return UrlRoute.push(ShyUrl.home);
        }
    }
    renderWx() {
        var self = this;
        async function weixinOnChange(e: { exists: boolean, open: { openId: string, platform: string, nickname: string } }) {
            if (e.exists) {
                var r = await masterSock.post('/account/sign', { wx: e.open });
                if (r.ok) {
                    var rd = r.data;
                    self.success(rd.token, rd.user);
                }
            }
            else {
                self.local.name = e.open.nickname;
                var rc = await masterSock.post('/account/reg', {
                    wx: e.open
                })
                if (rc?.ok) {
                    if (rc.data.reg == false) {
                        self.local.failMsg = lst('注册失败');
                        return;
                    }
                    else {
                        self.local.sign = { token: rc.data.token, user: rc.data.user };
                        // self.local.step = 'setName';
                        self.success(rc.data.token, rc.data.user);
                    }
                }
                else {
                    self.local.failMsg = lst('注册失败');
                }
            }
        }
        return <div>
            <WeixinOpen onChange={weixinOnChange}></WeixinOpen>
            <div className="f-14 remark cursor flex-center">
                <span className="round padding-w-10 h-30 flex-center cursor border-light item-hover" onMouseDown={e => this.local.step = 'input'}><S>帐号登录</S></span>
            </div>
        </div>
    }
    renderSetName() {
        var self = this;
        async function updateName() {
            try {
                local.button.loading = true;
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
                await channel.patch('/sign/patch', { name: local.name, paw: local.paw });
                surface.user.name = local.name;
                self.success(null, null, true, false)
            }
            catch (ex) {

            }
            finally {
                if (local.button)
                    local.button.loading = false;
            }
        }
        var local = this.local;
        return <div className='shy-login-box'>
            <div className='shy-login-box-account'>
                <Input size="larger" value={local.name} onChange={e => local.name = e} placeholder={lst('请输入称呼')}></Input>
            </div>
            <div className='shy-login-box-account'>
                <Input size="larger" type='password' value={local.paw} onEnter={e => updateName()} onChange={e => local.paw = e} placeholder={lst('请输入密码')}></Input>
            </div>
            {local.failMsg && <div className='shy-login-box-fail'>{local.failMsg}</div>}
            <div className='shy-login-box-button'>
                <Button ref={e => local.button = e} tag="button" size="larger" block onClick={e => updateName()}><S>保存</S></Button >
            </div>
        </div>
    }
    render() {
        var local = this.local;
        return <div className={'shy-login desk-no-drag' + (isMobileOnly ? "  border-box vw100-c40" : " w-350")} >
            <div className="text-center gap-b-10 error"><S>需要邀请码才能注册</S></div>
            <div className='shy-login-head'>
                {!['login', 'register', 'setName'].includes(local.step) && <span><S>登录/注册</S>&nbsp;<S>诗云</S></span>}
                {local.step == 'register' && <span><S>注册</S>&nbsp;<S>诗云</S></span>}
                {local.step == 'login' && <span><S>登录</S>&nbsp;<S>诗云</S></span>}
                {local.step == 'setName' && <span><S>完善个人信息</S></span>}
            </div>
            {local.step == 'input' && this.renderInputAccount()}
            {local.step == 'wixin' && this.renderWx()}
            {local.step == 'login' && this.renderLogin()}
            {local.step == 'register' && this.renderRegister()}
            {local.step == 'setName' && this.renderSetName()}
        </div>
    }
    componentWillUnmount(): void {
        if (this.local?.expireTime) {
            clearInterval(this.local.expireTime);
            this.local.expireTime = null;
        }
    }
    componentDidMount(): void {
        if (surface.user?.isSign) {
            this.redict();
        }
    }
}