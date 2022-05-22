
import React from 'react';
import { Icon } from 'rich/component/view/icon';
import { surface } from '../..';
import PageSvg from "../../../assert/svg/page.svg";
import { observer } from 'mobx-react';
import { channel } from 'rich/net/channel';
import { LockSvg } from 'rich/component/svgs';
export var PageRouter = observer(function () {
    function onClick(item) {
        if (surface.supervisor.item === item) return;
        channel.air('/page/open', { item });
    }
    var item = surface.supervisor.item;
    if (item) {
        return <div className='shy-supervisor-bar-router'>
            <span onMouseDown={e => onClick(item)} className='shy-supervisor-bar-router-item'><Icon icon={item.icon ? item.icon : PageSvg} size={18}></Icon><a className='shy-supervisor-bar-router-item-title'>{item.text || '新页面'}</a></span>
            {item.locker?.userid && <div className='shy-supervisor-bar-router-locker'><Icon size={18} icon={LockSvg}></Icon></div>}
        </div>
    }
    else return <></>;
})