import { observer } from "mobx-react-lite";
import React from "react";
import { config } from "../../common/config";
import { ShyUrl, UrlRoute } from "../history";
export var View404 = observer(function () {
    function back(event: React.MouseEvent) {
        event.preventDefault();
        if (config.isPc || config.isDev) {
            UrlRoute.push(ShyUrl.root)
        }
        else if (config.isPro) {
            location.href = 'https://shy.live'
        }
    }
    return <div className='shy-404'>
        <div className='shy-404-content'>
            <h3 style={{ textAlign: 'center', fontSize: 120 }}>404</h3>
            <div className="shy-404-content-text">
                <span>当前的页面不存在,返回至<a onClick={e => back(e)} href='https://shy.live'>诗云</a></span>
            </div>
        </div>
    </div>
})