import { observer, useLocalObservable } from "mobx-react";
import React from 'react';
import { Button } from "rich/component/view/button";
import { Input } from "rich/component/view/input";
import { FooterView } from "../layout/footer";
import { HeadView } from "../layout/head";
import "./style.less";
import pic from "../../assert/img/pic.jpg";
import { SyHistory } from "../../history";
import { util } from "rich/util/util";
var works: string[] = ['做笔记', '写作业', '线上论讨'];
export var SiteView = observer(function () {
    var [phone, setPhone] = React.useState('');
    var local = useLocalObservable<{ text: string, at: number }>(() => {
        return {
            text: '写日志',
            at: 0
        }
    })
    function toLogin() {
        SyHistory.push('/sign/in', { phone })
    }
    async function setDo() {
        local.text = works[local.at];
        await util.delay(1000 * 2);
        local.text = '';
        await util.delay(1000);
        local.at += 1;
        if (local.at >= works.length) local.at = 0;
        setDo();
    }
    React.useEffect(() => {
        setDo();
    }, [])
    return <div className='shy-site'>
        <HeadView></HeadView>
        <div className='shy-site-content' style={{
            backgroundImage: 'url(' + pic + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% auto'
        }}>
            <div className='shy-site-block shy-site-block-slogan'>
                <div className='shy-site-block-slogan-text'>
                    <p style={{ fontSize: 48, textAlign: 'center' }}>浩瀚诗云，不如我们再造一个盛唐</p>
                    <p style={{ fontSize: 24, textAlign: 'center' }}><i>诗云</i>一款多人在线的协同工具</p>
                    <p style={{ fontSize: 24, textAlign: 'center' }}>一起<em className='shy-site-block-slogan-text-cursor'></em><span>{local.text}</span></p>
                </div>
                <div className='shy-site-block-slogan-login'>
                    <Input value={phone} onChange={e => setPhone(e)} placeholder={'请输入你的手机号'}></Input>
                    <Button size='medium' onClick={e => toLogin()}>免费使用</Button>
                </div>
            </div>
            <div className='shy-site-block' style={{ backgroundColor: '#fff6ea' }}>
                <h3>Block 编辑模式</h3>
            </div>
            <div className='shy-site-block' style={{ backgroundColor: '#ffc107' }}>
                <h3>列表大纲</h3>
                <p>梳理要点，逻辑分层</p>
            </div>
            <div className='shy-site-block' style={{ backgroundColor: 'rgb(205, 219, 233)' }}>
                <h3>多设备数据同步</h3>
                <p>保持数据的完整和一致</p>
            </div>
            <div className='shy-site-block' style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                <h3>多设备数据同步</h3>
                <p>保持数据的完整和一致</p>
            </div>
        </div>
        <FooterView></FooterView>
    </div>
})

