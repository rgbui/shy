import { observer } from "mobx-react";
import React from 'react';
import { FooterView } from "./layout/footer";
import { HeadView } from "./layout/head";
import "./style.less";
export var SiteView = observer(function () {
    return <div className='shy-site'>
        <HeadView></HeadView>
        <div className='shy-site-content'> </div>
        <FooterView></FooterView>
    </div>
})

