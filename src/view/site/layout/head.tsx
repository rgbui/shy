import { observer } from "mobx-react";
import React from 'react';
import { Link } from "react-router-dom";
export var HeadView = observer(function () {
    return <div className='shy-site-head'>

        <a className='shy-site-head-logo' href='/'>
            <span style={{ fontSize: 48, display: 'inline-block', marginRight: 4 }}>😛</span>
            <h2>诗云</h2>
        </a>
        <div className='shy-site-head-navs'>
            {/*<a>使用场景</a>
                <a>下载</a>
                <a>路线图</a>
                <a>帮肋</a>*/}
        </div>
        <div className='shy-site-head-user'>
            <Link to='/sign'>注册/登录</Link>
        </div>
    </div>
})
