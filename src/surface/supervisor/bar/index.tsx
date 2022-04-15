import React from 'react';
import { Icon } from 'rich/component/view/icon';
import { surface } from '../..';
import { PageRouter } from './router';
import { PageUsers } from './user';
import "./style.less";
import { AppLang } from '../../../../i18n/enum';
import { AppTip } from '../../../../i18n/tip';
import DobuleArrow from "../../../assert/svg/doubleRight.svg";
import MenuSvg from "../../../assert/svg/menu.svg";
import { observer, useLocalObservable } from 'mobx-react-lite';
import { MemberSvg } from 'rich/component/svgs';

export var Bar = observer(function () {
    var local = useLocalObservable(() => {
        return {
            isHoverMenu: false
        }
    })
    return <div className='shy-supervisor-bar'>
        <div className='shy-supervisor-bar-left'>
            {!surface.isShowSln && <a onMouseDown={e => surface.onToggleSln(true)}
                onMouseEnter={e => local.isHoverMenu = false}
                onMouseLeave={e => local.isHoverMenu = true}
                className='shy-supervisor-bar-menu'
            ><AppTip id={AppLang.UnfoldSlide} placement={'bottom'}><Icon size={14} icon={local.isHoverMenu ? MenuSvg : DobuleArrow}></Icon></AppTip>    </a>}
            <PageRouter></PageRouter>
            <PageUsers></PageUsers>
        </div>
        <div className='shy-supervisor-bar-right'>
            {/* <AppTip placement='bottom' id={AppLang.BarFavourite} ><a><Icon size={20} icon='favorite:sy' click={e => this.supervisor.onFavourite(e)}></Icon></a></AppTip> */}
            <a><Icon size={20} icon={MemberSvg}></Icon></a>
            <AppTip placement='bottom' id={AppLang.BarPublish}  ><a><Icon size={20} icon='publish:sy' click={e => surface.supervisor.onOpenPublish(e)}></Icon></a></AppTip>
            <AppTip placement='bottom' id={AppLang.BarProperty}  ><a><Icon size={20} icon='elipsis:sy' click={e => surface.supervisor.onOpenPageProperty(e)}></Icon></a></AppTip>
        </div>
    </div>
})

