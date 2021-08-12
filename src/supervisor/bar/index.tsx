import React from 'react';
import { Icon } from 'rich/component/icon';
import { surface } from '../../surface';
import { PageRouter } from './router';
import { PageUsers } from './user';
import "./style.less";

import { AppLang } from '../../../i18n/enum';
import { AppTip } from '../../../i18n/tip';
export class Bar extends React.Component {
    render() {
        return <div className='shy-supervisor-bar'>
            <div className='shy-supervisor-bar-left'>
                <PageRouter></PageRouter>
                <PageUsers></PageUsers>
            </div>
            <div className='shy-supervisor-bar-right'>
                <AppTip placement='bottom' id={AppLang.BarFavourite} ><a><Icon size={20} icon='favorite:sy' click={e => this.supervisor.onFavourite(e)}></Icon></a></AppTip>
                <AppTip placement='bottom' id={AppLang.BarPublish}  ><a><Icon size={20} icon='publish:sy' click={e => this.supervisor.onOpenPublish(e)}></Icon></a></AppTip>
                <AppTip placement='bottom' id={AppLang.BarProperty}  ><a><Icon size={20} icon='elipsis:sy' click={e => this.supervisor.onOpenPageProperty(e)}></Icon></a></AppTip>
            </div>
        </div>
    }
    get supervisor() {
        return surface.supervisor;
    }
}