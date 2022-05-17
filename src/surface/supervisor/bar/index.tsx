import React from 'react';
import { Icon } from 'rich/component/view/icon';
import { surface } from '../..';
import { PageRouter } from './router';
import { PageUsers } from './user';
import "./style.less";
import { AppLang } from '../../../../i18n/enum';
import { AppTip } from '../../../../i18n/tip';
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

