import { observer } from "mobx-react";
import React from 'react';
export var FooterView = observer(function () {
    var now = new Date();
    return <div className='shy-site-footer'>
        <div>
            <h4>诗云</h4>
            <span>© 2021{now.getFullYear() > 2021 ? '-' + now.getFullYear() : ""}</span><br />
            <span>再小的个体也有自己的舞台</span><br />
            <a href="https://beian.miit.gov.cn" target="_blank" >沪ICP备19005623号-4</a>
        </div>
        <div>
            <h4>产品登录</h4>
            <a href='/sign'>帐号登录</a><br />
            <a href='/sign'>注册帐号</a>
        </div>
        <div>
            <h4>产品介绍</h4>
            <a href='/'>功能介绍</a><br />
            <a href='/scene'>使用场景</a>
        </div>
        <div>
            <h4>联系我们</h4>
            <span>hello@shy.red</span><br />
            <a href='/wechat'>微信社区</a>
        </div>
        <div>
            <h4>关于</h4>
            <a href='/service/protocol'>服务协议</a><br />
            <a href='/privacy/protocol'>隐私协议</a>
        </div>
    </div>
})
