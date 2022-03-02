import { observer, useLocalObservable } from "mobx-react-lite";
import React from "react";
import { PlusSvg } from "rich/component/svgs";
import { Icon } from "rich/component/view/icon";
import FriendSvg from "../../../assert/svg/friends.svg";
import { CommunicateView } from "./communicate/communicate";
import { FriendsView } from "./friends";
import "./style.less";

export var UserChannel = observer(function () {
    var local = useLocalObservable<{ showFriend: boolean }>(() => {
        return {
            showFriend: false
        }
    })
    React.useEffect(() => {

    }, [])
    function renderCommunicate() {
        return <div className="shy-user-channel-communicate">
            <div className="shy-user-channel-communicate-head"><span>私信</span><Icon size={14} icon={PlusSvg}></Icon></div>
        </div>
    }
    return <div className="shy-user-channel">
        <div className="shy-user-channel-slide">
            <div className="shy-user-channel-slide-head">
                <div className="shy-user-channel-slide-head-wrapper"><input placeholder="搜索" /></div>
            </div>
            <div className="shy-user-friends" onMouseDown={e => local.showFriend = true}>
                <Icon icon={FriendSvg}></Icon>
                <span>好友</span>
            </div>
            {renderCommunicate()}
        </div>
        <div className="shy-user-channel-content">
            {local.showFriend && <FriendsView></FriendsView>}
            {!local.showFriend && <CommunicateView></CommunicateView>}
        </div>
    </div>
})
