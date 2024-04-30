import lodash from "lodash";
import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React from "react";
import { createPortal } from "react-dom";
import { Avatar } from "rich/component/view/avator/face";
import { Input } from "rich/component/view/input";
import { channel } from "rich/net/channel";
import { UserBasic } from "rich/types/user";
import { userChannelStore } from "../store";
import { S } from "rich/i18n/view";
import { lst } from "rich/i18n/store";
import { Spin } from "rich/component/view/spin";

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
            local.load = false;
            local.word = '';
            local.users = [];
        })
    }
    var local = useLocalObservable<{ load: boolean, word: string, users: UserBasic[] }>(() => {
        return {
            word: '',
            load: false,
            users: []
        }
    })
    var change = lodash.debounce(async function () {
        runInAction(() => {
            local.load = true;
            local.users = [];
        })
        var rs = await channel.get('/search/friends', { name: local.word });
        if (rs.ok) {
            runInAction(() => {
                local.load = false;
                local.users = rs.data.list;
                if (!Array.isArray(local.users)) local.users = [];
            })
        }
        else {
            runInAction(() => {
                local.load = false;
                local.users = [];
            })
        }
    }, 700);
    async function select(user: UserBasic) {
        onClear();
        refInput.current.onClear();
        if (user.id) userChannelStore.openUserChannel(user.id);
    }
    return <div className="shy-user-channel-slide-head-search">
        <Input theme="focus" value={local.word}
            ref={e => refInput.current = e}
            placeholder={lst("搜索")}
            onChange={e => {
                if (!e) local.word = '';
                else local.word = e;
                change()
            }}
            onEnter={() => {
                local.word = '';
                change.flush()
            }}
            clear
            onClear={onClear}
        />
        {createPortal(local.word && <div className="shy-user-channel-search-drops shadow-s border-light round bg-white padding-10">
            {
                Array.isArray(local.users) && local.users.map(user => {
                    return <div
                        onMouseDown={e => select(user)}
                        key={user.id}
                        className="shy-user-channel-search-drops-user" ><Avatar size={32} showName userid={user.id}></Avatar></div>
                })
            }
            {local.load && <div className="flex-center">
                <Spin></Spin>
            </div>}
            {Array.isArray(local.users) && local.users.length == 0 && <div className="shy-user-channel-search-result">
                <div className="remark f-12"><S>没有搜到</S></div>
            </div>}
        </div>, ele.current)}
    </div>
})