import lodash from "lodash";
import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { createPortal } from "react-dom";
import { Avatar } from "rich/component/view/avator/face";
import { Input } from "rich/component/view/input";
import { Remark } from "rich/component/view/text";
import { channel } from "rich/net/channel";
import { UserBasic } from "rich/types/user";
import { userChannelStore } from "../store";
import { S } from "rich/i18n/view";
import { lst } from "rich/i18n/store";

export var UserChannelSearch = observer(function () {
    var refInput = React.useRef<Input>(null);
    var ele = React.useRef<HTMLElement>(document.body.appendChild(document.createElement('div')));
    React.useEffect(() => {
        return () => {
            if (ele.current)
                ele.current.remove();
        }
    }, []);
    function onClear() {
        runInAction(() => {
            local.start = false;
            local.name = '';
            local.users = [];
        })
    }
    var local = useLocalObservable<{ start: boolean, name: string, users: UserBasic[] }>(() => {
        return {
            start: false,
            name: '',
            users: []
        }
    })
    var change = lodash.debounce(async function (value) {
        if (!value) return;
        local.name = value;
        var rs = await channel.get('/search/friends', { name: value });
        if (rs.ok) {
            local.users = rs.data.list;
        }
    }, 1200);
    async function select(user: UserBasic) {
        onClear();
        refInput.current.onClear();
        if (user.id)
            userChannelStore.openUserChannel(user.id);
    }
    return <div className="shy-user-channel-slide-head-search">
        <Input size='small'
            ref={e => refInput.current = e}
            placeholder={lst("搜索")}
            onChange={e => { local.start = true; change(e) }}
            clear onClear={onClear}
        />
        {createPortal(local.start && <div className="shy-user-channel-search-drops">
            {
                local.users.map(user => {
                    return <div onMouseDown={e => select(user)} key={user.id} className="shy-user-channel-search-drops-user" ><Avatar size={32} showName userid={user.id}></Avatar></div>
                })
            }
            {local.users.length == 0 && <div className="shy-user-channel-search-result">
                <Remark><S>没有搜索</S></Remark>
            </div>}
        </div>, ele.current)}
    </div>
})