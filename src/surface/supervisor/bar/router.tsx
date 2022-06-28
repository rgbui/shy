
import React from 'react';
import { Icon } from 'rich/component/view/icon';
import { surface } from '../..';
import PageSvg from "../../../assert/svg/page.svg";
import { observer } from 'mobx-react';
import { channel } from 'rich/net/channel';
import { LockSvg } from 'rich/component/svgs';
import { Loading } from 'rich/component/view/loading';
import { util } from 'rich/util/util';
export var PageRouter = observer(function () {
    function onClick(item) {
        if (surface.supervisor.item === item) return;
        channel.air('/page/open', { item });
    }
    var item = surface.supervisor.item;
    if (item) {
        return <div className='shy-supervisor-bar-router'>
            <span onMouseDown={e => onClick(item)} className='shy-supervisor-bar-router-item'><Icon icon={item.icon ? item.icon : PageSvg} size={18}></Icon><a className='shy-supervisor-bar-router-item-title'>{item.text || '新页面'}</a></span>
            {item.editDate && <span className='shy-supervisor-bar-router-time'>保存于{util.showTime(item.editDate)}</span>}
            {item.snapSaving && <span className='shy-supervisor-bar-router-save'><Loading></Loading>保存中...</span>}
            {item.locker?.userid && <div className='shy-supervisor-bar-router-locker'><Icon size={18} icon={LockSvg}></Icon></div>}
        </div>
    }
    else return <></>;
})