import { observer } from "mobx-react";
import React from 'react';
import { FooterView } from "../layout/footer";
import { HeadView } from "../layout/head";

export var PrivateView = observer(function () {
    return <div className='shy-site'>
        <HeadView></HeadView>
        <div className='shy-site-content'>待添加</div>
        <FooterView></FooterView>
    </div>
})