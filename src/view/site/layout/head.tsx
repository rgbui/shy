import { observer } from "mobx-react";
import React from 'react';
import { Link } from "react-router-dom";
import { config } from "../../../common/config";
import ShySvg from "../../../assert/img/shy.name.svg";
export var HeadView = observer(function () {
    return <div className='shy-site-head'>
        <a className='shy-site-head-logo' href='/'>
            {/* <span style={{ fontSize: 48, display: 'inline-block', marginRight: 4 }}>😛</span>
            <h3 style={{ fontSize: 24 }}>诗云</h3> */}
            <span style={{height:40,display:'block'}}><ShySvg style={{height:'100%'}}/></span>
          
            {!config.isPro&&<em className='shy-site-head-beta'>beta</em>}
        </a>
        <div className='shy-site-head-navs'>
            <a href='/'>产品介绍</a>
            {/* <a href='/scene'>使用场景</a>
             */}
            <a href='/route'>路线图</a>
            <a href='/download'>下载</a>
            {/* <a href='/help'>帮肋</a> */}
            <a href='/shiyun'>《诗云》</a>
        </div>
        <div className='shy-site-head-user'>
            <Link to='/sign/in'>注册/登录</Link>
        </div>
    </div>
})
