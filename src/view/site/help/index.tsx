import { observer } from "mobx-react";
import React from 'react';
import { FooterView } from "../layout/footer";
import { HeadView } from "../layout/head";

export var HelpView = observer(function () {
    return <div className='shy-site'>
        <HeadView></HeadView>
        <div className='shy-site-content'><div className='shy-site-block'>待添加</div></div>
        <FooterView></FooterView>
    </div>
})