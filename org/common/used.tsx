import React from "react";
import { S } from "rich/i18n/view";



export function UsedView(){

    return   <div className="shy-site-block" style={{ display: 'none' }}>
    <div className="padding-h-100">
        <div className="flex-center" style={{ fontSize: '30px' }}><S>他们都在用诗云</S></div>
        <div className="flex-center remark f-12 gap-h-20"><S text='排名不分先后顺序'>（*排名不分先后顺序）</S></div>
        <div className="flex r-gap-w-20 r-gap-h-10 r-w-180 flex-center flex-wrap">
            <img src='static/img/org/tsinghua.png' />
            <img src='static/img/org/cpic.png' />
            <img src='static/img/org/fl1.png' />
            <img src='static/img/org/logo_beijing.png' />
            <img src='static/img/org/mo1.png' />
            <img src='static/img/org/nju.png' />
            <img src='static/img/org/pa1.png' />
            <img src='static/img/org/xm1.png' />
            <img src='static/img/org/logo_xunfei.png' />
        </div>
    </div>
</div>
}