import { observer } from "mobx-react";
import React from 'react';
import { FooterView } from "../layout/footer";
import { HeadView } from "../layout/head";
import pic from "../../../assert/img/pic-8.jpg";
import "./style.less";
import { Button } from "rich/component/view/button";
export var DownloadView = observer(function () {
    return <div className='shy-site'>
        <HeadView></HeadView>
        <div className='shy-site-content' style={{
            backgroundImage: 'url(' + pic + ')',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed'
        }}>
            <div className='shy-site-block' >
                <div className='shy-site-download' style={{
                    backgroundColor: 'rgba(255,255,255,.6)',
                    padding: 10,
                    paddingBottom: 80,
                    backdropFilter: `blur(10px)`
                }}>
                    <h2>下载诗云</h2>
                    <div className='shy-site-download-slogan'>文化气象万千，诗云无所不在</div>
                    <div className='shy-site-clients'>
                        <div>
                            <div className='shy-site-client'>
                                <span className='sy sy-chrome' style={{ fontSize: 48 }}></span>
                                <div>Web</div>
                                <a href='/sign/in'><Button>使用</Button></a>
                            </div>
                            <div className='shy-site-client'>
                                <span className='sy sy-mac' style={{marginTop:-20,marginBottom:20}}></span>
                                <div>Mac OS</div>
                                <a><Button>开发中</Button></a>
                            </div>
                            <div className='shy-site-client'>
                                <span className='sy sy-windows' style={{ fontSize: 48 }}></span>
                                <div>Windows</div>
                                <a> <Button>开发中</Button></a>
                            </div>
                            <div className='shy-site-client'>
                                <span className='sy sy-linux'  style={{ fontSize: 60}}></span>
                                <div>Linux</div>
                                <a> <Button>开发中</Button></a>
                            </div>
                        </div>
                        <div>
                            <div className='shy-site-client'>
                                <span className='sy sy-android'></span>
                                <div>Android</div>
                                <a>   <Button style={{ width: 100 }}>计划开发</Button></a>
                            </div>
                            <div className='shy-site-client'>
                                <span className='sy sy-ios'  style={{ fontSize: 60}}></span>
                                <div>Mac IOS</div>
                                <a><Button>计划开发</Button></a>
                            </div>
                            <div className='shy-site-client'>
                                <span className='sy sy-ipad'></span>
                                <div>IPad</div>
                                <a> <Button>计划开发</Button></a>
                            </div>
                            <div className='shy-site-client'>
                                <span className='sy sy-wechat'></span>
                                <div>微信小程序</div>
                                <a> <Button>计划开发</Button></a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <FooterView></FooterView>
    </div>
})