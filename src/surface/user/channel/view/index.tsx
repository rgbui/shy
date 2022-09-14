import { observer } from "mobx-react-lite";
import React from "react";
import { Icon } from "rich/component/view/icon";
import { Input } from "rich/component/view/input";
import FriendSvg from "../../../../assert/svg/friends.svg";
import { UserProfile } from "../../profile";
import { CommunicateView } from "../communicate";
import { FriendsView } from "../friends";
import { userChannelStore } from "../store";
import { UserChannels } from "./channels";
import { UserChannelSearch } from "./search";
import "./style.less";
export var UserChannel = observer(function () {
    return <div className="shy-user-channel">
        <div className="shy-user-channel-slide">
            <div className="shy-user-channel-slide-head">
                <UserChannelSearch></UserChannelSearch>
            </div>
            <div className={"shy-user-friends cursor" + (userChannelStore.showFriend ? " hover" : "")} onMouseDown={e => userChannelStore.openFriends()}>
                <Icon icon={FriendSvg}></Icon>
                <span>好友</span>
            </div>
            <UserChannels></UserChannels>
            <UserProfile></UserProfile>
        </div>
        <div className="shy-user-channel-content">
            {userChannelStore.showFriend && <FriendsView></FriendsView>}
            {!userChannelStore.showFriend && <CommunicateView></CommunicateView>}
        </div>
    </div>
})
