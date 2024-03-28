import { observer } from "mobx-react-lite";
import React from "react";
import { ShyUrl, UrlRoute } from "../../history";
import { Divider } from "rich/component/view/grid";
import { surface } from "../store";
import { Button } from "rich/component/view/button";
import { S } from "rich/i18n/view";
import { config } from "../../../common/config";
import { lst } from "rich/i18n/store";

export var View404 = observer(function () {
    function back(event: React.MouseEvent) {
        event.preventDefault();
        if (window.shyConfig.isDesk || window.shyConfig.isDev) {
            UrlRoute.push(ShyUrl.root)
        }
        else if (window.shyConfig.isPro) {
            location.href = config.isUS ? "https://shy.red" : 'https://shy.live'
        }
    }
    return <div className='vw100 vh100 relative' style={{
        marginTop: window.isSite ? 60 : 0,
    }}>
        <img className="obj-center pos pos-center " style={{ maxWidth: '100%' }} src={UrlRoute.getUrl('static/img/404.png')} />
        <div className=' pos ' style={{ left: 0, right: 0, top: 20 }}>
            <div className="flex-center f-16">
                <span ><S>当前页面不存在,返回至</S><a className="gap-l-10" onClick={e => back(e)} href={config.isUS ? "https://shy.red" : 'https://shy.live'}><S>诗云</S></a></span>
            </div>
        </div>
    </div>
})

export var ViewNotAllow = observer(function () {
    return <div className='flex-center flex-auto v100'>
        <div className='gap-t-200 w-500'>
            <div className="h2 flex-center"><S>该页面未开启公开访问</S></div>
            <Divider ></Divider>
            <div className="gap-t-10">
                <div className="flex-center remark">{surface.user.isSign ? lst("如您拥有该页面的访问权限请刷新后查看", "如您拥有该页面的访问权限，请刷新后查看") : lst("如您拥有该页面的访问权限请登录后查看", "如您拥有该页面的访问权限，请登录后查看")}</div>
                <div className="flex-center gap-h-20"><Button onClick={e => UrlRoute.push(ShyUrl.home)}><S>立即使用诗云</S></Button></div>
                {!(surface.user?.isSign) && <div className="flex-center"><S text='您尚未登录诗云立即'>您尚未登录 诗云，立即</S><a href={config.isUS ? "https://shy.red/sign/in" : 'https://shy.live/sign/in'}><S>登录</S></a></div>}
            </div>
        </div>
    </div >
})