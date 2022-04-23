
import React from 'react';
import { Icon } from 'rich/component/view/icon';
import { PageItem } from '../../sln/item';
import { surface } from '../..';
import PageSvg from "../../../assert/svg/page.svg";
import { observer } from 'mobx-react';
import { channel } from 'rich/net/channel';
export var PageRouter = observer(function () {
    function onClick(item) {
        if (surface.supervisor.item === item) return;
        channel.air('/page/open', { item });
    }
    var item = surface.supervisor.item;
    if (item) {
        var ra = (item: PageItem, split = false) => <><span onMouseDown={e => onClick(item)} className='shy-supervisor-bar-routers-item'><Icon icon={item.icon ? item.icon : PageSvg} size={18}></Icon><a className='shy-supervisor-bar-router-item-title'>{item.text || '新页面'}</a></span>{split && <em>/</em>}</>;
        return <div className='shy-supervisor-bar-routers'>
            {ra(item)}
        </div>
    }
    else return <></>;
})