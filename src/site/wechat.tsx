import { observer } from "mobx-react";
import React from 'react';
import { FooterView } from "./layout/footer";
import { HeadView } from "./layout/head";
import pic from "../assert/img/pic.jpg";
export var WeChatView = observer(function () {
    return <div className='shy-site'>
        <HeadView></HeadView>
        <div className='shy-site-content'>
            <img src={pic} style={{ width: '100%' }} />
        </div>
        <FooterView></FooterView>
    </div>
})