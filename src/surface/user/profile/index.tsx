import { observer } from "mobx-react";
import React from "react";
import { SettingsSvg } from "rich/component/svgs";
import { Avatar } from "rich/component/view/avator/face";
import { Icon } from "rich/component/view/icon";
import { surface } from "../..";

export var UserProfile = observer(function () {
    return <div className="shy-user-profile">
        {surface.user && <Avatar userid={surface.user.id}></Avatar>}
        <div className="shy-user-profile-operators">
            <Icon icon={SettingsSvg}></Icon>
        </div>
    </div>
});