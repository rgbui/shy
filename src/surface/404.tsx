import { observer } from "mobx-react-lite";
import React from "react";
export var View404 = observer(function () {
    return <div className='shy-404'>
        <div className='shy-404-content'>
            <h3 style={{ textAlign: 'center', fontSize:120 }}>404</h3>
            <div className="shy-404-content-text">
                <span>当前的页面不存在,返回至<a href='https://shy.live'>诗云</a></span>
            </div>
        </div>
    </div>
})