import { observer } from "mobx-react";
import React from 'react';
import { FooterView } from "../layout/footer";
import { HeadView } from "../layout/head";
import pic from "../../assert/img/pic-1.jpg";
import md from "../../../CHANGELOG.zh-CN.md";
export var RouteView = observer(function () {
    return <div className='shy-site'>
        <HeadView></HeadView>
        <div className='shy-site-content' style={{
            backgroundImage: 'url(' + pic + ')',
            // backgroundRepeat: 'no-repeat',
            backgroundSize:'cover',
            backgroundAttachment:'fixed',
            paddingBottom:80
        }}>
            <div className='shy-site-block shy-site-publich-versions' dangerouslySetInnerHTML={{ __html: md }}></div>
        </div>
        <FooterView></FooterView>
    </div>
})