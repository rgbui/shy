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
            return <div className='shy-supervisor-bar-users' style={{ height: 28 }}>
                <UserAvatars users={viewUsers.users} size={28}></UserAvatars>
            </div>
        }
    }
    return <></>;
})