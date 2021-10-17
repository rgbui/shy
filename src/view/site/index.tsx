import { observer } from "mobx-react";
import React from 'react';
import { Button } from "rich/component/view/button";
import { Input } from "rich/component/view/input";
import { FooterView } from "./layout/footer";
import { HeadView } from "./layout/head";
import "./style.less";
import pic from "../../assert/img/pic.jpg";
export var SiteView = observer(function () {
    return <div className='shy-site'>
        <HeadView></HeadView>
        <div className='shy-site-content' style={{
            backgroundImage: 'url(' + pic + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% auto'
        }}>
            <div className='shy-site-block shy-site-block-slogan'>
                <div className='shy-site-block-slogan-text'>
                    <p>浩瀚诗云，不如我们再造一个盛唐</p>
                    <p>诗云是一款高效搭建场景的云端协同工具。</p>
                    <p>用诗云你可以和朋友一起<span>做笔记</span></p>
                </div>
                <div className='shy-site-block-slogan-login'>
                    <Input placeholder={'请输入你的手机号'}></Input>
                    <Button>免费使用</Button>
                </div>
            </div>
        </div>
        <FooterView></FooterView>
    </div>
})

