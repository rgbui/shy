import { observer } from "mobx-react";
import React from "react";
import { SettingsSvg } from "rich/component/svgs";
import { Avatar } from "rich/component/view/avator/face";
import { Icon } from "rich/component/view/icon";
import { surface } from "../..";

export var UserProfile = observer(function () {
    return <div className="shy-user-profile">
        <Avatar icon={surface.user.avatar} text={surface.user.name}></Avatar>
        <div className="shy-user-profile-operators">
            <Icon icon={SettingsSvg}></Icon>
        </div>
    </div>
});