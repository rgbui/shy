import { observer, useLocalObservable } from "mobx-react-lite";
import React from "react";
import { Icon } from "rich/component/view/icon";
import FriendSvg from "../../../assert/svg/friends.svg";
import { CommunicateView } from "./communicate";
import { FriendsView } from "./friends";

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

        </div>
    }
    return <div className="shy-user-channel">
        <div className="shy-user-channel-slide">
            <div className="shy-user-friends" onMouseDown={e => local.showFriend = true}>
                <Icon icon={FriendSvg}></Icon>
                <span>好友</span>
            </div>
            {renderCommunicate()}
        </div>
        <div className="shy-user-channel-content">
            {local.showFriend && FriendsView()}
            {!local.showFriend && CommunicateView()}
        </div>
    </div>
})
