import { observer } from 'mobx-react';
import React from 'react';
import { Avatar } from 'rich/component/view/avator/face';
import { surface } from '../..';
import { PageViewStore } from '../view/store';

export var PageUsers = observer(function (props: { store: PageViewStore }) {
    var item = props.store.item;
    if (item) {
        var users = surface.workspace.onlineUsers.get(item.id) || [];
        var size = 28;
        return <div className='shy-supervisor-bar-users' style={{ height: size }}>
            {users.findAll(user => user ? true : false).map(user => {
                return <Avatar key={user.userid} size={size} userid={user.userid}></Avatar>
            })}
        </div>
    }
    else return <></>;
})