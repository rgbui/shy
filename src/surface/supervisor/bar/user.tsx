import { observer } from 'mobx-react';
import React from 'react';
import { Avatar } from 'rich/component/view/avator/face';
import { surface } from '../..';

export var PageUsers = observer(function () {
    var item = surface.supervisor.item;
    if (item) {
        var users = surface.workspace.onlineUsers.get(item.id);
        return <div className='shy-supervisor-bar-users'>
            {users.map(user => {
                return <Avatar size={30} userid={user.userid}></Avatar>
            })}
        </div>
    }
    else return <></>;
})