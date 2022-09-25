import { observer } from 'mobx-react';
import React from 'react';
import { UserAvatars } from 'rich/component/view/avator/users';
import { surface } from '../..';
import { PageViewStore } from '../view/store';
export var PageUsers = observer(function (props: { store: PageViewStore }) {
    React.useEffect(() => {
        surface.workspace.loadViewOnlineUsers(item.id);
    }, [])
    var item = props.store.item;
    if (item) {
        var viewUsers = surface.workspace.viewOnlineUsers.get(item.id);
        if (viewUsers) {
            var us = [];
            if (viewUsers.users.size > 0) {
                us = Array.from(viewUsers.users);
                if (surface.user)
                    us.push(surface.user.id)
            }
            return <div className='shy-supervisor-bar-users' style={{ height: 28 }}>
                <UserAvatars users={us} size={28}></UserAvatars>
            </div>
        }
    }
    return <></>;
})