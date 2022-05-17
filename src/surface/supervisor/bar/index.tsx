import React from 'react';
import { Icon } from 'rich/component/view/icon';
import { surface } from '../..';
import { PageRouter } from './router';
import { PageUsers } from './user';
import "./style.less";
import { AppLang } from '../../../../i18n/enum';
import { AppTip } from '../../../../i18n/tip';
import { observer } from 'mobx-react-lite';
import { MemberSvg } from 'rich/component/svgs';
import { ShyUrl, UrlRoute } from '../../../history';
import HomeSrc from "../../../assert/img/shy.256.png";
export var Bar = observer(function () {
    function back() {
        UrlRoute.push(ShyUrl.myWorkspace);
    }
    if (!surface.showSlideBar) {
        return <div className='shy-supervisor-bar'>
            <div className='shy-supervisor-bar-left'>
                <a href='https://shy.live' className='shy-supervisor-bar-logo'><img src={HomeSrc}  /></a>
                <PageRouter></PageRouter>
            </div>
            <div className='shy-supervisor-bar-right'>
                <PageUsers></PageUsers>
                {surface.user.isSign && <a className='shy-supervisor-bar-button' onMouseDown={e => back()}>返回我的空间</a>}
                {!surface.user.isSign && <a className='shy-supervisor-bar-button' href='https://shy.live/sign/in'>登录</a>}
            </div>
        </div>
    }
    return <div className='shy-supervisor-bar'>
        <div className='shy-supervisor-bar-left'>
            <PageRouter></PageRouter>
        </div>
        <div className='shy-supervisor-bar-right'>
            <PageUsers></PageUsers>
            {/* <AppTip placement='bottom' id={AppLang.BarFavourite} ><a><Icon size={20} icon='favorite:sy' click={e => this.supervisor.onFavourite(e)}></Icon></a></AppTip> */}
            <a><Icon size={20} icon={MemberSvg}></Icon></a>
            <AppTip placement='bottom' id={AppLang.BarPublish}  ><a><Icon size={20} icon='publish:sy' click={e => surface.supervisor.onOpenPublish(e)}></Icon></a></AppTip>
            <AppTip placement='bottom' id={AppLang.BarProperty}  ><a><Icon size={20} icon='elipsis:sy' click={e => surface.supervisor.onOpenPageProperty(e)}></Icon></a></AppTip>
        </div>
    </div>
})

