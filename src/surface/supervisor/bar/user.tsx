import { observer } from 'mobx-react';
import React from 'react';
import { Avatar } from 'rich/component/view/avator/face';
import { surface } from '../..';
import { PageViewStore } from '../view/store';
export var PageUsers = observer(function (props: { store: PageViewStore }) {
    React.useEffect(() => {
        surface.workspace.loadViewOnlineUsers(item.id);
    },[])
    var item = props.store.item;
    if (item) {
        var viewUsers = surface.workspace.viewOnlineUsers.get(item.id);
        if (viewUsers) {
            return <div className='shy-supervisor-bar-users' style={{ height: 28 }}>
                {viewUsers.users.map(user => {
                    return <Avatar key={user} size={28} userid={user}></Avatar>
                })}
            </div>
        }
    }
    return <></>;
})