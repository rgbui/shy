import { observer } from "mobx-react-lite";
import React from "react";
import { ShyUrl, UrlRoute } from "../history";
import { Divider } from "rich/component/view/grid";
import { surface } from "./store";
import { Button } from "rich/component/view/button";
export var View404 = observer(function () {
    function back(event: React.MouseEvent) {
        event.preventDefault();
        if (window.shyConfig.isPc || window.shyConfig.isDev) {
            UrlRoute.push(ShyUrl.root)
        }
        else if (window.shyConfig.isPro) {
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

export var ViewNotAllow = observer(function () {
    return <div className='flex-center flex-auto v100'>
        <div className='gap-t-200 w-500'>
            <div className="h2 flex-center">该页面未开启公开访问</div>
            <Divider ></Divider>
            <div className="gap-t-10">
                <div className="flex-center remark">如您拥有该页面的访问权限，请{surface.user.isSign ? "刷新" : "登录"}后查看</div>
                <div className="flex-center gap-h-20"><Button onClick={e => UrlRoute.push(ShyUrl.home)}>立即使用诗云</Button></div>
                {!(surface.user?.isSign) && <div className="flex-center">您尚未登录 诗云，立即<a href='https://shy.live/sign/in'>登录</a></div>}
            </div>
        </div>
    </div >
})